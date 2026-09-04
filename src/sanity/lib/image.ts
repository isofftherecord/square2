import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Studio puede guardar alt sin haber subido el archivo
export function hasImageAsset<T>(source: T): source is T & SanityImageSource {
  return (
    typeof source === "object" &&
    source !== null &&
    "asset" in source &&
    Boolean((source as { asset?: unknown }).asset)
  );
}
