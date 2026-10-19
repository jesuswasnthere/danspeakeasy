export const SITE = {
  name: "DanSpeakeasy",
  tagline: "Chino Mandarín e Inglés, por niveles, con estructura y seguimiento real.",
} as const;

export const NAV = [
  { href: "/", label: "Progreso", icon: "dashboard" },
  { href: "/libro", label: "Libro de clase", icon: "book" },
  { href: "/practica", label: "Práctica", icon: "practice" },
  { href: "/repaso", label: "Repaso", icon: "review" },
  { href: "/aula", label: "Aula", icon: "classroom" },
] as const;
