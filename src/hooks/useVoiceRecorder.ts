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
  "service-not-allowed":
    "Este navegador no ofrece reconocimiento de voz. Abre la página en Chrome o Edge.",
  "no-speech":
    "No he detectado voz. Pulsa el micrófono, espera a ver moverse el medidor y habla cerca del micrófono.",
  "audio-capture":
    "No llega audio del micrófono. Revisa que esté conectado y seleccionado en Windows (Configuración → Sistema → Sonido → Entrada).",
  network:
    "El servicio de reconocimiento de voz no responde. Comprueba tu conexión; si usas Brave u otro navegador no compatible, abre la página en Chrome o Edge.",
};

export type RecorderStatus = "idle" | "listening" | "done" | "error";

export function useVoiceRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [interim, setInterim] = useState("");
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  /** Nivel del micrófono 0–1 mientras se escucha. */
  const [level, setLevel] = useState(0);
  /** true si en toda la grabación no llegó sonido apreciable. */
  const [silent, setSilent] = useState(false);
  const [issue, setIssue] = useState<MicIssue>(() =>
    isEmbeddedBrowser() ? "embedded" : isBrave() ? "no-service" : null,
  );

  const recRef = useRef<Recognition | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const urlRef = useRef<string | null>(null);
  const meterRef = useRef<{ ctx: AudioContext; raf: number } | null>(null);
  const peakRef = useRef(0);

  const recognitionSupported = recognitionCtor() !== null && !isBrave();
  const recordingSupported = typeof window !== "undefined" && "MediaRecorder" in window && !!navigator.mediaDevices;

  // Permiso del micrófono: si ya está denegado, avisamos antes de pulsar.
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions) return;
    let status: PermissionStatus | null = null;
    const sync = () => {
      if (!status) return;
      setIssue((cur) => (cur === "embedded" ? cur : status!.state === "denied" ? "denied" : cur === "denied" ? null : cur));
    };
    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((s) => {
        status = s;
        sync();
        s.onchange = sync;
      })
      .catch(() => {});
    return () => {
      if (status) status.onchange = null;
    };
  }, []);

  const stopMeter = useCallback(() => {
    if (!meterRef.current) return;
    cancelAnimationFrame(meterRef.current.raf);
    void meterRef.current.ctx.close();
    meterRef.current = null;
    setLevel(0);
  }, []);

  const startMeter = useCallback((stream: MediaStream) => {
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    peakRef.current = 0;
    const tick = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (const v of data) sum += ((v - 128) / 128) ** 2;
      const rms = Math.sqrt(sum / data.length);
      const lvl = Math.min(1, rms * 6);
      peakRef.current = Math.max(peakRef.current, lvl);
      setLevel(lvl);
      if (meterRef.current) meterRef.current.raf = requestAnimationFrame(tick);
    };
    meterRef.current = { ctx, raf: requestAnimationFrame(tick) };
  }, []);

  const stopMedia = useCallback(() => {
    stopMeter();
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, [stopMeter]);

  useEffect(
    () => () => {
      recRef.current?.abort();
      stopMedia();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [stopMedia],
  );

  const start = useCallback(
    async (language: LanguageCode) => {
      setError(null);
      setInterim("");
      setAlternatives([]);
      setSilent(false);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
      setAudioUrl(null);

      // 1) Micrófono: grabación para autoescucha + medidor de nivel.
      if (recordingSupported) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          });
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
        } catch (e) {
          const name = e instanceof DOMException ? e.name : "";
          setIssue((cur) => (cur === "embedded" ? cur : name === "NotFoundError" ? cur : "denied"));
          setError(name === "NotFoundError" ? ERRORS["audio-capture"] : ERRORS["not-allowed"]);
          setStatus("error");
          return;
        }
      }

      // 2) Reconocimiento de voz (si existe).
      const Ctor = recognitionSupported ? recognitionCtor() : null;
      if (!Ctor) {
        setStatus("listening"); // solo graba; el alumno detiene manualmente
        return;
      }
      const rec = new Ctor();
      rec.lang = LANGUAGES[language].speechLang;
      rec.interimResults = true;
      rec.maxAlternatives = 4;
      rec.continuous = false;
      let finals: string[] = [];
      let lastInterim = "";
      let failed = false;
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
        if (e.error === "aborted") return;
        // "no-speech" se resuelve en onend: puede que haya texto provisional útil.
        if (e.error === "no-speech") return;
        failed = true;
        if (e.error === "network" || e.error === "service-not-allowed") setIssue((c) => c ?? "no-service");
        if (e.error === "not-allowed") setIssue((c) => (c === "embedded" ? c : "denied"));
        setError(ERRORS[e.error] ?? `Error de reconocimiento: ${e.error}`);
        setStatus("error");
      };
      rec.onend = () => {
        recRef.current = null;
        const heardSomething = peakRef.current > 0.08;
        stopMedia();
        if (failed) return;
        // Si el reconocedor terminó sin resultado "final", usamos lo último que entendió.
        const result = finals.length ? finals : lastInterim.trim() ? [lastInterim] : [];
        setAlternatives(result);
        if (result.length) {
          setStatus("done");
        } else {
          setSilent(!heardSomething);
          setError(heardSomething ? "Te oí, pero no pude entender las palabras. Habla un poco más despacio y claro." : ERRORS["no-speech"]);
          setStatus("error");
        }
      };
      recRef.current = rec;
      setStatus("listening");
      try {
        rec.start();
      } catch {
        stopMedia();
        setError(ERRORS["service-not-allowed"]);
        setStatus("error");
      }
    },
    [recordingSupported, recognitionSupported, startMeter, stopMedia],
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
    silent,
    issue,
    start,
    stop,
    playRecording,
    recognitionSupported,
    recordingSupported,
  };
}
