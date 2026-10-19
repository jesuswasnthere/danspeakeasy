/**
 * Reconocimiento de voz en el dispositivo (Whisper vía transformers.js).
 * Corre en un Web Worker para no bloquear la interfaz. El modelo se descarga
 * una sola vez desde Hugging Face y queda en la caché del navegador.
 */
import { env, pipeline } from "@huggingface/transformers";

env.allowLocalModels = false;

const MODEL = "onnx-community/whisper-base";

export type WorkerRequest =
  | { type: "load" }
  | { type: "transcribe"; id: number; audio: Float32Array; language: "chinese" | "english" };

export type WorkerResponse =
  | { type: "progress"; progress: number; loaded: number; total: number }
  | { type: "ready" }
  | { type: "result"; id: number; text: string }
  | { type: "error"; id?: number; message: string };

type Transcriber = (audio: Float32Array, options: Record<string, unknown>) => Promise<{ text: string } | { text: string }[]>;

let transcriber: Promise<Transcriber> | null = null;

const post = (msg: WorkerResponse) => (self as unknown as { postMessage(m: WorkerResponse): void }).postMessage(msg);

const onProgress = (p: { status: string; progress?: number; loaded?: number; total?: number }) => {
  if (p.status === "progress_total") post({ type: "progress", progress: p.progress ?? 0, loaded: p.loaded ?? 0, total: p.total ?? 0 });
};

type GpuNavigator = { gpu?: { requestAdapter(): Promise<{ features: Set<string> } | null> } };

/**
 * Configuración según el hardware:
 * - Con WebGPU: el encoder (lo costoso: procesa siempre una ventana de 30 s) va en
 *   la GPU; el decoder (barato para frases cortas) en CPU cuantizado.
 * - Sin WebGPU: todo en CPU (WASM) cuantizado a 8 bits.
 */
async function createPipeline(): Promise<Transcriber> {
  const adapter = await (navigator as unknown as GpuNavigator).gpu?.requestAdapter().catch(() => null);
  if (adapter) {
    try {
      const asr = await pipeline("automatic-speech-recognition", MODEL, {
        device: { encoder_model: "webgpu", decoder_model_merged: "wasm" },
        dtype: { encoder_model: adapter.features.has("shader-f16") ? "fp16" : "fp32", decoder_model_merged: "q8" },
        progress_callback: onProgress,
      });
      return asr as unknown as Transcriber;
    } catch {
      // WebGPU disponible pero no utilizable: seguimos con CPU.
    }
  }
  const asr = await pipeline("automatic-speech-recognition", MODEL, { device: "wasm", dtype: "q8", progress_callback: onProgress });
  return asr as unknown as Transcriber;
}

function load(): Promise<Transcriber> {
  transcriber ??= createPipeline()
    .then(async (asr) => {
      // Calentamiento: la primera inferencia compila los shaders/kernels.
      await asr(new Float32Array(16000), { language: "english", task: "transcribe" }).catch(() => {});
      post({ type: "ready" });
      return asr;
    })
    .catch((e) => {
      transcriber = null;
      throw e;
    });
  return transcriber;
}

self.addEventListener("message", async (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data;
  try {
    if (msg.type === "load") {
      await load();
      return;
    }
    const asr = await load();
    const out = await asr(msg.audio, { language: msg.language, task: "transcribe" });
    const text = Array.isArray(out) ? out.map((o) => o.text).join(" ") : out.text;
    post({ type: "result", id: msg.id, text: text.trim() });
  } catch (e) {
    post({ type: "error", id: msg.type === "transcribe" ? msg.id : undefined, message: e instanceof Error ? e.message : String(e) });
  }
});
