export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const apiVersion = "2026-09-01";

export const isSanityConfigured =
  Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "your-project-id" &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "tu-project-id";
