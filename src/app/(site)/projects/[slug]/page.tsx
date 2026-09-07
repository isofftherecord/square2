import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { type ProjectSummary } from "@/components/project-index";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { projectsQuery } from "@/sanity/lib/queries";

import { ProjectCaseStudyPage } from "./case-study-page";

export const revalidate = 60;

const getProjects = cache(async () => {
  if (!isSanityConfigured) return [] as ProjectSummary[];
  return client.fetch<ProjectSummary[]>(projectsQuery);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.slug === slug);
  return {
    title: project ? `${project.title} — Square2` : "Project — Square2",
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSanityConfigured) notFound();

  const { slug } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];

  if (!project) notFound();

  const next = projects[index + 1];

  return (
    <ProjectCaseStudyPage
      project={project}
      nextProject={next ? { slug: next.slug, title: next.title } : null}
    />
  );
}
