import type { Metadata } from "next";
import Link from "next/link";

import { ProjectIndex, type ProjectSummary } from "@/components/project-index";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { projectsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio — Square2",
};

async function getProjects() {
  if (!isSanityConfigured) return [] as ProjectSummary[];
  return client.fetch<ProjectSummary[]>(projectsQuery);
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <main className="s2-subgrid">
      <div className="col-span-12 s2-subgrid pt-40">
        <h1 className="text-h1 col-span-12 mb-10 lg:col-span-10 lg:col-start-2">
          Portfolio
        </h1>
        {!isSanityConfigured ? (
          <section className="col-span-12 rounded-xl border border-s2-orange/40 bg-s2-orange/10 p-6 lg:col-span-10 lg:col-start-2">
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
              and copy your Project ID into <code>.env.local</code>. Then open{" "}
              <code>/studio</code> to add projects.
            </p>
          </section>
        ) : projects.length === 0 ? (
          <p className="text-body col-span-12 text-s2-slate lg:col-span-10 lg:col-start-2">
            No published projects yet. Add the first one from{" "}
            <Link href="/studio" className="underline">
              the content studio
            </Link>
            .
          </p>
        ) : (
          <ProjectIndex projects={projects} />
        )}
      </div>
    </main>
  );
}
