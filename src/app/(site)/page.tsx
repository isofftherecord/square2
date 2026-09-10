import type { Metadata } from "next";

import { Cta } from "@/components/cta";
import { DoubleBlock } from "@/components/double-block";
import { MainHero, type HeroSlide } from "@/components/main-hero";
import { MetricsBar } from "@/components/metrics-bar";
import { ProjectIndex, type ProjectSummary } from "@/components/project-index";
import { isSanityConfigured } from "@/sanity/env";
import { fetchPublished } from "@/sanity/lib/live";
import { hasImageAsset, urlFor } from "@/sanity/lib/image";
import { homeHeroQuery, projectsQuery } from "@/sanity/lib/queries";


import { Button } from "@/components/button";

export const metadata: Metadata = {
  title: "Square2",
};

// Etapas del ledger de Investment (Figma: 0% / 31% / 64% / derecha).
const HOLD_INVESTMENT_STAGES = [
  { label: "Acquire", className: "sm:left-0" },
  { label: "Reposition", className: "sm:left-[31%]" },
  { label: "Re-tenant", className: "sm:left-[64%]" },
  { label: "Exit", className: "sm:right-0 sm:items-end" },
] as const;

const HOLD_MANAGEMENT = [
  "Leasing",
  "Accounting",
  "Maintenance",
  "Tenant experience",
  "Governance",
] as const;

type HomeHeroDoc = {
  slides?: {
    _key: string;
    property?: string;
    year?: string;
    image?: { alt?: string } & Record<string, unknown>;
  }[];
};

function toHeroSlides(doc: HomeHeroDoc | null): HeroSlide[] {
  return (
    doc?.slides
      ?.filter(
        (slide) => hasImageAsset(slide.image) && slide.property && slide.year,
      )
      .map((slide) => ({
        src: urlFor(slide.image!).width(2880).height(1800).url(),
        property: slide.property!,
        year: slide.year!,
      })) ?? []
  );
}

export default async function Home() {
  const [heroDoc, projects] = isSanityConfigured
    ? await Promise.all([
      fetchPublished<HomeHeroDoc | null>(homeHeroQuery),
      fetchPublished<ProjectSummary[]>(projectsQuery),
    ])
    : [null, [] as ProjectSummary[]];
  const heroSlides = toHeroSlides(heroDoc);

  return (
    <main className="s2-subgrid">
      {heroSlides.length > 0 ? <MainHero slides={heroSlides} /> : null}
      <DoubleBlock
        space="5"
        heading={
          <>
            Underwrite like an <span className="italic">investor</span>. Operate
            like an <span className="italic">owner</span>.
          </>
        }
        body="SQUARE2 acquires, repositions, and operates office, mixed-use, and adaptive reuse real estate across Florida's core submarkets. Markets with high barriers to entry, known at street level. Sourced off-market, through principal relationships. Underwritten below replacement cost. Every asset is held to an owner's standard, whether we own it or run it for someone who does."
      />
      <section className="s2-subgrid items-center ">
        <hr className="col-span-12 border-t border-s2-black lg:col-start-2 lg:col-span-10 " />
      </section>
      <section className="s2-subgrid items-start gap-y-12 py-12 lg:py-20">

        <div className="col-span-12 lg:col-span-5 lg:col-start-2">
          <p className="text-h2">The Investor’s Eye</p>
          <p className="text-body pt-9">
            Granular submarket knowledge. Opportunities a pure buyer overlooks. An acquisition thesis built from the ground rather than from a spreadsheet.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <p className="text-h2">The Owner’s Hand</p>
          <p className="text-body pt-9">
            On-site presence. Managers who study the financials, not just the building. An owner's urgency on every asset, every day.
          </p>
        </div>
      </section>

      {/* The Hold — Figma solo tiene 1440; <sm apila el timeline en 2×2 */}
      <section className="col-span-12 ml-[calc(50%-50vw)] w-screen max-w-[100vw] bg-s2-orange text-s2-white">
        <div className="s2-page py-14 lg:pt-[58px] lg:pb-[93px]">
          <div className="col-span-12 flex flex-col gap-3 md:flex-row md:items-baseline md:gap-5 lg:col-span-10 lg:col-start-2">
            <h2 className="text-h2">The Hold.</h2>
            <p className="text-body">
              The investor acts at moments. The owner acts every day.
            </p>
          </div>

          <div className="col-span-12 mt-10 lg:col-span-10 lg:col-start-2">
            <h3 className="text-h3 text-s2-black">Investment</h3>
            <div className="relative mt-3.5 grid grid-cols-2 gap-x-4 gap-y-8 sm:block sm:h-[82px]">
              {HOLD_INVESTMENT_STAGES.map((stage) => (
                <div
                  key={stage.label}
                  className={`flex flex-col items-start ${stage.className} sm:absolute sm:inset-y-0`}
                >
                  <span className="text-data whitespace-nowrap">{stage.label}</span>
                  <span className="mt-2 flex w-2.5 flex-1 flex-col items-center">
                    <span className="size-2.5 shrink-0 bg-s2-white" />
                    <span className="hidden w-px flex-1 bg-s2-white sm:block" />
                  </span>
                </div>
              ))}
              <div
                aria-hidden
                className="absolute inset-x-[5px] bottom-0 hidden h-px bg-s2-white sm:block"
              />
            </div>
          </div>

          <div className="col-span-12 mt-10 lg:col-span-10 lg:col-start-2">
            <h3 className="text-h3 text-s2-black">Property Management</h3>
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 bg-s2-black px-5 py-4 md:h-12 md:flex-nowrap md:justify-between md:gap-0 md:py-0 min-[1440px]:px-[65px]">
              {HOLD_MANAGEMENT.flatMap((item, index) => [
                index > 0 ? (
                  <span
                    key={`mark-${item}`}
                    aria-hidden
                    className="hidden size-2.5 shrink-0 bg-s2-white md:block"
                  />
                ) : null,
                <span key={item} className="text-data whitespace-nowrap">
                  {item}
                </span>,
              ])}
            </div>
          </div>
        </div>
      </section>
      <DoubleBlock
        heading={<>
          The <span className="italic">proof</span> is the buildings we don't <span className="italic">own.</span>
        </>
        }
        body={
          <>
            SQUARE2 also operates assets for other owners to the same standard it applies to its own. Not as a separate business line. It is the demonstration that the standard is real.<br /><br />
            A firm that runs someone else's building the way it runs its own is a firm whose incentives you can read.          </>
        }

      />
      <section className="s2-subgrid items-center">
        <hr className="col-span-12 border-t border-s2-black lg:col-span-10 lg:col-start-2" />
      </section>
      <MetricsBar
        items={[
          { value: "2008", label: "Founded" },
          { value: "+26", label: "Properties" },
          { value: "4,831,880", label: "SF owned and managed" },
          { value: "$1.27B", label: "Acquired and realized" },
        ]}
      />

      <section className="s2-subgrid items-center ">
        <hr className="col-span-12 border-t border-s2-black lg:col-start-2 lg:col-span-10 " />
      </section>


      {projects.length > 0 ? (
        <ProjectIndex heading="Projects." projects={projects} />
      ) : null}


      <section className="s2-subgrid items-center pb-16 lg:pb-30">
        <Button
          href="/portfolio"
          variant="black"
          className="col-span-12 w-fit  lg:justify-self-center black"
        >
          See all projects
        </Button>
      </section>
      <Cta />
    </main>
  );
}
