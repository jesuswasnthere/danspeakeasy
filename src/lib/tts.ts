/**
 * Motor de audio (text-to-speech) con dos vías:
 *
 * 1. Voz del navegador (Web Speech API): inmediata y sin red, si existe una voz
 *    para el idioma (Chrome y Edge traen voces en chino; Windows normalmente no).
 * 2. Respaldo en servidor (`/api/tts`, MP3): cuando no hay voz para el idioma o
 *    la síntesis del navegador falla.
 *
 * Solo suena una reproducción a la vez en toda la app (como un reproductor único).
 */

import { LANGUAGES } from "@/data/levels";
import type { LanguageCode } from "@/types/learning";

export interface Playback {
  /** Se resuelve al terminar (o al detenerse). */
  done: Promise<void>;
  stop(): void;
  /** true si se detuvo antes de terminar (por el usuario u otro audio). */
  readonly interrupted?: boolean;
}

const MAX_CHUNK = 180;

const supportsSynthesis = () => typeof window !== "undefined" && "speechSynthesis" in window;

// ─── Voces del navegador ──────────────────────────────────────────────────────

let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;

/** Las voces se cargan de forma asíncrona en Chrome: esperamos `voiceschanged` (máx. 1,5 s). */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!supportsSynthesis()) return Promise.resolve([]);
  const now = window.speechSynthesis.getVoices();
  if (now.length) return Promise.resolve(now);
  voicesReady ??= new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1500);
  });
  return voicesReady.then((v) => {
    if (!v.length) voicesReady = null; // reintentar la próxima vez
    return v;
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], speechLang: string): SpeechSynthesisVoice | undefined {
  const target = speechLang.toLowerCase();
  const base = target.split("-")[0];
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase();
  return (
    voices.find((v) => norm(v) === target && /natural|neural|online|google/i.test(v.name)) ??
    voices.find((v) => norm(v) === target) ??
    voices.find((v) => norm(v).startsWith(base))
  );
}

/** Idiomas cuya voz del navegador falló: a partir de ahí, se usa el servidor. */
const brokenBrowserLangs = new Set<LanguageCode>();

export type Engine = "browser" | "server";

export async function engineFor(language: LanguageCode): Promise<{ engine: Engine; voice?: SpeechSynthesisVoice }> {
  if (brokenBrowserLangs.has(language)) return { engine: "server" };
  const voice = pickVoice(await loadVoices(), LANGUAGES[language].speechLang);
  return voice ? { engine: "browser", voice } : { engine: "server" };
}

// Referencias vivas: Chrome puede recolectar utterances y no disparar `onend`.
const liveUtterances = new Set<SpeechSynthesisUtterance>();

function playBrowser(text: string, language: LanguageCode, rate: number, voice: SpeechSynthesisVoice): Playback {
  const synth = window.speechSynthesis;
  let stopped = false;
  let finish: () => void = () => {};
  let fail: (e: unknown) => void = () => {};
  const done = new Promise<void>((res, rej) => {
    finish = res;
    fail = rej;
  });

  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANGUAGES[language].speechLang;
  u.voice = voice;
  u.rate = rate;
  liveUtterances.add(u);
  let started = false;
  u.onstart = () => {
    started = true;
  };
  u.onend = () => {
    liveUtterances.delete(u);
    finish();
  };
  u.onerror = (e) => {
    liveUtterances.delete(u);
    if (stopped || e.error === "interrupted" || e.error === "canceled") finish();
    else fail(e.error);
  };

  // Chrome: hablar justo después de cancel() a veces se ignora; un pequeño respiro lo evita.
  synth.cancel();
  setTimeout(() => {
    if (stopped) return;
    synth.resume();
    synth.speak(u);
    // Si en 2,5 s no ha empezado, la voz no funciona: pasamos al servidor.
    setTimeout(() => !started && !stopped && fail("timeout"), 2500);
  }, 60);

  return {
    done,
    stop() {
      stopped = true;
      synth.cancel();
      finish();
    },
  };
}

// ─── Audio del servidor ───────────────────────────────────────────────────────

/** Trocea en fragmentos ≤ MAX_CHUNK respetando la puntuación. */
export function chunkText(text: string): string[] {
  const parts = text.match(/[^。！？；，、.!?;,]+[。！？；，、.!?;,]*/g) ?? [text];
  const chunks: string[] = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + p).length > MAX_CHUNK && cur) {
      chunks.push(cur);
      cur = "";
    }
    if (p.length > MAX_CHUNK) {
      for (let i = 0; i < p.length; i += MAX_CHUNK) chunks.push(p.slice(i, i + MAX_CHUNK));
    } else cur += p;
  }
  if (cur.trim()) chunks.push(cur);
  return chunks.map((c) => c.trim()).filter(Boolean);
}

const ttsUrl = (text: string, language: LanguageCode) =>
  `/api/tts?lang=${encodeURIComponent(LANGUAGES[language].speechLang)}&text=${encodeURIComponent(text)}`;

function playServer(text: string, language: LanguageCode, rate: number): Playback {
  let stopped = false;
  let audio: HTMLAudioElement | null = null;
  const run = async () => {
    for (const chunk of chunkText(text)) {
      if (stopped) return;
      audio = new Audio(ttsUrl(chunk, language));
      audio.playbackRate = Math.min(2, Math.max(0.5, rate));
      audio.preservesPitch = true;
      const a = audio;
      await new Promise<void>((resolve, reject) => {
        a.onended = () => resolve();
        a.onerror = () => reject(new Error("audio"));
        a.play().catch(reject);
      });
    }
  };
  return {
    done: run(),
    stop() {
      stopped = true;
      audio?.pause();
    },
  };
}

// ─── API pública ──────────────────────────────────────────────────────────────

let current: Playback | null = null;

export function stopAll() {
  current?.stop();
  current = null;
  if (supportsSynthesis()) window.speechSynthesis.cancel();
}

/** Reproduce un texto. Detiene cualquier otro audio de la app. */
export function speakText(text: string, language: LanguageCode, rate = 1): Playback {
  stopAll();
  let inner: Playback | null = null;
  let stopped = false;

  const done = (async () => {
    const { engine, voice } = await engineFor(language);
    if (stopped) return;
    if (engine === "browser" && voice) {
      inner = playBrowser(text, language, rate, voice);
      try {
        await inner.done;
        return;
      } catch {
        // La voz del navegador falló: recordar y reintentar con el servidor.
        brokenBrowserLangs.add(language);
        if (stopped) return;
      }
    }
    inner = playServer(text, language, rate);
    await inner.done;
  })();

  const playback: Playback = {
    done,
    stop() {
      stopped = true;
      inner?.stop();
    },
    get interrupted() {
      return stopped;
    },
  };
  current = playback;
  return playback;
}

/** Calienta la caché de voces (llamar al montar la app). */
export function warmUpVoices() {
  void loadVoices();
}
