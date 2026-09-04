import type { PortableTextBlock } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableText } from "next-sanity";

import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { hasImageAsset, urlFor } from "@/sanity/lib/image";
import { projectBySlugQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type ImageWithAlt = { alt?: string } & Record<string, unknown>;

type Project = {
  _id: string;
  title: string;
  slug: string;
  market?: string;
  assetClass?: string;
  squareFootage?: number;
  years?: string;
  role?: string;
  summary?: string;
  mainImage?: ImageWithAlt;
  gallery?: (ImageWithAlt & { _key: string })[];
  content?: PortableTextBlock[];
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSanityConfigured) notFound();

  const { slug } = await params;
  const project = await client.fetch<Project | null>(projectBySlugQuery, {
    slug,
  });

  if (!project) notFound();

  const gallery = project.gallery?.filter(hasImageAsset) ?? [];

  return (
    <main className="col-span-12 py-16">
      
     {/* Case study — scroll horizontal, barras fijas */}
<div className="fixed inset-0 flex flex-col bg-background text-foreground">
  {/* ───────── Barra superior (estática) ───────── */}
  <header className="s2-page shrink-0 items-center py-5">
    <p className="text-micro col-span-3">Las Olas Square</p>
    <p className="text-micro col-start-6 col-span-5">
      Owned · Realized · 2016—2022
    </p>
    <button
      type="button"
      aria-label="Cerrar proyecto"
      className="col-start-12 justify-self-end bg-s2-orange p-1.5 text-s2-white"
    >
      <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden="true">
        <path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  </header>

  {/* ───────── Riel de scroll ───────── */}
  <div className="flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden">
    <div className="flex h-full">
      {/* ═══ 01 · Portada ═══ */}
      <section className="s2-page h-full w-screen shrink-0 snap-start content-start overflow-y-auto py-20">
        <div className="col-start-2 col-span-8">
          <h1 className="text-h1">Las Olas Square</h1>

          <p className="text-body mt-6">
            501 &amp; 515 East Las Olas Boulevard
            <br />
            Downtown Fort Lauderdale
          </p>

          <dl className="mt-16 border-t border-s2-black">
            <div className="flex border-b border-s2-black py-4">
              <dt className="text-micro w-32 shrink-0">Owner</dt>
              <dd className="text-body">Square2 / Apollo JV</dd>
            </div>
            <div className="flex border-b border-s2-black py-4">
              <dt className="text-micro w-32 shrink-0">Class</dt>
              <dd className="text-body">Office</dd>
            </div>
            <div className="flex border-b border-s2-black py-4">
              <dt className="text-micro w-32 shrink-0">Role</dt>
              <dd className="text-body">Owned</dd>
            </div>
            <div className="flex border-b border-s2-black py-4">
              <dt className="text-micro w-32 shrink-0">Status</dt>
              <dd className="text-body">Realized</dd>
            </div>
            <div className="flex border-b border-s2-black py-4">
              <dt className="text-micro w-32 shrink-0">Market</dt>
              <dd className="text-body">Fort Lauderdale</dd>
            </div>
          </dl>
        </div>

        <div className="col-start-11 col-span-2">
          <h2 className="text-metrics">The Deal.</h2>

          <dl className="mt-8 space-y-8">
            <div>
              <dt className="text-h2">$90M</dt>
              <dd className="text-micro mt-1">Acquisition</dd>
            </div>
            <div>
              <dt className="text-h2">$330</dt>
              <dd className="text-micro mt-1">Per square foot</dd>
            </div>
            <div>
              <dt className="text-h2">77%</dt>
              <dd className="text-micro mt-1">Leased at entry</dd>
            </div>
            <div>
              <dt className="text-h2">27%</dt>
              <dd className="text-micro mt-1">Leveraged IRR</dd>
            </div>
            <div>
              <dt className="text-h2">2.6×</dt>
              <dd className="text-micro mt-1">MOIC / six years</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ═══ 02 · Out of True ═══ */}
      <section className="s2-page h-full w-screen shrink-0 snap-start content-start overflow-y-auto py-20">
        <figure className="col-start-2 col-span-5">
          <div className="relative aspect-[4/3]">
            <Image
              src="/projects/las-olas/as-acquired.jpg"
              alt="501 East Las Olas al momento de la adquisición, 2016"
              fill
              sizes="580px"
              className="object-cover"
            />
          </div>
          <figcaption className="text-micro bg-s2-orange px-4 py-3 text-s2-white">
            501 East Las Olas — as acquired, 2016
          </figcaption>
        </figure>

        <div className="col-start-8 col-span-4">
          <h2 className="text-metrics border-b border-s2-black pb-4">
            Out of True.
          </h2>
          <p className="text-body mt-8">
            SunTrust had held the two buildings for twenty years: a
            seventeen-story Class A tower from 1992 and a three-story Class C
            building from 1972, neither meaningfully updated, at 77% leased with
            rents well below market. In the heart of the strongest office
            corridor in Fort Lauderdale.
          </p>
          <p className="text-body mt-6">
            Acquired June 2016 from SunTrust in a programmatic joint venture
            with Apollo Global Management. $90 million. $330 per square foot.
            Substantially below replacement cost.
          </p>
        </div>
      </section>

      {/* ═══ 03 · The Work ═══ */}
      <section className="s2-page h-full w-screen shrink-0 snap-start content-start overflow-y-auto py-20">
        <figure className="col-start-2 col-span-5">
          <div className="relative aspect-[4/3]">
            <Image
              src="/projects/las-olas/urban-park.jpg"
              alt="Parque urbano entre los edificios 501 y 515"
              fill
              sizes="580px"
              className="object-cover"
            />
          </div>
          <figcaption className="text-micro bg-s2-orange px-4 py-3 text-s2-white">
            The urban park between 501 and 515
          </figcaption>
        </figure>

        <div className="col-start-8 col-span-4">
          <h2 className="text-metrics border-b border-s2-black pb-4">
            The Work.
          </h2>
          <p className="text-body mt-8">
            An $11 million gut renovation of 501, at $250 per square foot:
            stripping and reskinning the former bank branch, replacing
            mechanical, roof, and finishes. A $1 million modernization of 515.
          </p>
          <p className="text-body mt-6">
            Between the two buildings, a shaded urban park. Along the frontage,
            a pedestrian streetscape reconnected to Las Olas Boulevard.
          </p>
          <p className="text-body mt-6 font-bold">
            An $8 million land assemblage sold to Related Group for $22 million.
          </p>
          <p className="text-body mt-6 font-bold">
            Eighteen months of construction, carried out in an occupied
            building.
          </p>
        </div>
      </section>

      {/* ═══ 04 · Squared ═══ */}
      <section className="s2-page h-full w-screen shrink-0 snap-start content-start overflow-y-auto py-20">
        <figure className="col-start-2 col-span-5">
          <div className="relative aspect-[4/3]">
            <Image
              src="/projects/las-olas/streetscape-after.jpg"
              alt="Streetscape peatonal sobre Las Olas Boulevard"
              fill
              sizes="580px"
              className="object-cover"
            />

            {/* Toggle antes / después */}
            <div className="absolute left-4 top-4 flex gap-x-1">
              <button
                type="button"
                aria-pressed="false"
                className="text-micro bg-s2-white px-3 py-1.5 text-s2-black"
              >
                Before
              </button>
              <button
                type="button"
                aria-pressed="true"
                className="text-micro bg-s2-orange px-3 py-1.5 text-s2-white"
              >
                After
              </button>
            </div>
          </div>

          <figcaption className="text-micro bg-s2-orange px-4 py-3 text-s2-white">
            Pedestrian streetscape, Las Olas Boulevard
          </figcaption>

          {/* Controles de galería */}
          <div className="flex items-center justify-between bg-s2-black px-4 py-3 text-s2-white">
            <p className="text-micro">01/04</p>
            <div className="flex gap-x-4">
              <button type="button" aria-label="Imagen anterior" className="text-micro">
                ←
              </button>
              <button type="button" aria-label="Imagen siguiente" className="text-micro">
                →
              </button>
            </div>
          </div>
        </figure>

        <div className="col-start-8 col-span-4">
          <h2 className="text-metrics border-b border-s2-black pb-4">Squared.</h2>
          <p className="text-body mt-8">
            A building is not repositioned by its shell. A tenant meets a lobby,
            a restroom, a place to hold a meeting, and somewhere to sit outside
            at one o&apos;clock.
          </p>
          <p className="text-body mt-6">
            515 received a new lobby, rebuilt common areas and restrooms, and an
            upgraded garage, along with new conference centers and a covered
            outdoor community space. Between the two buildings, a shaded urban
            park with restaurant and tenant seating.
          </p>
          <p className="text-body mt-6">
            Occupancy moved from 77% to 94%. Nearly 190,000 square feet leased
            or renewed at record Las Olas rents. Holland &amp; Knight, Billings
            Cochran, and Berkowitz Dick &amp; Pollack renewed. Del Frisco&apos;s
            Grille and Spaces signed.
          </p>
          <p className="text-body mt-6 font-bold">
            The people who underwrote the deal are the people the tenants
            called.
          </p>
        </div>
      </section>

      {/* ═══ 05 · The exit ═══ */}
      <section className="s2-page h-full w-screen shrink-0 snap-start content-start overflow-y-auto py-20">
        <div className="col-start-2 col-span-7">
          <h2 className="text-metrics">The exit.</h2>

          <div className="mt-12 flex items-end gap-x-16">
            <div>
              <div className="h-24 w-40 bg-s2-black" />
              <p className="text-h2 mt-8">$90M</p>
              <p className="text-micro mt-2">2016 · Acquired</p>
              <p className="text-data mt-3">$330 per square foot</p>
              <p className="text-data">77% leased</p>
            </div>

            <div>
              <div className="relative h-32 w-32">
                <Image
                  src="/mark-2.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-h2 mt-8">$145.5M</p>
              <p className="text-micro mt-2">2022 · Sold</p>
              <p className="text-data mt-3">$521 per square foot</p>
              <p className="text-data">94% leased · 5.5% cap</p>
            </div>
          </div>

          <dl className="mt-20 flex gap-x-16 border-t border-s2-black pt-6">
            <div>
              <dt className="text-data">2.6×</dt>
              <dd className="text-micro mt-1">MOIC</dd>
            </div>
            <div>
              <dt className="text-data">27%</dt>
              <dd className="text-micro mt-1">Leveraged IRR</dd>
            </div>
            <div>
              <dt className="text-data">$34M</dt>
              <dd className="text-micro mt-1">Original equity</dd>
            </div>
            <div>
              <dt className="text-data">$167M</dt>
              <dd className="text-micro mt-1">Gross proceeds</dd>
            </div>
          </dl>
        </div>

        <div className="col-start-10 col-span-3 flex h-full flex-col">
          <h2 className="text-metrics border-b border-s2-black pb-4">
            Credits.
          </h2>

          <dl className="mt-8">
            <dt className="text-micro">Acquisition</dt>
            <dd className="text-body mt-1">Sourced and underwritten</dd>

            <dt className="text-micro mt-6">Capital</dt>
            <dd className="text-body mt-1">Joint venture with Apollo</dd>

            <dt className="text-micro mt-6">Construction</dt>
            <dd className="text-body mt-1">Managed on site</dd>

            <dt className="text-micro mt-6">Leasing</dt>
            <dd className="text-body mt-1">Directed, 77% to 94%</dd>

            <dt className="text-micro mt-6">Asset management</dt>
            <dd className="text-body mt-1">Six years to exit</dd>
          </dl>

          <a
            href="/projects/401-east"
            className="text-micro mt-auto self-end bg-s2-black px-5 py-3 text-s2-white"
          >
            Next · 401 East <span className="text-s2-orange">→</span>
          </a>
        </div>
      </section>
    </div>
  </div>

  {/* ───────── Barra inferior (estática) ───────── */}
  <footer className="s2-page shrink-0 items-center py-5">
    <p className="text-micro col-span-3">
      <span data-panel-counter>01</span> / 05
    </p>
    <p className="text-micro col-start-11 col-span-2 justify-self-end">
      Scroll <span className="text-s2-orange">→</span>
    </p>
  </footer>
</div>
    </main>
  );
}
