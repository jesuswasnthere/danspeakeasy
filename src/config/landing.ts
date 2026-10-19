/**
 * Contenido de la landing pública. La FAQ se usa a la vez en la sección visible y
 * en el JSON-LD `FAQPage`: deben coincidir palabra por palabra (requisito de Google).
 * No añadas cifras, testimonios ni funciones que la app no tenga.
 */
export const FAQ: { question: string; answer: string }[] = [
  {
    question: "¿Qué idiomas puedo aprender en DanSpeakeasy?",
    answer:
      "Hoy están disponibles Chino Mandarín, organizado por los niveles HSK 1–6, e Inglés, organizado por los niveles del MCER (A1–C2). La plataforma está pensada para cualquier idioma y se irán añadiendo más próximamente.",
  },
  {
    question: "¿Cuesta algo empezar?",
    answer:
      "No. Puedes empezar gratis y sin crear cuenta: eliges idioma y nivel, y tu progreso se guarda en tu propio navegador.",
  },
  {
    question: "¿Por qué está todo organizado por niveles?",
    answer:
      "Porque aprender con material de tu nivel es más eficaz. El libro de clase, la práctica, el repaso y el aula se filtran por el nivel que eliges, y puedes cambiarlo cuando quieras.",
  },
  {
    question: "¿Cómo funciona la práctica de pronunciación?",
    answer:
      "Grabas una frase con el micrófono y el reconocimiento de voz se ejecuta en tu propio dispositivo, sin enviar el audio a ningún servidor. La primera vez se descarga el modelo de reconocimiento y después queda en caché. Mide si se te entiende; todavía no evalúa los tonos del chino.",
  },
  {
    question: "¿Puedo practicar la escritura de caracteres chinos?",
    answer:
      "Sí. Escribes cada hanzi trazo a trazo con su orden correcto y ves el nombre de cada trazo, como 横 (héng) o 竖 (shù).",
  },
];
