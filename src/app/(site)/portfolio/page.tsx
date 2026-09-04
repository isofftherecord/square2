import type { Metadata } from "next";

import { type ProjectSummary } from "@/components/project-index";
import { PortfolioView } from "@/components/portfolio-view";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { projectsQuery } from "@/sanity/lib/queries";
import { hydrateLasOlas } from "@/sanity/seed/las-olas-square";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio — Square2",
};

async function getProjects() {
  if (!isSanityConfigured) return [] as ProjectSummary[];
  const projects = await client.fetch<ProjectSummary[]>(projectsQuery);
  return projects.map(hydrateLasOlas);
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <PortfolioView projects={projects} sanityConfigured={isSanityConfigured} />
  );
}
