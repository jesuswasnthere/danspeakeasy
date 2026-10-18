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

export function useSpeech() {
  const rate = useLearningStore((s) => s.preferences.speechRate);
  const registerAudioPlay = useLearningStore((s) => s.registerAudioPlay);
  const [speaking, setSpeaking] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    // Algunos navegadores cargan las voces de forma asíncrona.
    if (isSpeechSupported()) window.speechSynthesis.getVoices();
    return () => {
      mounted.current = false;
    };
  }, []);

  const speak = useCallback(
    (texts: string | string[], language: LanguageCode, opts?: { rate?: number; track?: boolean }) => {
      if (!isSpeechSupported()) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const list = (Array.isArray(texts) ? texts : [texts]).filter(Boolean);
      if (!list.length) return;
      const speechLang = LANGUAGES[language].speechLang;
      const voice = pickVoice(speechLang);
      list.forEach((text, i) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = speechLang;
        if (voice) u.voice = voice;
        u.rate = opts?.rate ?? rate;
        if (i === 0) u.onstart = () => mounted.current && setSpeaking(true);
        if (i === list.length - 1) {
          u.onend = () => mounted.current && setSpeaking(false);
          u.onerror = () => mounted.current && setSpeaking(false);
        }
        synth.speak(u);
      });
      if (opts?.track !== false) registerAudioPlay();
    },
    [rate, registerAudioPlay],
  );

  const stop = useCallback(() => {
    if (!isSpeechSupported()) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported: isSpeechSupported() };
}
