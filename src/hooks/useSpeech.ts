"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speakText, stopAll, type Playback } from "@/lib/tts";
import { useLearningStore } from "@/store/useLearningStore";
import type { LanguageCode } from "@/types/learning";

/**
 * Hook de audio para los componentes. Usa el motor de `lib/tts`: voz del
 * navegador si existe para el idioma y, si no, audio MP3 desde `/api/tts`.
 */

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && ("speechSynthesis" in window || "Audio" in window);
}

export interface SequenceOptions {
  /** Se llama al empezar cada frase. */
  onIndex?: (index: number) => void;
  onDone?: () => void;
  /** Pausa tras cada frase (p. ej. para repetir en voz alta: shadowing). */
  gapMs?: (index: number, text: string) => number;
  rate?: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useSpeech() {
  const rate = useLearningStore((s) => s.preferences.speechRate);
  const registerAudioPlay = useLearningStore((s) => s.registerAudioPlay);
  const [speaking, setSpeaking] = useState(false);
  const mounted = useRef(true);
  /** Identificador de la reproducción de ESTE componente: si cambia, la anterior se abandona. */
  const run = useRef(0);
  const playback = useRef<Playback | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      playback.current?.stop();
    };
  }, []);

  /** Reproduce una lista de textos en orden; devuelve false si se interrumpió. */
  const playList = useCallback(
    async (texts: string[], language: LanguageCode, opts: SequenceOptions = {}) => {
      const id = ++run.current;
      const alive = () => id === run.current && mounted.current;
      setSpeaking(true);
      try {
        for (let i = 0; i < texts.length; i++) {
          if (!alive()) return false;
          opts.onIndex?.(i);
          const p = speakText(texts[i], language, opts.rate ?? rate);
          playback.current = p;
          await p.done;
          if (!alive() || p.interrupted) return false;
          // También tras la última frase: en modo sombra el alumno debe poder repetirla.
          if (opts.gapMs) await sleep(opts.gapMs(i, texts[i]));
        }
        if (alive()) opts.onDone?.();
        return true;
      } catch {
        return false;
      } finally {
        if (id === run.current && mounted.current) setSpeaking(false);
      }
    },
    [rate],
  );

  const speak = useCallback(
    (texts: string | string[], language: LanguageCode, opts?: { rate?: number; track?: boolean }) => {
      const list = (Array.isArray(texts) ? texts : [texts]).filter(Boolean);
      if (!list.length) return;
      if (opts?.track !== false) registerAudioPlay();
      void playList(list, language, { rate: opts?.rate });
    },
    [playList, registerAudioPlay],
  );

  /** Lee frase a frase avisando de cuál suena (para resaltarla). */
  const speakSequence = useCallback(
    (texts: string[], language: LanguageCode, opts: SequenceOptions = {}) => {
      if (!texts.length) return;
      registerAudioPlay();
      void playList(texts, language, { gapMs: () => 250, ...opts });
    },
    [playList, registerAudioPlay],
  );

  const stop = useCallback(() => {
    run.current++;
    playback.current?.stop();
    stopAll();
    setSpeaking(false);
  }, []);

  return { speak, speakSequence, stop, speaking, supported: isSpeechSupported() };
}
