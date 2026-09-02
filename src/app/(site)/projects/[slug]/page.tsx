import type { PortableTextBlock } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableText } from "next-sanity";

import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
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

  return (
    <main className="col-span-12 py-16">
      <Link
        href="/"
        className="text-sm text-neutral-400 hover:text-neutral-200"
      >
        ← Back to projects
      </Link>

      <header className="mt-6">
        <h1 className="text-h1">{project.title}</h1>
        <dl className="text-body mt-3 flex flex-wrap gap-x-6 gap-y-1 text-s2-slate">
          {project.market && (
            <div>
              <dt className="text-tags inline text-s2-steel">Market </dt>
              <dd className="inline">{project.market}</dd>
            </div>
          )}
          {project.assetClass && (
            <div>
              <dt className="text-tags inline text-s2-steel">Class </dt>
              <dd className="inline">{project.assetClass}</dd>
            </div>
          )}
          {project.squareFootage != null && (
            <div>
              <dt className="text-tags inline text-s2-steel">SF </dt>
              <dd className="inline">
                {project.squareFootage.toLocaleString("en-US")}
              </dd>
            </div>
          )}
          {project.years && (
            <div>
              <dt className="text-tags inline text-s2-steel">Year </dt>
              <dd className="inline">{project.years}</dd>
            </div>
          )}
          {project.role && (
            <div>
              <dt className="text-tags inline text-s2-steel">Role </dt>
              <dd className="text-tags inline bg-s2-orange px-2 py-1 text-s2-white">
                {project.role}
              </dd>
            </div>
          )}
        </dl>
      </header>

      {project.mainImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-neutral-900">
          <Image
            src={urlFor(project.mainImage).width(1600).url()}
            alt={project.mainImage.alt ?? project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {project.content && project.content.length > 0 && (
        <article className="prose prose-invert mt-10 max-w-none">
          <PortableText
            value={project.content}
            components={{
              types: {
                image: ({ value }: { value: ImageWithAlt }) => (
                  <Image
                    src={urlFor(value).width(1200).url()}
                    alt={value.alt ?? ""}
                    width={1200}
                    height={800}
                    className="rounded-lg"
                  />
                ),
              },
            }}
          />
        </article>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Gallery</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((photo) => (
              <div
                key={photo._key}
                className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-900"
              >
                <Image
                  src={urlFor(photo).width(800).height(600).url()}
                  alt={photo.alt ?? project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
