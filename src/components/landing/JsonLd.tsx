/**
 * Datos estructurados (schema.org) como <script type="application/ld+json">.
 * `JSON.stringify` no sanea HTML: escapamos `<` como < para que ningún
 * texto pueda cerrar el <script> (XSS), tal y como recomienda la guía de Next.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
