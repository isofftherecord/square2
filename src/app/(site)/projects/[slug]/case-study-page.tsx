"use client";

import { useRouter } from "next/navigation";

import { ProjectCaseStudy } from "@/components/project-case-study";
import type { ProjectSummary } from "@/components/project-index";

export function ProjectCaseStudyPage({
  project,
  nextProject,
}: {
  project: ProjectSummary;
  nextProject?: Pick<ProjectSummary, "slug" | "title"> | null;
}) {
  const router = useRouter();

  return (
    <div className="col-span-12 ml-[calc(50%-50vw)] h-[800px] w-screen max-w-[100vw]">
      <ProjectCaseStudy
        project={project}
        nextProject={nextProject}
        onClose={() => router.push("/portfolio")}
        onOpenNext={
          nextProject
            ? () => router.push(`/projects/${nextProject.slug}`)
            : undefined
        }
      />
    </div>
  );
}
