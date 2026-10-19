"use client";

import type { ReactNode } from "react";
import { Volume2 } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/lib/cn";
import { TONE_CLASSES } from "@/lib/richText";
import { useLearningStore } from "@/store/useLearningStore";
import type { PhoneticsBlock, SoundExample, TheoryBlock } from "@/types/learning";
import { SpeakButton } from "@/components/audio/SpeakButton";
import { TheoryBlocks } from "@/components/textbook/TheoryBlocks";

const THEORY_KINDS = new Set<PhoneticsBlock["kind"]>(["paragraph", "grammar", "table", "note"]);
const isTheory = (b: PhoneticsBlock): b is TheoryBlock => THEORY_KINDS.has(b.kind);

/** Renderiza los bloques de un módulo de fonética: teoría + tablas que suenan al pulsar. */
export function PhoneticsBlocks({ blocks }: { blocks: PhoneticsBlock[] }) {
  return (
    <div className="flex flex-col gap-8">
      {blocks.map((block, i) => {
        if (isTheory(block)) return <TheoryBlocks key={i} blocks={[block]} language="zh" />;
        switch (block.kind) {
          case "tones":
            return (
              <Section key={i} title={block.title} intro={block.intro}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {block.tones.map((t) => (
                    <PlayCard key={t.tone} example={t.example} className="flex-col items-start">
                      <span className="flex w-full items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.name}</span>
                        <Volume2 size={15} className="text-muted" />
                      </span>
                      <ToneContour contour={t.contour} tone={t.tone} />
                      <span className="flex items-baseline gap-2">
                        <span lang="zh-CN" className="font-cjk text-3xl">
                          {t.example.hanzi}
                        </span>
                        <span className={cn("text-lg font-semibold", TONE_CLASSES[t.tone])}>{t.example.pinyin}</span>
                      </span>
                      <span className="text-xs text-muted">«{t.example.meaning}»</span>
                      <span className="text-sm leading-snug text-ink/90">{t.description}</span>
                    </PlayCard>
                  ))}
                </div>
              </Section>
            );
          case "sounds":
            return (
              <Section key={i} title={block.title} intro={block.intro}>
                <div className="flex flex-col gap-6">
                  {block.groups.map((g) => (
                    <div key={g.name}>
                      <h4 className="font-semibold">{g.name}</h4>
                      {g.note && <p className="mt-0.5 text-sm text-muted">{g.note}</p>}
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {g.sounds.map((s) => (
                          <PlayCard key={s.symbol} example={s.example} className="items-start gap-3">
                            <span className="flex min-w-14 flex-col items-center rounded-xl bg-surface-2 px-2 py-1.5">
                              <span className="font-mono text-xl font-semibold text-accent">{s.symbol}</span>
                              {s.ipa && <span className="font-mono text-xs text-muted">[{s.ipa}]</span>}
                            </span>
                            <span className="flex min-w-0 flex-col gap-0.5">
                              <span className="text-sm leading-snug">{s.hint}</span>
                              <ExampleLine example={s.example} />
                            </span>
                          </PlayCard>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            );
          case "tone-changes":
            return (
              <Section key={i} title={block.title} intro={block.intro}>
                <div className="overflow-x-auto rounded-2xl border border-line">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
                      <tr>
                        <th className="px-4 py-2.5 font-medium">Palabra</th>
                        <th className="px-4 py-2.5 font-medium">Escrito</th>
                        <th className="px-4 py-2.5 font-medium">Suena</th>
                        <th className="px-4 py-2.5 font-medium">Nota</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line bg-surface">
                      {block.rows.map((r) => (
                        <tr key={r.example.hanzi + r.written}>
                          <td className="px-4 py-2.5">
                            <span className="flex items-center gap-2">
                              <SpeakButton text={r.example.hanzi} language="zh" size="sm" />
                              <span lang="zh-CN" className="font-cjk text-lg">
                                {r.example.hanzi}
                              </span>
                              <span className="text-muted">«{r.example.meaning}»</span>
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-muted">{r.written}</td>
                          <td className={cn("px-4 py-2.5 font-semibold", r.spoken !== r.written && "text-accent")}>{r.spoken}</td>
                          <td className="px-4 py-2.5 text-muted">{r.note ?? (r.spoken !== r.written ? "cambia" : "")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            );
          case "minimal-pairs":
            return (
              <Section key={i} title={block.title} intro={block.intro}>
                <div className="grid gap-3 md:grid-cols-2">
                  {block.pairs.map((p) => (
                    <div key={p.contrast} className="rounded-2xl border border-line bg-surface p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{p.contrast}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[p.a, p.b].map((e) => (
                          <PlayCard key={e.hanzi} example={e} className="flex-col items-center text-center">
                            <span lang="zh-CN" className="font-cjk text-3xl">
                              {e.hanzi}
                            </span>
                            <span className="font-semibold">{e.pinyin}</span>
                            <span className="text-xs text-muted">«{e.meaning}»</span>
                          </PlayCard>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            );
          case "tone-grid":
            return (
              <Section key={i} title={block.title} intro={block.intro}>
                <div className="overflow-x-auto rounded-2xl border border-line">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
                      <tr>
                        <th className="px-3 py-2.5 text-left font-medium">1.ª \ 2.ª</th>
                        {["1.º", "2.º", "3.º", "4.º", "neutro"].map((h) => (
                          <th key={h} className="px-3 py-2.5 font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line bg-surface">
                      {block.rows.map((row, r) => (
                        <tr key={r}>
                          <th scope="row" className={cn("px-3 py-2 text-left font-semibold", TONE_CLASSES[(r + 1) as 1 | 2 | 3 | 4])}>
                            {r + 1}.º
                          </th>
                          {row.map((e) => (
                            <td key={e.hanzi} className="p-1.5">
                              <PlayCard example={e} className="flex-col items-center border-transparent px-2 py-2 text-center">
                                <span lang="zh-CN" className="font-cjk text-xl">
                                  {e.hanzi}
                                </span>
                                <span className="text-xs font-medium">{e.pinyin}</span>
                                <span className="text-[11px] text-muted">{e.meaning}</span>
                              </PlayCard>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            );
        }
      })}
    </div>
  );
}

function Section({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-lg font-semibold">{title}</h3>
      {intro && <p className="mt-1 text-sm leading-relaxed text-muted">{intro}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ExampleLine({ example }: { example: SoundExample }) {
  return (
    <span className="text-sm text-muted">
      <span lang="zh-CN" className="font-cjk text-base text-ink">
        {example.hanzi}
      </span>{" "}
      {example.pinyin} · «{example.meaning}»
    </span>
  );
}

/** Tarjeta pulsable que pronuncia el hanzi del ejemplo. */
function PlayCard({ example, className, children }: { example: SoundExample; className?: string; children: ReactNode }) {
  const { speak, speaking, supported } = useSpeech();
  return (
    <button
      type="button"
      disabled={!supported}
      onClick={() => speak(example.hanzi, "zh")}
      aria-label={`Escuchar ${example.hanzi} (${example.pinyin})`}
      className={cn(
        "flex w-full gap-1.5 rounded-2xl border border-line bg-surface p-3 text-left transition hover:border-accent hover:bg-accent-soft/40 disabled:opacity-60",
        speaking && "speaking border-accent bg-accent-soft",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Contorno tonal en la escala de Chao (1 = grave, 5 = agudo). */
function ToneContour({ contour, tone }: { contour: number[]; tone: 1 | 2 | 3 | 4 | 5 }) {
  const colored = useLearningStore((s) => s.preferences.toneColors);
  const y = (level: number) => 46 - (level - 1) * 10;
  const points = contour.map((level, i) => [10 + (i * 70) / Math.max(1, contour.length - 1), y(level)] as const);
  const d = points.map(([px, py], i) => `${i ? "L" : "M"}${px},${py}`).join(" ");
  return (
    <svg viewBox="0 0 90 52" className={cn("my-1 h-14 w-full", colored ? TONE_CLASSES[tone] : "text-ink")} aria-hidden>
      {[1, 2, 3, 4, 5].map((level) => (
        <line key={level} x1="4" x2="86" y1={y(level)} y2={y(level)} className="stroke-line" strokeWidth="1" />
      ))}
      {contour.length ? (
        <path d={d} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <circle cx="45" cy={y(2.5)} r="4.5" fill="currentColor" />
      )}
    </svg>
  );
}
