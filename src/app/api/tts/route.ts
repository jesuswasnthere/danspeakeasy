import type { NextRequest } from "next/server";

/**
 * Audio de respaldo (MP3) para cuando el navegador no tiene voz para el idioma
 * (p. ej. Windows sin voz china, Firefox o navegadores embebidos).
 *
 * Fase 1: usa el endpoint público de Google Translate TTS (no oficial, sin clave).
 * Fase 2: sustituir por un proveedor oficial (Azure Speech, Google Cloud TTS…)
 * con su API key en variables de entorno; el contrato de esta ruta no cambia.
 */

const LANGS: Record<string, string> = { "zh-CN": "zh-CN", "en-US": "en" };
const MAX_TTS_CHARS = 200;

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text")?.trim() ?? "";
  const lang = LANGS[request.nextUrl.searchParams.get("lang") ?? ""];

  if (!lang) return new Response("Idioma no soportado", { status: 400 });
  if (!text || text.length > MAX_TTS_CHARS) return new Response("Texto vacío o demasiado largo", { status: 400 });

  const upstream = new URL("https://translate.google.com/translate_tts");
  upstream.search = new URLSearchParams({ ie: "UTF-8", client: "tw-ob", tl: lang, q: text }).toString();

  const res = await fetch(upstream, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; LingoAula/1.0)" },
  });
  if (!res.ok || !res.body) return new Response("No se pudo generar el audio", { status: 502 });

  return new Response(res.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      // Mismo texto → mismo audio: se cachea en el navegador y en la CDN de Vercel.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
