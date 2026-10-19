/**
 * Speech-to-text en el dispositivo: envía el audio grabado al worker de Whisper.
 * Expone el estado del modelo (descarga/listo) como un pequeño store externo
 * para usarlo con `useSyncExternalStore`.
 */
import type { LanguageCode } from "@/types/learning";
import type { WorkerRequest, WorkerResponse } from "@/workers/whisper.worker";

export interface ModelState {
  status: "idle" | "loading" | "ready" | "error";
  /** 0–100 durante la descarga */
  progress: number;
  totalMB: number;
  error?: string;
}

let state: ModelState = { status: "idle", progress: 0, totalMB: 0 };
const listeners = new Set<() => void>();
const setState = (patch: Partial<ModelState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export const modelStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getSnapshot: () => state,
  getServerSnapshot: () => state,
};

let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, { resolve: (t: string) => void; reject: (e: Error) => void }>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("../workers/whisper.worker.ts", import.meta.url), { type: "module" });
  worker.addEventListener("message", (e: MessageEvent<WorkerResponse>) => {
    const msg = e.data;
    switch (msg.type) {
      case "progress":
        setState({ status: "loading", progress: msg.progress, totalMB: Math.round(msg.total / 1e6) });
        break;
      case "ready":
        setState({ status: "ready", progress: 100 });
        break;
      case "result":
        pending.get(msg.id)?.resolve(msg.text);
        pending.delete(msg.id);
        break;
      case "error":
        if (msg.id !== undefined) {
          pending.get(msg.id)?.reject(new Error(msg.message));
          pending.delete(msg.id);
        } else setState({ status: "error", error: msg.message });
        break;
    }
  });
  return worker;
}

const send = (msg: WorkerRequest, transfer: Transferable[] = []) => getWorker().postMessage(msg, transfer);

/** Empieza a cargar el modelo (descarga la primera vez; luego sale de la caché). */
export function preloadModel() {
  if (state.status === "loading" || state.status === "ready") return;
  setState({ status: "loading", error: undefined });
  send({ type: "load" });
}

/** Convierte la grabación a PCM mono de 16 kHz, el formato que espera Whisper. */
async function toPcm16k(blob: Blob): Promise<Float32Array> {
  const buf = await blob.arrayBuffer();
  const decodeCtx = new AudioContext();
  try {
    const decoded = await decodeCtx.decodeAudioData(buf);
    const frames = Math.ceil(decoded.duration * 16000);
    const offline = new OfflineAudioContext(1, frames, 16000);
    const src = offline.createBufferSource();
    src.buffer = decoded;
    src.connect(offline.destination);
    src.start();
    const rendered = await offline.startRendering();
    return rendered.getChannelData(0);
  } finally {
    void decodeCtx.close();
  }
}

export async function transcribe(blob: Blob, language: LanguageCode): Promise<string> {
  preloadModel();
  const audio = await toPcm16k(blob);
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    send({ type: "transcribe", id, audio, language: language === "zh" ? "chinese" : "english" }, [audio.buffer]);
  });
}
