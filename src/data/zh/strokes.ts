/**
 * Nombres de los trazos básicos del chino (笔画 bǐhuà) y su orden en los
 * caracteres del temario.
 *
 * Los caracteres anotados aquí muestran el nombre oficial de cada trazo. Para
 * cualquier otro carácter, `lib/strokes.ts` clasifica los trazos de forma
 * automática a partir de su geometría (marcado como «aproximado» en la UI).
 */

export type StrokeKind =
  | "heng"
  | "shu"
  | "pie"
  | "na"
  | "dian"
  | "ti"
  | "hengzhe"
  | "hengpie"
  | "hengzhegou"
  | "hengzhewangou"
  | "henggou"
  | "shugou"
  | "shuwangou"
  | "shuti"
  | "shuzhe"
  | "shuwan"
  | "piedian"
  | "piezhe"
  | "wangou"
  | "xiegou"
  | "wogou"
  | "compuesto";

export interface StrokeInfo {
  /** Nombre en chino */
  name: string;
  pinyin: string;
  /** Descripción en español */
  es: string;
  /** Glifo Unicode del trazo (bloque «CJK Strokes») */
  glyph: string;
}

export const STROKE_TYPES: Record<StrokeKind, StrokeInfo> = {
  heng: { name: "横", pinyin: "héng", es: "horizontal, de izquierda a derecha", glyph: "㇐" },
  shu: { name: "竖", pinyin: "shù", es: "vertical, de arriba abajo", glyph: "㇑" },
  pie: { name: "撇", pinyin: "piě", es: "cae hacia la izquierda", glyph: "㇒" },
  na: { name: "捺", pinyin: "nà", es: "cae hacia la derecha y se ensancha", glyph: "㇏" },
  dian: { name: "点", pinyin: "diǎn", es: "punto", glyph: "㇔" },
  ti: { name: "提", pinyin: "tí", es: "sube hacia la derecha", glyph: "㇀" },
  hengzhe: { name: "横折", pinyin: "héngzhé", es: "horizontal que gira hacia abajo", glyph: "㇕" },
  hengpie: { name: "横撇", pinyin: "héngpiě", es: "horizontal que cae a la izquierda", glyph: "㇇" },
  hengzhegou: { name: "横折钩", pinyin: "héngzhégōu", es: "horizontal, baja y termina en gancho", glyph: "㇆" },
  hengzhewangou: { name: "横折弯钩", pinyin: "héngzhéwāngōu", es: "horizontal, baja, curva y gancho hacia arriba", glyph: "㇈" },
  henggou: { name: "横钩", pinyin: "hénggōu", es: "horizontal con gancho", glyph: "㇖" },
  shugou: { name: "竖钩", pinyin: "shùgōu", es: "vertical con gancho a la izquierda", glyph: "㇚" },
  shuwangou: { name: "竖弯钩", pinyin: "shùwāngōu", es: "vertical, curva a la derecha y gancho arriba", glyph: "㇟" },
  shuti: { name: "竖提", pinyin: "shùtí", es: "vertical que sube a la derecha", glyph: "㇙" },
  shuzhe: { name: "竖折", pinyin: "shùzhé", es: "vertical que gira a la derecha", glyph: "㇗" },
  shuwan: { name: "竖弯", pinyin: "shùwān", es: "vertical con curva a la derecha", glyph: "㇄" },
  piedian: { name: "撇点", pinyin: "piědiǎn", es: "撇 seguido de un punto", glyph: "㇛" },
  piezhe: { name: "撇折", pinyin: "piězhé", es: "撇 que gira y sube a la derecha", glyph: "㇜" },
  wangou: { name: "弯钩", pinyin: "wāngōu", es: "curva con gancho", glyph: "㇁" },
  xiegou: { name: "斜钩", pinyin: "xiégōu", es: "diagonal larga con gancho", glyph: "㇂" },
  wogou: { name: "卧钩", pinyin: "wògōu", es: "curva tumbada con gancho", glyph: "㇃" },
  compuesto: { name: "复合笔画", pinyin: "fùhé bǐhuà", es: "trazo compuesto", glyph: "·" },
};

/** Orden y tipo de trazos (笔顺) de los caracteres del temario. */
export const CHARACTER_STROKES: Record<string, StrokeKind[]> = {
  // HSK 1
  好: ["piedian", "pie", "ti", "hengpie", "wangou", "heng"],
  // HSK 2 · Lección 1
  起: ["heng", "shu", "heng", "shu", "heng", "pie", "na", "hengzhe", "heng", "shuwangou"],
  床: ["dian", "heng", "pie", "heng", "shu", "pie", "na"],
  睡: ["shu", "hengzhe", "heng", "heng", "heng", "pie", "heng", "shu", "heng", "shu", "shu", "heng", "heng"],
  // HSK 2 · Lección 2
  唱: ["shu", "hengzhe", "heng", "shu", "hengzhe", "heng", "heng", "shu", "hengzhe", "heng", "heng"],
  洗: ["dian", "dian", "ti", "pie", "heng", "shu", "heng", "pie", "shuwangou"],
  等: ["pie", "heng", "dian", "pie", "heng", "dian", "heng", "shu", "heng", "heng", "shugou", "dian"],
  // HSK 2 · Lección 3
  病: ["dian", "heng", "pie", "dian", "ti", "heng", "shu", "hengzhegou", "pie", "dian"],
  药: ["heng", "shu", "shu", "piezhe", "piezhe", "ti", "pie", "hengzhegou", "dian"],
  冷: ["dian", "ti", "pie", "na", "dian", "hengpie", "dian"],
  热: ["heng", "shugou", "ti", "pie", "hengzhewangou", "dian", "dian", "dian", "dian", "dian"],
};
