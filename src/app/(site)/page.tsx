import Image from "next/image";
import Link from "next/link";

import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { categoriesQuery, projectsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
};

type ProjectSummary = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  mainImage?: { alt?: string } & Record<string, unknown>;
  date?: string;
  featured?: boolean;
  category?: { title: string; slug: string };
};

async function getData() {
  if (!isSanityConfigured) {
    return { projects: [] as ProjectSummary[], categories: [] as Category[] };
  }
  const [projects, categories] = await Promise.all([
    client.fetch<ProjectSummary[]>(projectsQuery),
    client.fetch<Category[]>(categoriesQuery),
  ]);
  return { projects, categories };
}

export default async function Home() {
  const { projects, categories } = await getData();

  return (
    <main className="s2-subgrid py-16">
      <header className="col-span-8 mb-12">
        <p className="text-body text-s2-slate">
          Project portfolio. Explore our work by category.
        </p>
      </header>

      {!isSanityConfigured ? (
        <section className="col-span-12 rounded-xl border border-s2-orange/40 bg-s2-orange/10 p-6">
          <h2 className="text-h5 text-s2-orange">Sanity is not connected</h2>
          <p className="text-body mt-2 text-s2-slate">
            Create a project on{" "}
            <a
              href="https://sanity.io/manage"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              sanity.io/manage
            </a>{" "}
            and copy your <code>Project ID</code> into{" "}
            <code>.env.local</code> (see <code>.env.example</code>). Then open{" "}
            <code>/studio</code> to add projects.
          </p>
        </section>
      ) : (
        <>
          {categories.length > 0 && (
            <nav className="col-span-12 mb-10 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category._id}
                  className="text-tags rounded-full border border-s2-steel px-4 py-2 text-s2-slate"
                >
                  {category.title}
                </span>
              ))}
            </nav>
          )}

          {projects.length === 0 ? (
            <p className="text-body col-span-12 text-s2-slate">
              No published projects yet. Add the first one from{" "}
              <Link href="/studio" className="underline">
                the content studio
              </Link>
              .
            </p>
          ) : (
            <ul className="s2-subgrid gap-y-8">
              {projects.map((project) => (
                <li
                  key={project._id}
                  className="group col-span-12 sm:col-span-6 lg:col-span-4"
                >
                  <Link href={`/projects/${project.slug}`} className="block">
                    {project.mainImage && (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-s2-white">
                        <Image
                          src={urlFor(project.mainImage)
                            .width(800)
                            .height(600)
                            .url()}
                          alt={project.mainImage.alt ?? project.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="mt-3">
                      {project.category && (
                        <p className="text-tags text-s2-steel">
                          {project.category.title}
                        </p>
                      )}
                      <h2 className="text-h5 mt-1 group-hover:underline">
                        {project.title}
                      </h2>
                      {project.summary && (
                        <p className="text-body mt-1 line-clamp-2 text-s2-slate">
                          {project.summary}
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
