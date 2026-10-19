import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  /**
   * Aislamiento entre orígenes (cross-origin isolation): habilita SharedArrayBuffer,
   * que el reconocimiento de voz local (Whisper/ONNX en WASM) necesita para usar
   * varios hilos de CPU. `credentialless` permite seguir cargando recursos de CDN
   * (jsDelivr, Hugging Face) sin que tengan que enviar cabeceras especiales.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
