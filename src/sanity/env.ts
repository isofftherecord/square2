// Next/Vercel inyectan NEXT_PUBLIC_* ausentes como "". `??` no cubre ese caso
// y createClient() tira "Configuration must contain projectId" en el build.
const configuredProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "";
const configuredDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "";

export const projectId = configuredProjectId || "placeholder";

export const dataset = configuredDataset || "production";

export const apiVersion = "2026-09-01";

export const isSanityConfigured =
  Boolean(configuredProjectId) &&
  configuredProjectId !== "your-project-id" &&
  configuredProjectId !== "tu-project-id" &&
  configuredProjectId !== "placeholder";
