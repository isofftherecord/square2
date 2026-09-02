import type { TitleHeroSlide } from "@/components/title-hero";

import { urlFor } from "./image";

export type TitleHeroDoc = {
  slides?: {
    _key: string;
    title?: string;
    image?: { alt?: string } & Record<string, unknown>;
  }[];
};

export function toTitleHeroSlides(doc: TitleHeroDoc | null): TitleHeroSlide[] {
  return (
    doc?.slides
      ?.filter((slide) => slide.title && slide.image)
      .map((slide) => ({
        title: slide.title!,
        src: urlFor(slide.image!).width(2880).height(1600).url(),
        alt: slide.image!.alt ?? slide.title!,
      })) ?? []
  );
}
