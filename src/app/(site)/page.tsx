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
        body="Square2 acquires, repositions, and operates office and mixed-use real estate across Florida's core submarkets. Every asset is held to an owner's standard, whether we own it or run it for someone who does."
      />
      <section className="s2-subgrid items-center ">
        <hr className="col-span-12 border-t border-s2-black lg:col-start-2 lg:col-span-10 " />
      </section>
      <section className="s2-subgrid items-start gap-y-12 py-12 lg:py-20">

        <div className="col-span-12 lg:col-span-5 lg:col-start-2">
          <p className="text-h2">The Investor’s Eye</p>
          <p className="text-body pt-9">Granular submarket knowledge. Opportunities a pure buyer overlooks. An acquisition thesis built from the ground rather than from a spreadsheet.</p>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <p className="text-h2">The Owner’s Hand</p>
          <p className="text-body pt-9">On-site presence. Managers who read the financials and not just the building. An owner's urgency on every asset, every day.</p>
        </div>
      </section>

      {/* The Hold */}
      <section className="col-span-12 text-s2-white ml-[calc(50%-50vw)] w-screen max-w-[100vw] bg-s2-orange">

        <div className="s2-page py-14">
          <h2 className="text-h2 col-span-12 lg:col-span-10 lg:col-start-2">The Hold.</h2>

          <div className="col-span-12 pt-7 lg:col-span-10 lg:col-start-2">
            <p className="text-micro">Investment</p>

            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 lg:relative lg:block lg:h-20">
              {/* Acquire */}
              <div className="flex flex-col items-start lg:absolute lg:inset-y-0 lg:left-0">
                <span className="text-data whitespace-nowrap">Acquire</span>
                <span className="mt-2 size-2 shrink-0 bg-s2-white" />
                <span className="hidden w-px flex-1 bg-s2-white lg:block" />
              </div>

              {/* Reposition */}
              <div className="flex flex-col items-start lg:absolute lg:inset-y-0 lg:left-1/3 lg:-translate-x-1/2">
                <span className="text-data whitespace-nowrap">Reposition</span>
                <span className="mt-2 size-2 shrink-0 bg-s2-white" />
                <span className="hidden w-px flex-1 bg-s2-white lg:block" />
              </div>

              {/* Re-tenant */}
              <div className="flex flex-col items-start lg:absolute lg:inset-y-0 lg:left-2/3 lg:-translate-x-1/2 lg:items-center">
                <span className="text-data whitespace-nowrap">Re-tenant</span>
                <span className="mt-2 size-2 shrink-0 bg-s2-white" />
                <span className="hidden w-px flex-1 bg-s2-white lg:block" />
              </div>

              {/* Exit */}
              <div className="flex flex-col items-start lg:absolute lg:inset-y-0 lg:right-0 lg:items-end">
                <span className="text-data whitespace-nowrap">Exit</span>
                <span className="mt-2 size-2 shrink-0 bg-s2-white" />
                <span className="hidden w-px flex-1 bg-s2-white lg:block" />
              </div>

              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 hidden h-px bg-s2-white lg:block"
              />
            </div>
          </div>

          {/* barra de property management */}
          <div className="col-span-12 mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 bg-s2-black px-5 py-5 lg:col-span-10 lg:col-start-2">
            <span className="text-data">Leasing</span>
            <span className="text-data" aria-hidden="true">·</span>
            <span className="text-data">Accounting</span>
            <span className="text-data" aria-hidden="true">·</span>
            <span className="text-data">Maintenance</span>
            <span className="text-data" aria-hidden="true">·</span>
            <span className="text-data">Tenant experience</span>
            <span className="text-data" aria-hidden="true">·</span>
            <span className="text-data">Governance</span>
          </div>

          <div className="col-span-12 mt-5 flex flex-col gap-2 lg:col-span-10 lg:col-start-2 lg:flex-row lg:justify-between lg:gap-x-8">
            <p className="text-micro">Property management</p>
            <p className="text-micro lg:text-right">
              The investor acts at moments · The owner acts every day
            </p>
          </div>
        </div>
      </section>
      <DoubleBlock
        heading={<>
          The <span className="italic">proof</span> is the buildings we don't own.
        </>
        }
        body={
          <>
            Square2 operates assets for other owners to the same standard it applies to its own. Not as a separate business line. It is the demonstration that the standard is real.
            <br /><br />
            A firm that runs someone else's building the way it runs its own is a firm whose incentives you can read.
          </>
        }

      />
      <section className="s2-subgrid items-center">
        <hr className="col-span-12 border-t border-s2-black lg:col-span-10 lg:col-start-2" />
      </section>
      <MetricsBar
        items={[
          { value: "2008", label: "Founded" },
          { value: "13", label: "Properties" },
          { value: "0,000,000", label: "SF owned and managed", span: 4 },
          { value: "Florida", label: "Core submarkets" },
        ]}
      />

<section className="s2-subgrid items-center ">
        <hr className="col-span-12 border-t border-s2-black lg:col-start-2 lg:col-span-10 " />
      </section>


      {projects.length > 0 ? (
        <ProjectIndex heading="Projects." projects={projects} />
      ) : null}


      <section className="s2-subgrid items-center pt-12 pb-16 lg:pt-20 lg:pb-30">
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
