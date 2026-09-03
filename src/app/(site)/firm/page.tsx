import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/button";
import { TitleHero } from "@/components/second-hero";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { firmHeroQuery } from "@/sanity/lib/queries";
import { toTitleHeroSlides } from "@/sanity/lib/title-hero";
import { DoubleBlock } from "@/components/double-block";

export const revalidate = 60;

// Sin `photo` la tarjeta muestra el placeholder del wireframe.
const LEADERSHIP: {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}[] = [
    {
      name: "Jay Caplin",
      role: "Principal — General contracting",
      bio: "General contracting. Knows what the work costs before the offer is made.",
    },
    {
      name: "Michael Manno",
      role: "Principal — Hospitality",
      bio: "Hospitality. Judges an asset by how it performs for the people inside it.",
    },
    {
      name: "Alexandra Ramirez",
      role: "Operations — Appraisal & brokerage",
      bio: "Appraisal and brokerage. Holds the operating numbers against the underwriting.",
    },
  ];

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
            Square2 is a Miami-based, vertically integrated operator and investor. Founded in 2008, in the teeth of the financial crisis, on the view that the firms worth backing are the ones that can still run the building after the capital is in.<br /><br />
            That was not a comfortable year to start. It was a useful one. Every assumption about rent, occupancy and exit was being tested in public, and the firms that came through were the ones close enough to the asset to see the problem early. Square2 has underwritten that way ever since.<br /><br />
            We acquire office, mixed-use, and adaptive re-use assets in Florida markets with high barriers to entry. Submarkets we know at street level, proximate to the people who decide where their companies sit. The list of places we will buy is short, and it does not get longer because capital is available.
          </>
        }

      />

      <section className="s2-subgrid items-center ">
        <div className="col-span-12 lg:col-start-2 lg:col-span-12">
          <p className="text-h1">Defined by what we <span className="italic">refuse</span> to be.</p>
        </div>
        <div className="col-span-12 lg:col-start-5 lg:col-span-12 py-17">
          <p className="text-body py-5">Not the absentee manager who splits attention across buildings and passes the buck.</p>
          <hr className="border-t border-s2-black" />
          <p className="text-body py-5">Not the principal whose ego runs ahead of the partnership.</p>
          <hr className="border-t border-s2-black" />
          <p className="text-body py-5">Not the money-raiser who can't operate the asset once the capital is in.</p>
          <hr className="border-t border-s2-black" />
        </div>
      </section>


      {/* Leadership: banda de 10 columnas con 3 tarjetas iguales */}
      <section className="s2-subgrid pt-20 pb-30">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <h2 className="text-h2">Leadership.</h2>
          <hr className="mt-6 border-t border-s2-black" />

          <ul className="mt-9 grid grid-cols-1 gap-x-5 gap-y-14 lg:grid-cols-3">
            {LEADERSHIP.map((person) => (
              <li key={person.name}>
                <div className="relative aspect-[7/5] w-full border border-s2-black">
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      sizes="(min-width: 1024px) 380px, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    // Placeholder del wireframe mientras no hay retrato
                    <svg
                      className="absolute inset-0 h-full w-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 0 L100 100 M100 0 L0 100"
                        fill="none"
                        stroke="currentColor"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  )}
                </div>

                <h4 className="text-h5 mt-8">{person.name}</h4>
                <p className="text-micro mt-2">{person.role}</p>
                <p className="text-body mt-3">{person.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="s2-subgrid items-cente pt-5 pb-35 ">
        <div className="col-span-12 lg:col-start-2 lg:col-span-12">
          <p className="text-h1">One team with one standard out.</p>
        </div>
      </section>

      <section className="col-span-12 ml-[calc(50%-50vw)] w-screen max-w-[100vw] bg-s2-orange">
      <div className="s2-page items-center gap-y-8 py-20">
        <div className="col-span-12 lg:col-span-5 lg:col-start-2">
          <h2 className="text-h3 text-s2-white">That standard has a method.</h2>
          <p className="text-body mt-5 text-s2-white">How Square2 underwrites, and how it operates once the capital is in.</p>
        </div>

        <Button
        href= "/contact"
          className="col-span-12 w-fit lg:col-span-5 lg:justify-self-end"
        >
     HOW WE INVEST AND OPERATE
        </Button>
      </div>
    </section>
    </>
  );
}
