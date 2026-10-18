import { mockContentRepository, type ContentRepository } from "./repository";

/** Punto único de inyección del repositorio de contenido. */
export const content: ContentRepository = mockContentRepository;

export type { ContentRepository } from "./repository";
