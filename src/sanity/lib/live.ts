import { defineLive } from "next-sanity/live";

import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Solo contenido publicado; no hace falta token de preview.
  serverToken: false,
  browserToken: false,
});

// Publicado actual en cada request. `sanityFetch` cachea para siempre y Live
// solo invalida si hay una pestaña del sitio abierta en ese host (localhost
// no refresca Vercel).
export async function fetchPublished<T>(query: string): Promise<T> {
  return client.fetch<T>(query, {}, { cache: "no-store", useCdn: false });
}
