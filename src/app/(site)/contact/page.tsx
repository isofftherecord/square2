import type { Metadata } from "next";

import { TitlePage } from "@/components/title-page";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { pageBySlugQuery } from "@/sanity/lib/queries";
import { toTitleHeroSlides } from "@/sanity/lib/title-hero";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact — Square2",
};

export default async function ContactPage() {
  const slides = isSanityConfigured
    ? toTitleHeroSlides(
        await client.fetch(pageBySlugQuery, { slug: "contact" }),
      )
    : [];

  return <TitlePage slides={slides} fallbackTitle="Contact" />;
}
