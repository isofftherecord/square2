import type { Metadata } from "next";

import { DoubleBlock } from "@/components/double-block";
import { MainHero, type HeroSlide } from "@/components/main-hero";
import { MetricsBar } from "@/components/metrics-bar";
import { ProjectIndex, type ProjectSummary } from "@/components/project-index";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { homeHeroQuery, projectsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

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
      ?.filter((slide) => slide.image && slide.property && slide.year)
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
        client.fetch<HomeHeroDoc | null>(homeHeroQuery),
        client.fetch<ProjectSummary[]>(projectsQuery),
      ])
    : [null, [] as ProjectSummary[]];
  const heroSlides = toHeroSlides(heroDoc);

  return (
    <main className="s2-subgrid">
      {heroSlides.length > 0 ? <MainHero slides={heroSlides} /> : null}
      <DoubleBlock
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
      <section className="s2-subgrid items-center py-20 ">

        <div className="col-span-12 lg:col-start-2 lg:col-span-5">
          <p className="text-h2">The Investor’s Eye</p>
          <p className="text-body pt-9">Granular submarket knowledge. Opportunities a pure buyer overlooks. An acquisition thesis built from the ground rather than from a spreadsheet.</p>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <p className="text-h2">The Owner’s Hand</p>
          <p className="text-body pt-9">On-site presence. Managers who read the financials and not just the building. An owner's urgency on every asset, every day.</p>
        </div>
      </section>

      {/* The Hold */}
      <section className="bg-s2-orange text-s2-white s2-subgrid items-center ">
        <div className="s2-page py-12 lg:col-start-2 lg:col-span-10 py-14">
          <h2 className="col-span-12 text-h2 ">The Hold.</h2>

          <div className="col-span-12 pt-7">
            <p className="text-micro">Investment</p>

            <div className="relative mt-5 h-28">
              {/* base del bracket */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-s2-white" />

              {/* Acquire */}
              <div className="absolute inset-y-0 left-0 flex flex-col items-start">
                <span className="text-data whitespace-nowrap">Acquire</span>
                <span className="mt-2 size-2 shrink-0 bg-s2-white" />
                <span className="w-px flex-1 bg-s2-white" />
              </div>

              {/* Reposition */}
              <div
                className="absolute inset-y-0 flex flex-col items-center"
                style={{ left: "33.333%", transform: "translateX(-50%)" }}
              >
                <span className="text-data whitespace-nowrap">Reposition</span>
                <span className="mt-2 size-2 shrink-0 bg-s2-white" />
                <span className="w-px flex-1 bg-s2-white" />
              </div>

              {/* Re-tenant */}
              <div
                className="absolute inset-y-0 flex flex-col items-center"
                style={{ left: "66.666%", transform: "translateX(-50%)" }}
              >
                <span className="text-data whitespace-nowrap">Re-tenant</span>
                <span className="mt-2 size-2 shrink-0 bg-s2-white" />
                <span className="w-px flex-1 bg-s2-white" />
              </div>

              {/* Exit */}
              <div className="absolute inset-y-0 right-0 flex flex-col items-end">
                <span className="text-data whitespace-nowrap">Exit</span>
                <span className="mt-2 size-2 shrink-0 bg-s2-white" />
                <span className="w-px flex-1 bg-s2-white" />
              </div>
            </div>
          </div>

          {/* barra de property management */}
          <div className="col-span-12 mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 bg-s2-black px-6 py-6">
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

          <div className="col-span-12 mt-5 flex justify-between gap-x-8">
            <p className="text-micro">Property management</p>
            <p className="text-micro text-right">
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
      {projects.length > 0 ? (
        <ProjectIndex heading="Projects." projects={projects} />
      ) : null}
    </main>
  );
}
