import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // @sanity/workbench (alpha) expone TypeScript sin compilar en modo desarrollo;
  // sin esto, Turbopack falla con "Unknown module type" al abrir /studio.
  transpilePackages: ["@sanity/workbench"],
  // Ruta anterior en español; se mantiene para no romper enlaces.
  async redirects() {
    return [
      {
        source: "/proyectos/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
