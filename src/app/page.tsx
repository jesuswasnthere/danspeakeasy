import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Globe,
  GraduationCap,
  Layers,
  Mic,
  PenTool,
  Repeat2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { APP_HOME, SITE } from "@/config/site";
import { LANGUAGES, levelsFor } from "@/data/levels";
import { FAQ } from "@/config/landing";
import { JsonLd } from "@/components/landing/JsonLd";
import type { LanguageCode } from "@/types/learning";

/**
 * Landing pública (Server Component, prerenderizada en el build). No pasa por
 * <AppShell> ni lee localStorage: el HTML ya trae todo el contenido para los
 * rastreadores. La app del alumno vive en /app.
 */

const TITLE = `${SITE.name} · Aprende idiomas por niveles, con seguimiento real`;
const DESCRIPTION =
  "Aprende Chino Mandarín (HSK 1–6) e Inglés (MCER A1–C2) por niveles: libro de clase interactivo, pronunciación con reconocimiento en tu dispositivo, escritura de hanzi trazo a trazo y repaso espaciado. Más idiomas próximamente. Empieza gratis.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: SITE.name,
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const LANGUAGE_SAMPLES: Record<LanguageCode, { text: string; lang: string; reading: string; meaning: string }> = {
  zh: { text: "你好", lang: "zh", reading: "nǐ hǎo", meaning: "hola" },
  en: { text: "hello", lang: "en", reading: "/həˈloʊ/", meaning: "hola" },
};

const FEATURES: { icon: ReactNode; title: string; body: ReactNode }[] = [
  {
    icon: <Layers size={20} aria-hidden />,
    title: "Contenido y aula segmentados por nivel",
    body: "Todo lo que ves corresponde al nivel que eliges: lecciones, práctica, repaso y aula. Sin material demasiado fácil ni imposible.",
  },
  {
    icon: <BookOpen size={20} aria-hidden />,
    title: "Libro de clase interactivo",
    body: "Unidades con teoría, vocabulario con audio, diálogos y ejercicios corregidos al momento. Tus fallos se guardan para repasarlos después.",
  },
  {
    icon: <Mic size={20} aria-hidden />,
    title: "Pronunciación con reconocimiento en tu dispositivo",
    body: "Graba frases con tu micrófono y recibe una puntuación. La voz se procesa en tu propio equipo: el audio no sale de tu navegador.",
  },
  {
    icon: <PenTool size={20} aria-hidden />,
    title: "Escritura de hanzi trazo a trazo",
    body: (
      <>
        Practica cada carácter con su orden de trazos y el nombre de cada trazo:{" "}
        <span lang="zh" className="font-cjk">
          横
        </span>{" "}
        (héng),{" "}
        <span lang="zh" className="font-cjk">
          竖
        </span>{" "}
        (shù),{" "}
        <span lang="zh" className="font-cjk">
          撇
        </span>{" "}
        (piě)…
      </>
    ),
  },
  {
    icon: <Repeat2 size={20} aria-hidden />,
    title: "Repaso espaciado Leitner",
    body: "Tarjetas de vocabulario que vuelven justo cuando estás a punto de olvidarlas, y re-práctica de los ejercicios que fallaste.",
  },
  {
    icon: <Users size={20} aria-hidden />,
    title: "Aula con misiones semanales",
    body: "Cada nivel tiene su aula con misiones que rotan cada semana y un tablón para compartir lo que practicas con tu nivel.",
  },
];

const DIFFERENTIATORS: { title: string; body: string }[] = [
  {
    title: "Estructura de verdad",
    body: "Niveles reconocidos (HSK y MCER) en lugar de lecciones sueltas: sabes dónde estás y qué te falta.",
  },
  {
    title: "Seguimiento real",
    body: "Progreso por unidad, racha, actividad semanal y un registro de errores que solo se cierra cuando los aciertas en el repaso.",
  },
  {
    title: "Las cuatro destrezas",
    body: "Lees, escuchas, hablas y escribes en un mismo sitio, con ejercicios que encajan con lo que acabas de estudiar.",
  },
  {
    title: "Privado por diseño",
    body: "No necesitas cuenta para empezar y tu progreso se guarda en tu navegador. El reconocimiento de voz funciona en tu dispositivo.",
  },
];

function CtaLink({ children, variant = "primary" }: { children: ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <Link
      href={APP_HOME}
      prefetch={false}
      className={
        variant === "primary"
          ? "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-ink transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          : "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 text-sm font-semibold transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      }
    >
      {children}
    </Link>
  );
}

