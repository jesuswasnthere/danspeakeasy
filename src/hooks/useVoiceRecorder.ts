"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { transcribe } from "@/lib/stt";
import type { LanguageCode } from "@/types/learning";

/**
 * Graba la voz del alumno con el micrófono elegido, mide el nivel en vivo,
 * se detiene sola al detectar silencio tras hablar y transcribe el audio en el
 * propio dispositivo con Whisper (`lib/stt`).
 *
 * No depende del reconocimiento de voz del navegador (Web Speech API), que en
 * la práctica falla con micrófonos USB/no predeterminados y no existe en
 * Firefox ni Brave. Solo los navegadores integrados en apps (Electron) quedan
 * fuera, porque bloquean el micrófono.
 */

/** Navegadores integrados en apps de escritorio (Electron) bloquean el micrófono. */
export function isEmbeddedBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Electron|Claude\//i.test(navigator.userAgent);
}

export type MicIssue = "embedded" | "denied" | null;

const ERRORS = {
  denied:
    "El navegador bloqueó el micrófono. Pulsa el icono del candado (o de la cámara) en la barra de direcciones, permite «Micrófono» y recarga la página.",
  notFound:
    "No se encontró ningún micrófono. Revisa que esté conectado y seleccionado en Windows (Configuración → Sistema → Sonido → Entrada).",
  noSpeech: "No he detectado voz. Usa «Probar micrófono» para comprobar que llega sonido y habla cerca del micrófono.",
  empty: "Te oí, pero no pude entender las palabras. Habla un poco más despacio y claro.",
  transcribe: "No se pudo transcribir el audio. Revisa tu conexión (la primera vez se descarga el modelo de voz) e inténtalo de nuevo.",
};

/** Umbrales del medidor (0–1, escala en dB: 0 = −60 dB, 1 = −10 dB). */
const SPEECH_LEVEL = 0.45;
const SILENCE_LEVEL = 0.3;
const SILENCE_AFTER_SPEECH_MS = 1300;
const NO_SPEECH_TIMEOUT_MS = 7000;
const MAX_RECORDING_MS = 15000;

const DEVICE_KEY = "danspeakeasy-mic-device";

function readDevicePref(): string {
  try {
    return localStorage.getItem(DEVICE_KEY) ?? "";
  } catch {
    return "";
  }
}

export type RecorderStatus = "idle" | "listening" | "transcribing" | "testing" | "done" | "error";

