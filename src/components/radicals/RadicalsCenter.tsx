"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Dumbbell, Lightbulb, Search, Shapes, Volume2, XCircle } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { content } from "@/lib/content";
import { cn } from "@/lib/cn";
import { useSpeech } from "@/hooks/useSpeech";
import { useLearningStore } from "@/store/useLearningStore";
import type { PhoneticFamily, Radical, RadicalCategory, SoundExample } from "@/types/learning";
import { SpeakButton } from "@/components/audio/SpeakButton";
import { Badge, Button, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";

type Tab = "explorar" | "practicar";

/**
 * Radicales del chino: los componentes que dan el campo de significado a otros caracteres.
 * Dos pestañas: «Explorar» (catálogo por familias, con audio) y «Practicar» (quiz local;
 * no se guarda progreso, es una herramienta de identificación rápida).
 */
export function RadicalsCenter() {
  const { language, setLanguage } = useLearningStore(useShallow((s) => ({ language: s.language, setLanguage: s.setLanguage })));
  const { categories, radicals, families, visibleComponents } = content.getRadicals();
  const [tab, setTab] = useState<Tab>("explorar");

  if (language !== "zh") {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Radicales</h1>
        <Card className="mt-6">
          <EmptyState
            icon={<Shapes size={22} />}
            title="Los radicales son una herramienta del chino"
            body="Aprende los componentes que dan significado a los caracteres: agua, tierra, mano, boca…"
            action={<Button onClick={() => setLanguage("zh")}>Cambiar a Chino Mandarín</Button>}
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Radicales</h1>
      <p className="mt-1 max-w-2xl text-muted">
        Un radical es la «pista de significado» de un carácter. Conocer unos 40 te permite adivinar de qué trata una palabra
        nueva, buscarla en el diccionario y recordar mejor cómo se escribe.
      </p>

      <div className="mt-6 flex gap-1 border-b border-line">
        {(
          [
            { id: "explorar", label: "Explorar", icon: Shapes },
            { id: "practicar", label: "Practicar", icon: Dumbbell },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition",
              tab === t.id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="py-8">
        {tab === "explorar" ? (
          <Explorer categories={categories} radicals={radicals} families={families} onPractice={() => setTab("practicar")} />
        ) : (
          <RadicalQuiz radicals={radicals} visibleComponents={visibleComponents} />
        )}
      </div>
    </div>
  );
}

// ─── Explorar ─────────────────────────────────────────────────────────────────

function Explorer({
  categories,
  radicals,
  families,
  onPractice,
}: {
  categories: RadicalCategory[];
  radicals: Radical[];
  families: PhoneticFamily[];
  onPractice: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<RadicalCategory["id"] | "todas">("todas");
  const [onlyCore, setOnlyCore] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return radicals.filter((r) => {
      if (category !== "todas" && r.category !== category) return false;
      if (onlyCore && !r.core) return false;
      if (!q) return true;
      const haystack = [r.glyph, ...(r.variants?.map((v) => v.glyph) ?? []), r.pinyin, r.meaning, ...r.examples.map((e) => e.hanzi + e.meaning)]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [radicals, query, category, onlyCore]);

  return (
    <div className="flex flex-col gap-10">
      <HowItWorks families={families} />

      <section>
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={category === "todas"} onClick={() => setCategory("todas")}>
            Todos ({radicals.length})
          </Chip>
          {categories.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="relative min-w-56 flex-1 sm:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por carácter, pinyin o significado"
              className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyCore} onChange={(e) => setOnlyCore(e.target.checked)} className="accent-[var(--color-accent)]" />
            Solo los imprescindibles
          </label>
        </div>
      </section>

      {categories.map((c) => {
        const items = visible.filter((r) => r.category === c.id);
        if (!items.length) return null;
        return (
          <section key={c.id}>
            <h2 className="text-xl font-semibold">{c.label}</h2>
            <p className="mt-1 text-sm text-muted">{c.description}</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {items.map((r) => (
                <RadicalCard key={r.id} radical={r} />
              ))}
            </div>
          </section>
        );
      })}

      {!visible.length && (
        <Card>
          <EmptyState icon={<Search size={22} />} title="Sin resultados" body="Prueba con otro carácter, significado o familia." />
        </Card>
      )}

      <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface-2 px-5 py-4">
        <p className="text-sm">¿Los reconoces ya? Ponte a prueba identificando el radical de caracteres reales.</p>
        <Button onClick={onPractice}>Practicar</Button>
      </div>
    </div>
  );
}

function HowItWorks({ families }: { families: PhoneticFamily[] }) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Lightbulb size={18} className="text-accent" /> Cómo identificar un radical
        </h2>
        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed">
          <li>
            <strong>Mira los lados.</strong> El radical suele ir a la izquierda (氵, 亻, 扌), arriba (艹, 宀, 竹) o rodeando al resto
            (辶, 门).
          </li>
          <li>
            <strong>Busca el componente que aporta significado</strong>; el otro suele dar el sonido (en 河, 氵 = agua y 可 = «hé/kě»).
          </li>
          <li>
            <strong>Aprende también su forma variante.</strong> 水 pasa a 氵, 人 a 亻, 手 a 扌, 心 a 忄, 言 a 讠, 金 a 钅.
          </li>
          <li>
            <strong>Úsalo como pista, no como regla.</strong> Los significados han evolucionado (好 = 女 + 子 ya no es «mujer con niño»).
          </li>
        </ol>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold">Mismo sonido, distinto radical</h2>
        <p className="mt-1 text-sm text-muted">
          El componente de sonido se mantiene y el radical cambia el campo de significado. Pulsa para oír cada carácter.
        </p>
        <div className="mt-3 flex flex-col gap-4">
          {families.map((f) => (
            <div key={f.component.hanzi}>
              <p className="flex items-center gap-2 text-sm">
                <span lang="zh-CN" className="font-cjk text-xl">
                  {f.component.hanzi}
                </span>
                <span className="text-muted">
                  {f.component.pinyin} · «{f.component.meaning}»
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {f.members.map((m) => (
                  <PlayCard key={m.example.hanzi} example={m.example} className="min-w-28 flex-1 flex-col items-center text-center">
                    <span className="text-xs text-muted">{m.radical}</span>
                    <span lang="zh-CN" className="font-cjk text-2xl">
                      {m.example.hanzi}
                    </span>
                    <span className="text-xs font-medium">{m.example.pinyin}</span>
                    <span className="text-[11px] leading-tight text-muted">{m.clue}</span>
                  </PlayCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function RadicalCard({ radical: r }: { radical: Radical }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex shrink-0 flex-col items-center rounded-2xl bg-surface-2 px-4 py-3">
          <span lang="zh-CN" className="font-cjk text-5xl leading-none">
            {r.glyph}
          </span>
          {r.variants?.map((v) => (
            <span key={v.glyph} lang="zh-CN" className="mt-1 font-cjk text-2xl leading-none text-accent" title={v.note}>
              {v.glyph}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold capitalize">{r.meaning}</h3>
            <SpeakButton text={r.nickname?.hanzi ?? r.glyph} language="zh" size="sm" label={`Escuchar ${r.nickname?.pinyin ?? r.pinyin}`} />
            {r.core && <Badge tone="accent">Imprescindible</Badge>}
          </div>
          <p className="text-sm text-muted">
            {r.pinyin} · {r.strokes} trazos
            {r.nickname && (
              <>
                {" "}
                ·{" "}
                <span lang="zh-CN" className="font-cjk">
                  {r.nickname.hanzi}
                </span>{" "}
                ({r.nickname.pinyin})
              </>
            )}
          </p>
          {r.variants?.map((v) => (
            <p key={v.glyph} className="text-xs text-muted">
              <span lang="zh-CN" className="font-cjk text-sm text-accent">
                {v.glyph}
              </span>{" "}
              {v.note}
            </p>
          ))}
        </div>
      </div>

      <dl className="mt-4 flex flex-col gap-2 text-sm leading-snug">
        <Row label="Cómo reconocerlo">{r.recognize}</Row>
        <Row label="Dónde aparece">{r.position}</Row>
        <Row label="En el día a día">{r.usage}</Row>
      </dl>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {r.examples.map((e) => (
          <PlayCard key={e.hanzi} example={e} className="flex-col items-center px-2 py-2 text-center">
            <span lang="zh-CN" className="font-cjk text-2xl">
              {e.hanzi}
            </span>
            <span className="text-xs font-medium">{e.pinyin}</span>
            <span className="text-[11px] leading-tight text-muted">{e.meaning}</span>
          </PlayCard>
        ))}
      </div>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition",
        active ? "border-accent bg-accent-soft text-accent" : "border-line text-muted hover:border-ink/30 hover:text-ink",
      )}
    >
      {children}
    </button>
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
        "flex gap-1 rounded-xl border border-line bg-surface p-2 transition hover:border-accent hover:bg-accent-soft/40 disabled:opacity-60",
        speaking && "speaking border-accent bg-accent-soft",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ─── Practicar ────────────────────────────────────────────────────────────────

const ROUND_LENGTH = 10;

type Question =
  | { kind: "radical-of"; example: SoundExample; answer: string; options: Option[]; explanation: string }
  | { kind: "meaning-of"; glyph: string; answer: string; options: Option[]; explanation: string }
  | { kind: "family-of"; meaning: string; answer: string; options: Option[]; explanation: string };

interface Option {
  id: string;
  label: string;
  /** Texto en chino (se pinta con la tipografía CJK). */
  cjk?: boolean;
  /** Pinyin / significado auxiliar. */
  sub?: string;
}

const shuffle = <T,>(items: readonly T[]): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

type VisibleComponents = Record<string, string[]>;

/** ¿Se ve el radical dentro del carácter? Un carácter es un solo punto Unicode: se consulta la tabla de componentes. */
const appearsIn = (r: Radical, hanzi: string, visible: VisibleComponents) => visible[hanzi]?.includes(r.id) ?? false;

/** Radicales que se escriben igual que otro (阝, 月): su significado depende de la posición y no se pregunta en abstracto. */
const hasTwin = (r: Radical, all: Radical[]) => all.some((o) => o.id !== r.id && shownForm(o) === shownForm(r));

/** Forma con la que se presenta el radical en las opciones (la variante, si la tiene). */
const shownForm = (r: Radical) => r.variants?.[0]?.glyph ?? r.glyph;

function buildQuestions(radicals: Radical[], visible: VisibleComponents): Question[] {
  const kinds: Question["kind"][] = ["radical-of", "radical-of", "radical-of", "meaning-of", "family-of"];
  return shuffle(radicals)
    .slice(0, ROUND_LENGTH)
    .map((r, i): Question => {
      // 阝 (colina/ciudad) y 月 (luna/carne) son indistinguibles sin contexto: solo se preguntan con un carácter.
      const kind = hasTwin(r, radicals) && kinds[i % kinds.length] === "meaning-of" ? "radical-of" : kinds[i % kinds.length];
      const others = shuffle(radicals.filter((o) => o.id !== r.id));

      if (kind === "radical-of") {
        const example = pick(r.examples);
        const distractors = others.filter((o) => shownForm(o) !== shownForm(r) && !appearsIn(o, example.hanzi, visible)).slice(0, 3);
        return {
          kind,
          example,
          answer: r.id,
          options: shuffle([r, ...distractors]).map((o) => ({ id: o.id, label: shownForm(o), cjk: true, sub: o.meaning })),
          explanation: `${example.hanzi} (${example.pinyin}, «${example.meaning}») lleva ${shownForm(r)}: ${r.meaning}.`,
        };
      }
      if (kind === "meaning-of") {
        return {
          kind,
          glyph: shownForm(r),
          answer: r.id,
          options: shuffle([r, ...others.slice(0, 3)]).map((o) => ({ id: o.id, label: o.meaning })),
          explanation: `${shownForm(r)} (${r.pinyin}) significa «${r.meaning}». ${r.usage}`,
        };
      }
      // family-of: ¿qué carácter pertenece a la familia de este radical?
      const example = pick(r.examples);
      const wrong = others
        .filter((o) => !appearsIn(r, o.examples[0].hanzi, visible))
        .slice(0, 3)
        .map((o) => o.examples[0]);
      return {
        kind,
        meaning: r.meaning,
        answer: example.hanzi,
        options: shuffle([example, ...wrong]).map((e) => ({ id: e.hanzi, label: e.hanzi, cjk: true, sub: `${e.pinyin} · ${e.meaning}` })),
        explanation: `${example.hanzi} (${example.pinyin}, «${example.meaning}») contiene ${shownForm(r)}: ${r.meaning}.`,
      };
    });
}

function RadicalQuiz({ radicals, visibleComponents }: { radicals: Radical[]; visibleComponents: VisibleComponents }) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const { speak } = useSpeech();

  const start = () => {
    setQuestions(buildQuestions(radicals, visibleComponents));
    setIndex(0);
    setPicked(null);
    setScore(0);
  };

  if (!questions) {
    return (
      <Card>
        <EmptyState
          icon={<Dumbbell size={22} />}
          title="Identifica el radical"
          body={`Rondas de ${ROUND_LENGTH} preguntas: encuentra el radical de un carácter, recuerda qué significa y reconoce a qué familia pertenece una palabra.`}
          action={<Button onClick={start}>Empezar ronda</Button>}
        />
      </Card>
    );
  }

  if (index >= questions.length) {
    return (
      <Card className="p-8 text-center">
        <p className="text-5xl font-semibold tabular-nums">
          {score}/{questions.length}
        </p>
        <p className="mt-2 text-muted">
          {score === questions.length
            ? "¡Perfecto! Dominas estos radicales."
            : score >= questions.length * 0.7
              ? "Muy bien. Repasa los que has fallado y vuelve a intentarlo."
              : "Vuelve a «Explorar», fíjate en cómo reconocerlos y prueba otra ronda."}
        </p>
        <Button className="mt-5" onClick={start}>
          Otra ronda
        </Button>
      </Card>
    );
  }

  const q = questions[index];
  const answered = picked !== null;
  const correct = picked === q.answer;

  const choose = (id: string) => {
    if (answered) return;
    setPicked(id);
    if (id === q.answer) setScore((s) => s + 1);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <ProgressBar value={index / questions.length} />
        <span className="shrink-0 text-sm tabular-nums text-muted">
          {index + 1}/{questions.length}
        </span>
      </div>

      <Card className="mt-5 p-6">
        {q.kind === "radical-of" && (
          <div className="text-center">
            <p className="text-sm text-muted">¿Cuál es el radical de este carácter?</p>
            <button type="button" onClick={() => speak(q.example.hanzi, "zh")} className="mt-3 inline-flex items-center gap-3" aria-label="Escuchar">
              <span lang="zh-CN" className="font-cjk text-7xl">
                {q.example.hanzi}
              </span>
              <Volume2 size={18} className="text-muted" />
            </button>
            <p className="mt-1 text-sm text-muted">
              {q.example.pinyin} · «{q.example.meaning}»
            </p>
          </div>
        )}
        {q.kind === "meaning-of" && (
          <div className="text-center">
            <p className="text-sm text-muted">¿Qué significa este radical?</p>
            <span lang="zh-CN" className="mt-3 block font-cjk text-7xl">
              {q.glyph}
            </span>
          </div>
        )}
        {q.kind === "family-of" && (
          <div className="text-center">
            <p className="text-sm text-muted">¿Qué carácter lleva el radical de…</p>
            <p className="mt-2 text-3xl font-semibold capitalize">{q.meaning}?</p>
          </div>
        )}

        <div className={cn("mt-6 grid gap-2", q.kind === "meaning-of" ? "sm:grid-cols-2" : "grid-cols-2")}>
          {q.options.map((o) => {
            const isAnswer = o.id === q.answer;
            return (
              <button
                key={o.id}
                type="button"
                disabled={answered}
                onClick={() => choose(o.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-xl border px-3 py-3 text-center transition",
                  !answered && "border-line hover:border-accent hover:bg-accent-soft/40",
                  answered && isAnswer && "border-success bg-success-soft",
                  answered && !isAnswer && o.id === picked && "border-danger bg-danger-soft",
                  answered && !isAnswer && o.id !== picked && "border-line opacity-60",
                )}
              >
                <span lang={o.cjk ? "zh-CN" : undefined} className={cn(o.cjk ? "font-cjk text-4xl" : "font-medium capitalize")}>
                  {o.label}
                </span>
                {o.sub && answered && <span className="text-xs text-muted">{o.sub}</span>}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={cn("mt-5 flex items-start gap-3 rounded-xl px-4 py-3 text-sm", correct ? "bg-success-soft" : "bg-danger-soft")}>
            {correct ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-danger" />}
            <p className="leading-snug">
              <strong>{correct ? "¡Correcto!" : "No exactamente."}</strong> {q.explanation}
            </p>
          </div>
        )}
      </Card>

      {answered && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => {
              setIndex((i) => i + 1);
              setPicked(null);
            }}
          >
            {index + 1 === questions.length ? "Ver resultado" : "Siguiente"}
          </Button>
        </div>
      )}
    </div>
  );
}
