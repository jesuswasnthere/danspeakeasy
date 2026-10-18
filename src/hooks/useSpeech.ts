"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LANGUAGES } from "@/data/levels";
import { useLearningStore } from "@/store/useLearningStore";
import type { LanguageCode } from "@/types/learning";

/**
 * Text-to-speech nativo (Web Speech API). Fase 1: gratis y sin backend.
 * Fase 2: se puede sustituir por un proveedor TTS neuronal manteniendo la firma.
 */

function pickVoice(speechLang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const target = speechLang.toLowerCase();
  const base = target.split("-")[0];
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase();
  return (
    voices.find((v) => norm(v) === target && /natural|neural|google|premium/i.test(v.name)) ??
    voices.find((v) => norm(v) === target) ??
    voices.find((v) => norm(v).startsWith(base))
  );
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export interface SequenceOptions {
  /** Se llama al empezar cada frase. */
  onIndex?: (index: number) => void;
  onDone?: () => void;
  /** Pausa tras cada frase (p. ej. para repetir en voz alta: shadowing). */
  gapMs?: (index: number, text: string) => number;
  rate?: number;
}

export function useSpeech() {
  const rate = useLearningStore((s) => s.preferences.speechRate);
  const registerAudioPlay = useLearningStore((s) => s.registerAudioPlay);
  const [speaking, setSpeaking] = useState(false);
  const mounted = useRef(true);
  /** Identificador de la secuencia activa: al cambiar, las anteriores se abandonan. */
  const seq = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mounted.current = true;
    // Algunos navegadores cargan las voces de forma asíncrona.
    if (isSpeechSupported()) window.speechSynthesis.getVoices();
    return () => {
      // `playAt` comprueba `mounted`, así que las secuencias pendientes se abandonan solas.
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const utterance = useCallback(
    (text: string, language: LanguageCode, customRate?: number) => {
      const speechLang = LANGUAGES[language].speechLang;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = speechLang;
      const voice = pickVoice(speechLang);
      if (voice) u.voice = voice;
      u.rate = customRate ?? rate;
      return u;
    },
    [rate],
  );

  const speak = useCallback(
    (texts: string | string[], language: LanguageCode, opts?: { rate?: number; track?: boolean }) => {
      if (!isSpeechSupported()) return;
      const synth = window.speechSynthesis;
      seq.current++;
      synth.cancel();
      const list = (Array.isArray(texts) ? texts : [texts]).filter(Boolean);
      if (!list.length) return;
      list.forEach((text, i) => {
        const u = utterance(text, language, opts?.rate);
        if (i === 0) u.onstart = () => mounted.current && setSpeaking(true);
        if (i === list.length - 1) {
          u.onend = () => mounted.current && setSpeaking(false);
          u.onerror = () => mounted.current && setSpeaking(false);
        }
        synth.speak(u);
      });
      if (opts?.track !== false) registerAudioPlay();
    },
    [utterance, registerAudioPlay],
  );

  /** Lee una lista de frases una a una, avisando de cuál suena (para resaltarla). */
  const speakSequence = useCallback(
    (texts: string[], language: LanguageCode, opts: SequenceOptions = {}) => {
      if (!isSpeechSupported() || !texts.length) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      if (timer.current) clearTimeout(timer.current);
      const id = ++seq.current;
      const playAt = (i: number) => {
        if (id !== seq.current || !mounted.current) return;
        if (i >= texts.length) {
          setSpeaking(false);
          opts.onDone?.();
          return;
        }
        opts.onIndex?.(i);
        const u = utterance(texts[i], language, opts.rate);
        const next = () => {
          const gap = opts.gapMs?.(i, texts[i]) ?? 250;
          timer.current = setTimeout(() => playAt(i + 1), gap);
        };
        u.onend = next;
        u.onerror = next;
        synth.speak(u);
      };
      setSpeaking(true);
      registerAudioPlay();
      playAt(0);
    },
    [utterance, registerAudioPlay],
  );

  const stop = useCallback(() => {
    if (!isSpeechSupported()) return;
    seq.current++;
    if (timer.current) clearTimeout(timer.current);
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, speakSequence, stop, speaking, supported: isSpeechSupported() };
}