export default function LandingPage() {
  const languages = Object.values(LANGUAGES);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "es",
        publisher: { "@id": `${SITE.url}/#organization` },
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/icon`,
        description: SITE.description,
        knowsLanguage: ["es", "zh", "en"],
      },
    ],
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <JsonLd data={faqData} />

      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:shadow"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-semibold" aria-label={`${SITE.name}, inicio`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink">
              <GraduationCap size={18} aria-hidden />
            </span>
            {SITE.name}
          </Link>
          <nav aria-label="Secciones" className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#idiomas" className="hover:text-ink">
              Idiomas
            </a>
            <a href="#como-funciona" className="hover:text-ink">
              Cómo funciona
            </a>
            <a href="#preguntas" className="hover:text-ink">
              Preguntas
            </a>
          </nav>
          <Link
            href={APP_HOME}
            prefetch={false}
            className="inline-flex h-9 items-center rounded-lg bg-accent px-3.5 text-sm font-semibold text-accent-ink hover:opacity-90"
          >
            Empezar gratis
          </Link>
        </div>
      </header>

      <main id="contenido">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              <Globe size={14} aria-hidden /> Una plataforma para aprender cualquier idioma
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Aprende idiomas por niveles, con estructura y seguimiento real
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {SITE.name} organiza cada idioma por niveles reconocidos y te acompaña con libro de clase,
              práctica de pronunciación y escritura, repaso espaciado y un aula para tu nivel. Hoy puedes
              estudiar <strong className="font-semibold text-ink">Chino Mandarín (HSK 1–6)</strong> e{" "}
              <strong className="font-semibold text-ink">Inglés (MCER A1–C2)</strong>; más idiomas,
              próximamente.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink>
                Empezar gratis <ArrowRight size={16} aria-hidden />
              </CtaLink>
              <a
                href="#como-funciona"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-surface px-5 text-sm font-semibold transition hover:bg-surface-2"
              >
                Ver cómo funciona
              </a>
            </div>
            <p className="mt-4 text-sm text-muted">Sin registro: tu progreso se guarda en tu navegador.</p>
          </div>
        </section>

        {/* Idiomas */}
        <section id="idiomas" aria-labelledby="idiomas-titulo" className="border-y border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="idiomas-titulo" className="text-2xl font-bold tracking-tight sm:text-3xl">
              Idiomas disponibles
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Cada idioma sigue su marco de referencia oficial, así que siempre sabes en qué nivel estás.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {languages.map((language) => {
                const sample = LANGUAGE_SAMPLES[language.code];
                return (
                  <article key={language.code} className="flex flex-col rounded-2xl border border-line bg-bg p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold">
                        <span aria-hidden className="mr-2">
                          {language.flag}
                        </span>
                        {language.name}
                      </h3>
                      <span
                        lang={language.code}
                        className={language.code === "zh" ? "font-cjk text-muted" : "text-muted"}
                      >
                        {language.nativeName}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">Niveles {language.framework}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`Niveles de ${language.name}`}>
                      {levelsFor(language.code).map((level) => (
                        <li
                          key={level.code}
                          title={level.name}
                          className="rounded-lg border border-line bg-surface px-2 py-1 text-xs font-medium"
                        >
                          {level.label}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-t border-line pt-4 text-sm">
                      <span lang={sample.lang} className={language.code === "zh" ? "font-cjk text-lg" : "text-lg"}>
                        {sample.text}
                      </span>{" "}
                      <span lang={sample.lang === "zh" ? "zh-Latn-pinyin" : "en"} className="text-muted">
                        {sample.reading}
                      </span>{" "}
                      <span className="text-muted">· «{sample.meaning}»</span>
                    </p>
                  </article>
                );
              })}
              <article className="flex flex-col justify-center rounded-2xl border border-dashed border-line p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Globe size={18} aria-hidden className="text-accent" /> Más idiomas en camino
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {SITE.name} está pensado para cualquier idioma: el mismo sistema de niveles, práctica y
                  seguimiento. Próximamente se sumarán nuevos idiomas.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" aria-labelledby="como-funciona-titulo" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="como-funciona-titulo" className="text-2xl font-bold tracking-tight sm:text-3xl">
            Cómo funciona
          </h2>
          <ol className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            {["Elige idioma y nivel.", "Estudia y practica con material de tu nivel.", "Repasa lo que fallas y sigue tu progreso."].map(
              (step, i) => (
                <li key={step} className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-ink">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ),
            )}
          </ol>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-line bg-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  {feature.icon}
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Por qué es distinto */}
        <section aria-labelledby="distinto-titulo" className="border-y border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="distinto-titulo" className="text-2xl font-bold tracking-tight sm:text-3xl">
              Por qué es distinto
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {DIFFERENTIATORS.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <ShieldCheck size={20} aria-hidden className="mt-0.5 shrink-0 text-success" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section id="preguntas" aria-labelledby="preguntas-titulo" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 id="preguntas-titulo" className="text-2xl font-bold tracking-tight sm:text-3xl">
            Preguntas frecuentes
          </h2>
          <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface">
            {FAQ.map((item) => (
              <details key={item.question} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base">{item.question}</h3>
                  <ChevronDown size={18} aria-hidden className="shrink-0 text-muted transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section aria-labelledby="cta-titulo" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-3xl bg-accent-soft px-6 py-12 text-center sm:px-12">
            <h2 id="cta-titulo" className="text-2xl font-bold tracking-tight sm:text-3xl">
              Empieza hoy en tu nivel
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Elige idioma y nivel, y empieza con tu primera lección.
            </p>
            <div className="mt-6 flex justify-center">
              <CtaLink>
                Empezar gratis <ArrowRight size={16} aria-hidden />
              </CtaLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="flex items-center gap-2">
            <GraduationCap size={16} aria-hidden className="text-accent" />
            <span>
              <span className="font-semibold text-ink">{SITE.name}</span> · {SITE.tagline}
            </span>
          </p>
          <nav aria-label="Pie de página" className="flex gap-5">
            <a href="#idiomas" className="hover:text-ink">
              Idiomas
            </a>
            <a href="#preguntas" className="hover:text-ink">
              Preguntas
            </a>
            <Link href={APP_HOME} prefetch={false} className="hover:text-ink">
              Abrir la app
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