export function useVoiceRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  /** Nivel del micrófono 0–1 mientras se escucha o se prueba. */
  const [level, setLevel] = useState(0);
  /** Pico máximo de la última escucha/prueba (0–1). */
  const [peak, setPeak] = useState(0);
  const [issue, setIssue] = useState<MicIssue>(() => (isEmbeddedBrowser() ? "embedded" : null));
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceIdState] = useState<string>(readDevicePref);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const urlRef = useRef<string | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const peakRef = useRef(0);
  const mountedRef = useRef(true);
  /** Detector de fin de frase: se evalúa en cada fotograma del medidor. */
  const vadRef = useRef<{ onFrame: (lvl: number, now: number) => void } | null>(null);

  const recordingSupported =
    typeof window !== "undefined" && "MediaRecorder" in window && !!navigator.mediaDevices?.getUserMedia;

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const all = await navigator.mediaDevices.enumerateDevices();
    if (mountedRef.current) setDevices(all.filter((d) => d.kind === "audioinput" && d.deviceId !== "communications"));
  }, []);

  const setDeviceId = useCallback((id: string) => {
    setDeviceIdState(id);
    try {
      localStorage.setItem(DEVICE_KEY, id);
    } catch {
      /* sin almacenamiento: solo para esta sesión */
    }
  }, []);

  // Permiso del micrófono y cambios de dispositivos (la lista se carga al saber que hay permiso).
  useEffect(() => {
    mountedRef.current = true;
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
      mountedRef.current = false;
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
    vadRef.current = null;
    if (!mountedRef.current) return;
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
      const db = 20 * Math.log10(rms || 1e-8);
      const lvl = Math.max(0, Math.min(1, (db + 60) / 50));
      peakRef.current = Math.max(peakRef.current, lvl);
      setLevel(lvl);
      vadRef.current?.onFrame(lvl, performance.now());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const releaseStream = useCallback(() => {
    stopMeter();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, [stopMeter]);

  useEffect(
    () => () => {
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        mediaRef.current.onstop = null;
        mediaRef.current.stop();
      }
      releaseStream();
      void ctxRef.current?.close();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [releaseStream],
  );

  /** Abre el micrófono elegido (o el predeterminado). */
  const openStream = useCallback(async () => {
    const constraints: MediaTrackConstraints = { echoCancellation: true, noiseSuppression: true, autoGainControl: true };
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
    setError(name === "NotFoundError" ? ERRORS.notFound : ERRORS.denied);
    setStatus("error");
  }, []);

  /** Prueba del micrófono: solo medidor. */
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
    releaseStream();
    setStatus("idle");
  }, [releaseStream]);

  /** Detiene la grabación; al terminar, se transcribe. */
  const stop = useCallback(() => {
    const mr = mediaRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    else {
      releaseStream();
      setStatus("idle");
    }
  }, [releaseStream]);

  const start = useCallback(
    async (language: LanguageCode) => {
      prepareAudioContext();
      setError(null);
      setAlternatives([]);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
      setAudioUrl(null);

      let stream: MediaStream;
      try {
        stream = await openStream();
      } catch (e) {
        handleMediaError(e);
        return;
      }
      streamRef.current = stream;
      startMeter(stream);
      void refreshDevices();

      const chunks: Blob[] = [];
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);

      // Fin automático: tras hablar, ~1,3 s de silencio; o si nunca se habla, a los 7 s.
      const startedAt = performance.now();
      let spokeAt: number | null = null;
      let lastLoud = startedAt;
      vadRef.current = {
        onFrame: (lvl, now) => {
          if (lvl >= SPEECH_LEVEL) {
            spokeAt ??= now;
            lastLoud = now;
          } else if (lvl >= SILENCE_LEVEL) lastLoud = now;
          const silentFor = now - lastLoud;
          if (
            (spokeAt !== null && silentFor > SILENCE_AFTER_SPEECH_MS) ||
            (spokeAt === null && now - startedAt > NO_SPEECH_TIMEOUT_MS) ||
            now - startedAt > MAX_RECORDING_MS
          ) {
            vadRef.current = null;
            if (mr.state !== "inactive") mr.stop();
          }
        },
      };

      mr.onstop = async () => {
        mediaRef.current = null;
        const spoke = spokeAt !== null || peakRef.current >= SPEECH_LEVEL;
        releaseStream();
        const blob = new Blob(chunks, { type: mr.mimeType });
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setAudioUrl(url);
        if (!spoke) {
          setError(ERRORS.noSpeech);
          setStatus("error");
          return;
        }
        setStatus("transcribing");
        try {
          const text = await transcribe(blob, language);
          if (!mountedRef.current) return;
          if (text.replace(/[\s.,，。!?！？…-]/g, "")) {
            setAlternatives([text]);
            setStatus("done");
          } else {
            setError(ERRORS.empty);
            setStatus("error");
          }
        } catch {
          if (!mountedRef.current) return;
          setError(ERRORS.transcribe);
          setStatus("error");
        }
      };

      mr.start();
      setStatus("listening");
    },
    [prepareAudioContext, openStream, startMeter, refreshDevices, handleMediaError, releaseStream],
  );

  const playRecording = useCallback(() => {
    if (urlRef.current) void new Audio(urlRef.current).play();
  }, []);

  return {
    status,
    alternatives,
    error,
    audioUrl,
    level,
    peak,
    issue,
    devices,
    deviceId,
    setDeviceId,
    start,
    stop,
    startTest,
    stopTest,
    playRecording,
    recordingSupported,
  };
}
