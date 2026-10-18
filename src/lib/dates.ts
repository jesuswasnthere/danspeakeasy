/** Utilidades de fecha en hora local del alumno. */

const pad = (n: number) => String(n).padStart(2, "0");

/** YYYY-MM-DD en hora local. */
export function dayKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Semana ISO-8601 (las semanas empiezan en lunes). */
export function isoWeek(date: Date = new Date()): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

/** "2026-W42" */
export function weekKey(date: Date = new Date()): string {
  const { year, week } = isoWeek(date);
  return `${year}-W${pad(week)}`;
}

/** Lunes de la semana de `date` (00:00 local). */
export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - (day - 1));
  return d;
}

/** Días que faltan hasta el próximo lunes (renovación de retos). */
export function daysUntilNextWeek(date: Date = new Date()): number {
  const next = addDays(startOfWeek(date), 7);
  return Math.max(1, Math.ceil((next.getTime() - date.getTime()) / 86_400_000));
}

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

export function timeAgo(iso: string, now: Date = new Date()): string {
  const diff = (new Date(iso).getTime() - now.getTime()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return "ahora mismo";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86_400) return rtf.format(Math.round(diff / 3600), "hour");
  return rtf.format(Math.round(diff / 86_400), "day");
}

export const WEEKDAY_SHORT = ["L", "M", "X", "J", "V", "S", "D"];
