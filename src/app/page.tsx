import Image from "next/image";
import Link from "next/link";

import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { categoriasQuery, proyectosQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type Categoria = {
  _id: string;
  titulo: string;
  slug: string;
  descripcion?: string;
};

type ProyectoResumen = {
  _id: string;
  titulo: string;
  slug: string;
  resumen?: string;
  imagenPrincipal?: { alt?: string } & Record<string, unknown>;
  fecha?: string;
  destacado?: boolean;
  categoria?: { titulo: string; slug: string };
};

async function getDatos() {
  if (!isSanityConfigured) {
    return { proyectos: [] as ProyectoResumen[], categorias: [] as Categoria[] };
  }
  const [proyectos, categorias] = await Promise.all([
    client.fetch<ProyectoResumen[]>(proyectosQuery),
    client.fetch<Categoria[]>(categoriasQuery),
  ]);
  return { proyectos, categorias };
}

export default async function Home() {
  const { proyectos, categorias } = await getDatos();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Square2</h1>
        <p className="mt-2 max-w-2xl text-neutral-400">
          Portafolio de proyectos. Explora nuestro trabajo por categoría.
        </p>
      </header>

      {!isSanityConfigured ? (
        <section className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-6">
          <h2 className="text-lg font-semibold text-amber-300">
            Falta conectar Sanity
          </h2>
          <p className="mt-2 text-sm text-neutral-300">
            Crea un proyecto en{" "}
            <a
              href="https://sanity.io/manage"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              sanity.io/manage
            </a>{" "}
            y copia tu <code>Project ID</code> en el archivo{" "}
            <code>.env.local</code> (usa <code>.env.example</code> como guía).
            Luego entra a <code>/studio</code> para agregar proyectos.
          </p>
        </section>
      ) : (
        <>
          {categorias.length > 0 && (
            <nav className="mb-10 flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <span
                  key={cat._id}
                  className="rounded-full border border-neutral-700 px-4 py-1.5 text-sm text-neutral-300"
                >
                  {cat.titulo}
                </span>
              ))}
            </nav>
          )}

          {proyectos.length === 0 ? (
            <p className="text-neutral-400">
              Aún no hay proyectos publicados. Agrega el primero desde{" "}
              <Link href="/studio" className="underline">
                el panel de contenido
              </Link>
              .
            </p>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {proyectos.map((proyecto) => (
                <li key={proyecto._id} className="group">
                  <Link href={`/proyectos/${proyecto.slug}`} className="block">
                    {proyecto.imagenPrincipal && (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-900">
                        <Image
                          src={urlFor(proyecto.imagenPrincipal)
                            .width(800)
                            .height(600)
                            .url()}
                          alt={proyecto.imagenPrincipal.alt ?? proyecto.titulo}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="mt-3">
                      {proyecto.categoria && (
                        <p className="text-xs uppercase tracking-wide text-neutral-500">
                          {proyecto.categoria.titulo}
                        </p>
                      )}
                      <h2 className="mt-1 text-lg font-semibold group-hover:underline">
                        {proyecto.titulo}
                      </h2>
                      {proyecto.resumen && (
                        <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                          {proyecto.resumen}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
