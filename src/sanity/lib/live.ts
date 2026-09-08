import { defineLive } from "next-sanity/live";

import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Solo contenido publicado; no hace falta token de preview.
  serverToken: false,
  browserToken: false,
});

// Wrapper tipado: Live revalida al publicar; `stega: false` deja strings limpios.
export async function fetchPublished<T>(query: string): Promise<T> {
  const { data } = await sanityFetch({ query, stega: false });
  return data as T;
}
