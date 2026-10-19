"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LANGUAGES } from "@/data/levels";
import type { LanguageCode } from "@/types/learning";

/**
 * Graba la voz del alumno (MediaRecorder, para volver a escucharse), mide el
 * nivel del micrófono en vivo y, si el navegador lo soporta, la transcribe con la
 * Web Speech API (SpeechRecognition). Funciona en Chrome y Edge de escritorio
 * (requiere internet). No funciona en Firefox, en Brave ni en navegadores
 * integrados en otras apps (p. ej. el panel de navegador de Claude), que bloquean
 * el micrófono o no tienen servicio de reconocimiento.
 *
 * Importante: SpeechRecognition siempre escucha el micrófono PREDETERMINADO del
 * navegador; el selector de dispositivo solo afecta a la grabación y al medidor.
 */

interface RecognitionAlternative {
  transcript: string;
}
interface RecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: RecognitionAlternative;
}
interface RecognitionEvent {
  results: { length: number; [index: number]: RecognitionResult };
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onaudiostart: (() => void) | null;
  onsoundstart: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Navegadores integrados en apps de escritorio (Electron) bloquean micrófono y dictado. */
export function isEmbeddedBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Electron|Claude\//i.test(navigator.userAgent);
}

/** Brave expone SpeechRecognition pero no tiene servicio detrás (falla con "network"). */
function isBrave(): boolean {
  return typeof navigator !== "undefined" && "brave" in navigator;
}

export type MicIssue = "embedded" | "denied" | "no-service" | null;

const ERRORS: Record<string, string> = {
  "not-allowed":
    "El navegador bloqueó el micrófono. Pulsa el icono del candado (o de la cámara) en la barra de direcciones, permite «Micrófono» y recarga la página.",
  "service-not-allowed": "Este navegador no ofrece reconocimiento de voz. Abre la página en Chrome o Edge.",
  "no-speech": "No he detectado voz. Usa «Probar micrófono» para comprobar que llega sonido y habla cerca del micrófono.",
  "audio-capture":
    "No llega audio del micrófono. Revisa que esté conectado y seleccionado en Windows (Configuración → Sistema → Sonido → Entrada).",
  network:
    "El servicio de reconocimiento de voz no responde. Comprueba tu conexión; si usas Brave u otro navegador no compatible, abre la página en Chrome o Edge.",
};

const DEVICE_KEY = "lingoaula-mic-device";

function readDevicePref(): string {
  try {
    return localStorage.getItem(DEVICE_KEY) ?? "";
  } catch {
    return "";
  }
}

export type RecorderStatus = "idle" | "listening" | "testing" | "done" | "error";

