import type { Metadata } from "next";

import { TitleHero } from "@/components/title-hero";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { firmHeroQuery } from "@/sanity/lib/queries";
import { toTitleHeroSlides } from "@/sanity/lib/title-hero";
import { DoubleBlock } from "@/components/double-block";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Firm — Square2",
};

export default async function FirmPage() {
  const slides = isSanityConfigured
    ? toTitleHeroSlides(await client.fetch(firmHeroQuery))
    : [];

  return (
    <>
  <TitleHero slides={slides} />
  <DoubleBlock
  heading="The Firm."
  body={
    <>
     Square2 is a Miami-based, vertically integrated operator and investor. Founded in 2008, in the teeth of the financial crisis, on the view that the firms worth backing are the ones that can still run the building after the capital is in.
      That was not a comfortable year to start. It was a useful one. Every assumption about rent, occupancy and exit was being tested in public, and the firms that came through were the ones close enough to the asset to see the problem early. Square2 has underwritten that way ever since.
      We acquire office, mixed-use, and adaptive re-use assets in Florida markets with high barriers to entry. Submarkets we know at street level, proximate to the people who decide where their companies sit. The list of places we will buy is short, and it does not get longer because capital is available. 
    </>
  }

  />
  </>
);
}
