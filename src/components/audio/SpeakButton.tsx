"use client";

import { Square, Volume2 } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/lib/cn";
import type { LanguageCode } from "@/types/learning";

export function SpeakButton({
  text,
  language,
  label,
  size = "md",
  slow,
  onPlay,
  className,
}: {
  text: string | string[];
  language: LanguageCode;
  label?: string;
  size?: "sm" | "md" | "lg";
  /** Reproduce más despacio (×0.7). */
  slow?: boolean;
  onPlay?: () => void;
  className?: string;
}) {
  const { speak, stop, speaking, supported } = useSpeech();
  const dims = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const icon = size === "lg" ? 22 : size === "sm" ? 14 : 17;

  return (
    <button
      type="button"
      disabled={!supported}
      title={supported ? (label ?? "Escuchar") : "Tu navegador no soporta audio (Web Speech API)"}
      aria-label={label ?? "Escuchar pronunciación"}
      onClick={(e) => {
        e.stopPropagation();
        if (speaking) return stop();
        speak(text, language, slow ? { rate: 0.7 } : undefined);
        onPlay?.();
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-accent disabled:opacity-40",
        label ? "h-9 px-3 text-sm font-medium" : dims,
        speaking && "speaking border-accent text-accent",
        className,
      )}
    >
      {speaking ? <Square size={icon - 3} /> : <Volume2 size={icon} />}
      {label && <span>{label}</span>}
    </button>
  );
}