export function useVoiceRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [interim, setInterim] = useState("");
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  /** Nivel del micrófono 0–1 mientras se escucha o se prueba. */
  const [level, setLevel] = useState(0);
  /** Pico máximo alcanzado en la última escucha/prueba (0–1). */
  const [peak, setPeak] = useState(0);
  const [issue, setIssue] = useState<MicIssue>(() =>
    isEmbeddedBrowser() ? "embedded" : isBrave() ? "no-service" : null,
  );
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceIdState] = useState<string>(readDevicePref);
  /** Eventos del reconocedor, para saber si llegó a captar audio/sonido. */
  const [heardByRecognizer, setHeardByRecognizer] = useState(false);

  const recRef = useRef<Recognition | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const urlRef = useRef<string | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const peakRef = useRef(0);

  const recognitionSupported = recognitionCtor() !== null && !isBrave();
  const recordingSupported = typeof window !== "undefined" && "MediaRecorder" in window && !!navigator.mediaDevices;

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const all = await navigator.mediaDevices.enumerateDevices();
    setDevices(all.filter((d) => d.kind === "audioinput" && d.deviceId !== "communications"));
  }, []);

  const setDeviceId = useCallback((id: string) => {
    setDeviceIdState(id);
    try {
      localStorage.setItem(DEVICE_KEY, id);
    } catch {
      /* sin almacenamiento: solo para esta sesión */
    }
  }, []);

  // Permiso del micrófono y lista de dispositivos.
  // (La lista se carga al saber que hay permiso, al probar y al grabar.)
  useEffect(() => {
    navigator.mediaDevices?.addEventListener?.("devicechange", refreshDevices);
    let perm: PermissionStatus | null = null;
    const sync = () => {
      if (!perm) return;
      const denied = perm.state === "denied";
      setIssue((cur) => (cur === "embedded" ? cur : denied ? "denied" : cur === "denied" ? null : cur));
      if (perm.state === "granted") void refreshDevices();
    };
    navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((s) => {
        perm = s;
        sync();
        s.onchange = sync;
      })
      .catch(() => {});
    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", refreshDevices);
      if (perm) perm.onchange = null;
    };
  }, [refreshDevices]);

  /**
   * Crear/reanudar el AudioContext DENTRO del clic: si se crea después de un
   * `await` (p. ej. el permiso), Chrome lo deja suspendido y el medidor marca 0.
   */
  const prepareAudioContext = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") ctxRef.current = new AudioContext();
    void ctxRef.current.resume();
  }, []);

  const stopMeter = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setLevel(0);
    setPeak(peakRef.current);
  }, []);

  const startMeter = useCallback((stream: MediaStream) => {
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    void ctx.resume();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const data = new Float32Array(analyser.fftSize);
    peakRef.current = 0;
    setPeak(0);
    const tick = () => {
      analyser.getFloatTimeDomainData(data);
      let sum = 0;
      for (const v of data) sum += v * v;
      const rms = Math.sqrt(sum / data.length);
      // Escala logarítmica: −60 dB → 0, −10 dB → 1.
      const db = 20 * Math.log10(rms || 1e-8);
      const lvl = Math.max(0, Math.min(1, (db + 60) / 50));
      peakRef.current = Math.max(peakRef.current, lvl);
      setLevel(lvl);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopMedia = useCallback(() => {
    stopMeter();
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    mediaRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, [stopMeter]);

  useEffect(
    () => () => {
      recRef.current?.abort();
      stopMedia();
      void ctxRef.current?.close();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [stopMedia],
  );

  /** Abre el micrófono elegido (o el predeterminado). */
  const openStream = useCallback(async () => {
    const constraints: MediaTrackConstraints = { echoCancellation: false, noiseSuppression: false, autoGainControl: true };
    if (deviceId) constraints.deviceId = { exact: deviceId };
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: constraints });
    } catch (e) {
      // El dispositivo guardado ya no existe: probar con el predeterminado.
      if (deviceId && e instanceof DOMException && e.name === "OverconstrainedError") {
        setDeviceId("");
        return navigator.mediaDevices.getUserMedia({ audio: true });
      }
      throw e;
    }
  }, [deviceId, setDeviceId]);

  const handleMediaError = useCallback((e: unknown) => {
    const name = e instanceof DOMException ? e.name : "";
    if (name !== "NotFoundError") setIssue((cur) => (cur === "embedded" ? cur : "denied"));
    setError(name === "NotFoundError" ? ERRORS["audio-capture"] : ERRORS["not-allowed"]);
    setStatus("error");
  }, []);

  /** Prueba del micrófono: solo medidor (sin reconocimiento ni grabación). */
  const startTest = useCallback(async () => {
    prepareAudioContext();
    setError(null);
    try {
      const stream = await openStream();
      streamRef.current = stream;
      startMeter(stream);
      setStatus("testing");
      void refreshDevices(); // con permiso concedido ya hay nombres de dispositivo
    } catch (e) {
      handleMediaError(e);
    }
  }, [prepareAudioContext, openStream, startMeter, refreshDevices, handleMediaError]);

  const stopTest = useCallback(() => {
    stopMedia();
    setStatus("idle");
  }, [stopMedia]);

  const start = useCallback(
    async (language: LanguageCode) => {
      prepareAudioContext();
      stopMedia();
      setError(null);
      setInterim("");
      setAlternatives([]);
      setHeardByRecognizer(false);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
      setAudioUrl(null);

      // 1) Reconocimiento PRIMERO (usa el micrófono predeterminado del navegador).
      const Ctor = recognitionSupported ? recognitionCtor() : null;
      let finals: string[] = [];
      let lastInterim = "";
      let failed = false;
      let gotSound = false;
      if (Ctor) {
        const rec = new Ctor();
        rec.lang = LANGUAGES[language].speechLang;
        rec.interimResults = true;
        rec.maxAlternatives = 4;
        rec.continuous = false;
        rec.onsoundstart = () => {
          gotSound = true;
          setHeardByRecognizer(true);
        };
        rec.onresult = (e) => {
          const alts: string[] = [];
          let live = "";
          let allFinal = true;
          for (let i = 0; i < e.results.length; i++) {
            const r = e.results[i];
            live += r[0].transcript;
            allFinal &&= r.isFinal;
            for (let k = 0; k < r.length; k++) alts[k] = (alts[k] ?? "") + r[k].transcript;
          }
          lastInterim = live;
          setInterim(live);
          if (allFinal) finals = alts.filter(Boolean);
        };
        rec.onerror = (e) => {
          if (e.error === "aborted" || e.error === "no-speech") return; // se resuelve en onend
          failed = true;
          if (e.error === "network" || e.error === "service-not-allowed") setIssue((c) => c ?? "no-service");
          if (e.error === "not-allowed") setIssue((c) => (c === "embedded" ? c : "denied"));
          setError(ERRORS[e.error] ?? `Error de reconocimiento: ${e.error}`);
          setStatus("error");
        };
        rec.onend = () => {
          recRef.current = null;
          const meterHeard = peakRef.current > 0.35;
          stopMedia();
          if (failed) return;
          // Sin resultado "final": usamos lo último que entendió.
          const result = finals.length ? finals : lastInterim.trim() ? [lastInterim] : [];
          setAlternatives(result);
          if (result.length) {
            setStatus("done");
            return;
          }
          setError(
            gotSound || meterHeard
              ? "Te oí, pero no pude entender las palabras. Habla un poco más despacio y claro, y espera a que termine de escuchar."
              : ERRORS["no-speech"],
          );
          setStatus("error");
        };
        recRef.current = rec;
        try {
          rec.start();
        } catch {
          setError(ERRORS["service-not-allowed"]);
          setStatus("error");
          return;
        }
      }
      setStatus("listening");

      // 2) Captura propia: medidor + grabación para escucharte después.
      if (recordingSupported) {
        try {
          const stream = await openStream();
          if (Ctor && !recRef.current) {
            // El reconocimiento ya terminó mientras se pedía el permiso.
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          startMeter(stream);
          const chunks: Blob[] = [];
          const mr = new MediaRecorder(stream);
          mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
          mr.onstop = () => {
            const url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType }));
            urlRef.current = url;
            setAudioUrl(url);
          };
          mr.start();
          mediaRef.current = mr;
          void refreshDevices();
        } catch (e) {
          if (!Ctor) handleMediaError(e);
          // Con reconocimiento activo, seguimos sin medidor ni grabación.
        }
      }
    },
    [prepareAudioContext, stopMedia, recognitionSupported, recordingSupported, openStream, startMeter, refreshDevices, handleMediaError],
  );

  const stop = useCallback(() => {
    if (recRef.current) recRef.current.stop();
    else {
      stopMedia();
      setStatus("done");
    }
  }, [stopMedia]);

  const playRecording = useCallback(() => {
    if (urlRef.current) void new Audio(urlRef.current).play();
  }, []);

  return {
    status,
    interim,
    alternatives,
    error,
    audioUrl,
    level,
    peak,
    issue,
    devices,
    deviceId,
    setDeviceId,
    heardByRecognizer,
    start,
    stop,
    startTest,
    stopTest,
    playRecording,
    recognitionSupported,
    recordingSupported,
  };
}
