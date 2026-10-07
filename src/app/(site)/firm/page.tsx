import type { Metadata } from "next";
import { Button } from "@/components/button";
import { DoubleBlock } from "@/components/double-block";
import {
  Leadership,
  toLeaders,
  type FirmLeadershipDoc,
} from "@/components/leadership";
import {
  Partners,
  toPartners,
  type FirmPartnersDoc,
} from "@/components/partners";
import { TitleHero } from "@/components/second-hero";
import { Team, toTeamMembers, type FirmTeamDoc } from "@/components/team";
import { isSanityConfigured } from "@/sanity/env";
import { fetchPublished } from "@/sanity/lib/live";
import {
  firmHeroQuery,
  firmLeadershipQuery,
  firmPartnersQuery,
  firmTeamQuery,
} from "@/sanity/lib/queries";
import { toTitleHeroSlides, type TitleHeroDoc } from "@/sanity/lib/title-hero";

export const metadata: Metadata = {
  title: "Firm — Square2",
};

export default async function FirmPage() {
  const [slides, leaders, teamMembers, partnersDoc] = isSanityConfigured
    ? await Promise.all([
      fetchPublished<TitleHeroDoc | null>(firmHeroQuery).then(toTitleHeroSlides),
      fetchPublished<FirmLeadershipDoc | null>(firmLeadershipQuery).then(toLeaders),
      fetchPublished<FirmTeamDoc | null>(firmTeamQuery).then(toTeamMembers),
      fetchPublished<FirmPartnersDoc | null>(firmPartnersQuery).then(
        toPartners,
      ),
    ])
    : [[], undefined, undefined, undefined];

  const people = leaders ?? [];
  const members = teamMembers ?? [];
  const intro = partnersDoc?.intro;
  const partners = partnersDoc?.partners ?? [];

  return (
    <>
      <TitleHero slides={slides} />
      <DoubleBlock
        space="4"
        space2="5"
        heading="The Firm."
        body={
          <>
            SQUARE2 is a Miami-based, vertically integrated operator and investor. Founded in 2008, in the teeth of the financial crisis, on the view that the firms worth backing are the ones that can still run the building after the capital is in.<br /><br />
            That was not a comfortable year to start. It was a useful one. Every assumption about rent, occupancy and exit was being tested in public, and the firms that came through were the ones close enough to the asset to see the problem early. SQUARE2 has underwritten that way ever since.<br /><br />
            We acquire office, mixed-use, and adaptive reuse assets in Florida markets with high barriers to entry. Submarkets we know at street level, proximate to the people who decide where their companies sit. The list of places we will buy is short, and it does not get longer because capital is available.
          </>
        }

      />

      <section className="s2-subgrid items-center gap-y-4">
        <div className="col-span-12 lg:col-start-2 lg:col-span-10">
          <p className="text-h1">Defined by what we <span className="italic">refuse</span> to be.</p>
        </div>
        <div className="col-span-12 lg:col-start-5 lg:col-span-7 py-8 lg:py-17">
          <p className="text-body py-5">Not the absentee manager who splits attention across buildings and passes the buck.</p>
          <hr className="border-t border-s2-black" />
          <p className="text-body py-5">Not the principal whose ego runs ahead of the partnership.</p>
          <hr className="border-t border-s2-black" />
          <p className="text-body py-5">Not the money-raiser who can't operate the asset once the capital is in.</p>
          <hr className="border-t border-s2-black" />
        </div>
      </section>


      <Leadership people={people} />
      <Team members={members} />
      <Partners intro={intro} partners={partners} />

      <section className="s2-hero bg-s2-fog pt-25 pb-10 lg:pb-30  ">
        <div className="s2-page">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <h2 className="text-h2">The long view.</h2>
            <hr className="mt-[30px] border-t border-s2-black" />
            <p className="text-body mt-4">One standard, as far as we can see.</p>
            <img






              src="/platform/Thelongview.svg"
              alt="Squares receding from a 2008 value square to a point labeled The Standard. The foreground square reads Every building after it."
              width={951}
              height={472}
              className="mx-auto mt-16 block h-auto w-full max-w-[951px] lg:mt-24"
            />
          </div>
        </div>
      </section>

      <section className="s2-subgrid items-center py-16 lg:py-36">
        <div className="col-span-12 lg:col-start-2 lg:col-span-12">
          <p className="text-h1">One team with one <span className="italic">standard</span>.</p>
        </div>
      </section>

      <section className="s2-bleed bg-s2-orange">
        <div className="s2-page items-center gap-y-8 py-16 lg:py-20">
          <div className="col-span-12 lg:col-span-5 lg:col-start-2">
            <h2 className="text-h3 text-s2-white">That standard has a method.</h2>
            <p className="text-body mt-5 text-s2-white">How SQUARE2 underwrites, and how it operates once the capital is in.</p>
          </div>

          <Button
            href="/platform"
            className="col-span-12 w-fit lg:col-span-5 lg:justify-self-end"
          >
            HOW WE INVEST AND OPERATE
          </Button>
        </div>
      </section>
    </>
  );
}
