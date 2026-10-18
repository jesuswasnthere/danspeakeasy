"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LANGUAGES } from "@/data/levels";
import type { LanguageCode } from "@/types/learning";

/**
 * Graba la voz del alumno (MediaRecorder, para volver a escucharse) y, si el
 * navegador lo soporta, la transcribe con la Web Speech API (SpeechRecognition).
 * Chrome y Edge la soportan; Firefox no. Requiere conexión a internet.
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

const ERRORS: Record<string, string> = {
  "not-allowed": "Permiso de micrófono denegado. Actívalo en la barra de direcciones del navegador.",
  "service-not-allowed": "El navegador no permite el reconocimiento de voz en esta página.",
  "no-speech": "No te he oído. Pulsa el micrófono y habla con claridad.",
  "audio-capture": "No se encontró ningún micrófono.",
  network: "El reconocimiento de voz necesita conexión a internet.",
};

export type RecorderStatus = "idle" | "listening" | "done" | "error";

export function useVoiceRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [interim, setInterim] = useState("");
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recRef = useRef<Recognition | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const urlRef = useRef<string | null>(null);

  const recognitionSupported = recognitionCtor() !== null;
  const recordingSupported = typeof window !== "undefined" && "MediaRecorder" in window && !!navigator.mediaDevices;

  const stopMedia = useCallback(() => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

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
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
      setAudioUrl(null);

      // Grabación para autoescucha.
      if (recordingSupported) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
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
        } catch {
          setError(ERRORS["not-allowed"]);
          setStatus("error");
          return;
        }
      }

      const Ctor = recognitionCtor();
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
      rec.onresult = (e) => {
        const alts: string[] = [];
        let live = "";
        let isFinal = true;
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i];
          live += r[0].transcript;
          isFinal &&= r.isFinal;
          for (let k = 0; k < r.length; k++) alts[k] = (alts[k] ?? "") + r[k].transcript;
        }
        setInterim(live);
        if (isFinal) finals = alts.filter(Boolean);
      };
      rec.onerror = (e) => {
        if (e.error === "aborted") return;
        setError(ERRORS[e.error] ?? `Error de reconocimiento: ${e.error}`);
        setStatus("error");
      };
      rec.onend = () => {
        stopMedia();
        recRef.current = null;
        setAlternatives(finals);
        setStatus((s) => (s === "error" ? s : finals.length ? "done" : "error"));
        if (!finals.length) setError((err) => err ?? ERRORS["no-speech"]);
      };
      recRef.current = rec;
      setStatus("listening");
      rec.start();
    },
    [recordingSupported, stopMedia],
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

  return { status, interim, alternatives, error, audioUrl, start, stop, playRecording, recognitionSupported, recordingSupported };
}
