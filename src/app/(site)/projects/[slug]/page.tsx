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
  summary?: string;
  mainImage?: ImageWithAlt;
  gallery?: (ImageWithAlt & { _key: string })[];
  date?: string;
  client?: string;
  content?: PortableTextBlock[];
  category?: { title: string; slug: string };
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
        {project.category && (
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {project.category.title}
          </p>
        )}
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-400">
          {project.client && (
            <div>
              <dt className="inline font-medium text-neutral-300">Client: </dt>
              <dd className="inline">{project.client}</dd>
            </div>
          )}
          {project.date && (
            <div>
              <dt className="inline font-medium text-neutral-300">Date: </dt>
              <dd className="inline">
                {new Date(project.date).toLocaleDateString("en", {
                  year: "numeric",
                  month: "long",
                })}
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
