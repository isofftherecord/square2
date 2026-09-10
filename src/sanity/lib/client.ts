import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
  apiVersion,
  // API en vivo: el CDN de Sanity puede devolver el documento anterior al publicar.
  useCdn: false,
  perspective: "published",
});
