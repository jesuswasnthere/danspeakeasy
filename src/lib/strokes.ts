import { CHARACTER_STROKES, STROKE_TYPES, type StrokeInfo, type StrokeKind } from "@/data/zh/strokes";

/** Datos de un carácter en formato Make Me a Hanzi / hanzi-writer-data. */
export interface CharacterData {
  strokes: string[];
  /** Línea media de cada trazo, de inicio a fin. Coordenadas 1024×1024 con el eje Y hacia arriba. */
  medians: number[][][];
  radStrokes?: number[];
}

const DATA_URL = (char: string) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(char)}.json`;
const cache = new Map<string, Promise<CharacterData>>();

/** Carga (y cachea) los trazos de un carácter desde el CDN de hanzi-writer-data. */
export function loadCharacterData(char: string): Promise<CharacterData> {
  let p = cache.get(char);
  if (!p) {
    p = fetch(DATA_URL(char)).then((r) => {
      if (!r.ok) throw new Error(`No hay datos de trazos para «${char}»`);
      return r.json() as Promise<CharacterData>;
    });
    p.catch(() => cache.delete(char));
    cache.set(char, p);
  }
  return p;
}

export interface NamedStroke extends StrokeInfo {
  kind: StrokeKind;
}

export interface StrokeNames {
  strokes: NamedStroke[];
  /** true si los nombres vienen de la tabla revisada; false si son estimados. */
  verified: boolean;
}

/**
 * Nombres de los trazos de un carácter: usa la tabla revisada si coincide con
 * el número de trazos de los datos; si no, los estima a partir de la geometría.
 */
export function strokeNamesFor(char: string, data: CharacterData): StrokeNames {
  const annotated = CHARACTER_STROKES[char];
  if (annotated && annotated.length === data.medians.length) {
    return { verified: true, strokes: annotated.map((kind) => ({ kind, ...STROKE_TYPES[kind] })) };
  }
  return {
    verified: false,
    strokes: data.medians.map((m) => {
      const kind = classifyStroke(m);
      return { kind, ...STROKE_TYPES[kind] };
    }),
  };
}

// ─── Clasificador geométrico (aproximado) ────────────────────────────────────

type Dir = "E" | "S" | "SW" | "SE" | "NE" | "W" | "N" | "NW";

interface Segment {
  dir: Dir;
  len: number;
}

function direction(dx: number, dy: number): Dir {
  const a = (Math.atan2(dy, dx) * 180) / Math.PI; // dy > 0 = hacia arriba
  if (a > -22 && a <= 22) return "E";
  if (a > 22 && a <= 70) return "NE";
  if (a > 70 && a <= 110) return "N";
  if (a > 110 && a <= 160) return "NW";
  if (a > 160 || a <= -165) return "W";
  if (a > -165 && a <= -112) return "SW";
  if (a > -112 && a <= -68) return "S";
  return "SE";
}

/** Simplificación Ramer–Douglas–Peucker. */
function simplify(points: number[][], epsilon: number): number[][] {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let maxD = 0;
  let idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const d = Math.abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) / len;
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD <= epsilon) return [points[0], points[points.length - 1]];
  return [...simplify(points.slice(0, idx + 1), epsilon).slice(0, -1), ...simplify(points.slice(idx), epsilon)];
}

function segmentsOf(median: number[][]): Segment[] {
  const pts = simplify(median, 28);
  const segs: Segment[] = [];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    const len = Math.hypot(dx, dy);
    if (len < 25) continue;
    const dir = direction(dx, dy);
    const last = segs[segs.length - 1];
    if (last && last.dir === dir) last.len += len;
    else segs.push({ dir, len });
  }
  // Quitar «entradas» del pincel y transiciones cortas (se conserva el último tramo: puede ser un gancho).
  const cleaned = segs.filter(
    (s, i) =>
      !(
        (s.len < 75 && i < segs.length - 1) ||
        // entrada algo más larga pero mucho menor que el tramo principal
        (i === 0 && segs.length > 1 && s.len < 110 && segs[1].len > 2 * s.len)
      ),
  );
  return cleaned.reduce<Segment[]>((acc, s) => {
    const last = acc[acc.length - 1];
    if (last && last.dir === s.dir) last.len += s.len;
    else acc.push({ ...s });
    return acc;
  }, []);
}

const isDown = (d: Dir) => d === "S" || d === "SW" || d === "SE";
const isHook = (s: Segment | undefined) => !!s && (s.dir === "N" || s.dir === "NW" || s.dir === "W") && s.len < 180;

export function classifyStroke(median: number[][]): StrokeKind {
  const segs = segmentsOf(median);
  if (segs.length === 0) return "dian";
  const [a, b, c] = segs;
  const total = segs.reduce((s, x) => s + x.len, 0);

  if (segs.length === 1) {
    switch (a.dir) {
      case "E":
        return "heng";
      case "S":
        return total < 110 ? "dian" : "shu";
      case "SW":
        return "pie";
      case "SE":
        return total < 280 ? "dian" : "na";
      case "NE":
        return "ti";
      default:
        return "dian";
    }
  }

  if (a.dir === "E") {
    if (isDown(b.dir) && b.len > 120) {
      if (isHook(c)) return "hengzhegou";
      if (c && (c.dir === "E" || c.dir === "SE")) return "hengzhewangou";
      return b.dir === "SW" ? "hengpie" : "hengzhe";
    }
    if (b.dir === "SW" || isHook(b)) return "henggou";
  }
  if (a.dir === "S") {
    if (isHook(b)) return "shugou";
    if (b.dir === "NE") return "shuti";
    if (b.dir === "SW" && !c) return "pie"; // 竖撇: empieza vertical y cae a la izquierda
    if (b.dir === "E" || b.dir === "SE") return isHook(c) || c?.dir === "N" ? "shuwangou" : "shuzhe";
  }
  if (a.dir === "SW") {
    if (b.dir === "SE") return "piedian";
    if (b.dir === "E" || b.dir === "NE") return "piezhe";
    if (isHook(b)) return "wangou";
  }
  if (a.dir === "SE") {
    if (b.dir === "E" && !c) return "na"; // 平捺 / 捺 con remate horizontal
    if (isHook(b) || b.dir === "N" || b.dir === "NE") return a.len > 300 ? "xiegou" : "wogou";
  }
  if (isDown(a.dir) && isHook(segs[segs.length - 1])) return "wangou";
  return "compuesto";
}
