import type { Metadata } from "next";

import { type ProjectSummary } from "@/components/project-index";
import { PortfolioView } from "@/components/portfolio-view";
import { isSanityConfigured } from "@/sanity/env";
import { fetchPublished } from "@/sanity/lib/live";
import { projectsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Portfolio — Square2",
};

async function getProjects() {
  if (!isSanityConfigured) return [] as ProjectSummary[];
  return fetchPublished<ProjectSummary[]>(projectsQuery);
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <PortfolioView projects={projects} sanityConfigured={isSanityConfigured} />
  );
}
