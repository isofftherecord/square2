import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // @sanity/workbench (alpha) expone TypeScript sin compilar en modo desarrollo;
  // sin esto, Turbopack falla con "Unknown module type" al abrir /studio.
  transpilePackages: ["@sanity/workbench"],
};

export default nextConfig;
