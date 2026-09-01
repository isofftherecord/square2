import type { PortableTextBlock } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableText } from "next-sanity";

import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { proyectoPorSlugQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type ImagenConAlt = { alt?: string } & Record<string, unknown>;

type Proyecto = {
  _id: string;
  titulo: string;
  slug: string;
  resumen?: string;
  imagenPrincipal?: ImagenConAlt;
  galeria?: (ImagenConAlt & { _key: string })[];
  fecha?: string;
  cliente?: string;
  contenido?: PortableTextBlock[];
  categoria?: { titulo: string; slug: string };
};

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSanityConfigured) notFound();

  const { slug } = await params;
  const proyecto = await client.fetch<Proyecto | null>(proyectoPorSlugQuery, {
    slug,
  });

  if (!proyecto) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href="/"
        className="text-sm text-neutral-400 hover:text-neutral-200"
      >
        ← Volver a proyectos
      </Link>

      <header className="mt-6">
        {proyecto.categoria && (
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {proyecto.categoria.titulo}
          </p>
        )}
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {proyecto.titulo}
        </h1>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-400">
          {proyecto.cliente && (
            <div>
              <dt className="inline font-medium text-neutral-300">Cliente: </dt>
              <dd className="inline">{proyecto.cliente}</dd>
            </div>
          )}
          {proyecto.fecha && (
            <div>
              <dt className="inline font-medium text-neutral-300">Fecha: </dt>
              <dd className="inline">
                {new Date(proyecto.fecha).toLocaleDateString("es", {
                  year: "numeric",
                  month: "long",
                })}
              </dd>
            </div>
          )}
        </dl>
      </header>

      {proyecto.imagenPrincipal && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-neutral-900">
          <Image
            src={urlFor(proyecto.imagenPrincipal).width(1600).url()}
            alt={proyecto.imagenPrincipal.alt ?? proyecto.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {proyecto.contenido && proyecto.contenido.length > 0 && (
        <article className="prose prose-invert mt-10 max-w-none">
          <PortableText
            value={proyecto.contenido}
            components={{
              types: {
                image: ({ value }: { value: ImagenConAlt }) => (
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

      {proyecto.galeria && proyecto.galeria.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Galería</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {proyecto.galeria.map((foto) => (
              <div
                key={foto._key}
                className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-900"
              >
                <Image
                  src={urlFor(foto).width(800).height(600).url()}
                  alt={foto.alt ?? proyecto.titulo}
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
