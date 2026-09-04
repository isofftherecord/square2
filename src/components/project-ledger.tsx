"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/button";
import { ProjectCaseStudy } from "@/components/project-case-study";
import type { ProjectSummary } from "@/components/project-index";
import { hasImageAsset, urlFor } from "@/sanity/lib/image";

function projectImageSrc(image?: ProjectSummary["mainImage"]) {
  if (!hasImageAsset(image)) return null;
  return urlFor(image).width(800).height(800).url();
}

function useExpand(open: boolean) {
  const [render, setRender] = useState(open);
  const [height, setHeight] = useState(open ? "100dvh" : "0px");
  const skipIntro = useRef(open);

  useEffect(() => {
    if (skipIntro.current) {
      skipIntro.current = false;
      setRender(open);
      setHeight(open ? "100dvh" : "0px");
      return;
    }

    if (open) {
      setRender(true);
      setHeight("0px");
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight("100dvh"));
      });
      return () => cancelAnimationFrame(frame);
    }

    setHeight("0px");
    const timer = window.setTimeout(() => setRender(false), 500);
    return () => window.clearTimeout(timer);
  }, [open]);

  return { render, height };
}

function LedgerRow({
  project,
  nextProject,
  isFirst,
  isOpen,
  onToggle,
  onOpen,
}: {
  project: ProjectSummary;
  nextProject?: ProjectSummary | null;
  isFirst: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onOpen: (slug: string) => void;
}) {
  const expand = useExpand(isOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const imageSrc = projectImageSrc(project.mainImage);
  const alt =
    project.mainImage?.alt ??
    [project.title, project.market].filter(Boolean).join(", ");

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  return (
    <article id={`project-${project.slug}`} className="s2-subgrid">
      <div
        className={`s2-subgrid relative ${isOpen ? "items-start py-6" : "items-start max-lg:py-16 lg:h-[520px]"}`}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`case-${project.slug}`}
          onClick={onToggle}
          className="absolute inset-0 z-10 cursor-pointer"
        >
          <span className="sr-only">
            {isOpen ? "Close" : "Open"} {project.title}
          </span>
        </button>

        {!isOpen ? (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {isFirst ? (
              <div className="absolute top-0 left-[calc(50%-50vw)] h-px w-screen max-w-[100vw] bg-s2-steel/40" />
            ) : null}
            <div className="absolute bottom-0 left-[calc(50%-50vw)] h-px w-screen max-w-[100vw] bg-s2-steel/40" />
          </div>
        ) : null}

        <div
          className={`relative z-[1] col-span-12 lg:col-span-3 lg:col-start-2 ${isOpen ? "" : "lg:pt-16 lg:pb-12"}`}
        >
          {!isOpen ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
            >
              {/* Celda fog: cruza el gutter para unirse a la vertical de la foto */}
              <div className="absolute inset-y-0 left-[calc(50%-50vw)] right-[calc(var(--s2-gutter)*-1-1px)] bg-s2-fog" />
              <div className="absolute right-[calc(var(--s2-gutter)*-1-1px)] bottom-0 left-[calc(50%-50vw)] h-px bg-s2-steel/40" />
            </div>
          ) : null}

          <h3 className="text-h4 text-s2-black">{project.title}</h3>

          {!isOpen ? (
            <div className="mt-6">
              {project.market ? (
                <p className="text-data text-s2-black">{project.market}</p>
              ) : null}
              {project.assetClass ? (
                <p className="text-data text-s2-black">{project.assetClass}</p>
              ) : null}
              {project.years ? (
                <p className="text-data text-s2-black">{project.years}</p>
              ) : null}
            </div>
          ) : null}

          {project.role ? (
            <span
              className={`text-tags mt-5 inline-block px-3 py-1 text-s2-white ${
                project.role === "Managed" ? "bg-s2-black" : "bg-s2-orange"
              }`}
            >
              {project.role}
            </span>
          ) : null}
        </div>

        {!isOpen ? (
          <div className="relative col-span-12 mt-8 aspect-square self-center lg:col-span-4 lg:col-start-5 lg:mt-0">
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-0 hidden h-[520px] w-px -translate-y-1/2 bg-s2-steel/40 lg:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-0 hidden h-[520px] w-px -translate-y-1/2 bg-s2-steel/40 lg:block"
            />
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 400px, 100vw"
                className="object-cover object-center p-12"
              />
            ) : (
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 0 L100 100 M100 0 L0 100"
                  fill="none"
                  stroke="currentColor"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
          </div>
        ) : null}

        {!isOpen ? (
          <div className="relative z-20 col-span-12 mt-8 self-end lg:col-span-3 lg:col-start-9 lg:mt-0 lg:pb-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
            >
              {/* Cruza el gutter para unirse a la vertical de la foto */}
              <div className="absolute inset-0 left-[calc(var(--s2-gutter)*-1-1px)] right-[calc(50%-50vw)] bg-s2-fog" />
              <div className="absolute top-0 left-[calc(var(--s2-gutter)*-1-1px)] right-[calc(50%-50vw)] h-px bg-s2-steel/40" />
            </div>
            <Button
              type="button"
              variant="text"
              onClick={onToggle}
              className="mt-5 text-navigation"
            >
              Details
            </Button>
          </div>
        ) : null}
      </div>

      <div
        ref={panelRef}
        id={`case-${project.slug}`}
        className="col-span-12 ml-[calc(50%-50vw)] w-screen max-w-[100vw] overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none"
        style={{ height: expand.height }}
        aria-hidden={!isOpen}
      >
        <div className="h-[100dvh]">
          {expand.render ? (
            <ProjectCaseStudy
              project={project}
              nextProject={
                nextProject
                  ? { slug: nextProject.slug, title: nextProject.title }
                  : null
              }
              onClose={onToggle}
              onOpenNext={
                nextProject ? () => onOpen(nextProject.slug) : undefined
              }
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProjectLedger({ projects }: { projects: ProjectSummary[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const setOpen = useCallback((slug: string | null) => {
    setOpenSlug(slug);
    const url = slug
      ? `${window.location.pathname}#${slug}`
      : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, []);

  useEffect(() => {
    if (openSlug && !projects.some((project) => project.slug === openSlug)) {
      setOpenSlug(null);
    }
  }, [openSlug, projects]);

  useEffect(() => {
    const fromHash = window.location.hash.replace(/^#/, "");
    if (fromHash && projects.some((project) => project.slug === fromHash)) {
      setOpenSlug(fromHash);
    }

    const onHash = () => {
      const slug = window.location.hash.replace(/^#/, "");
      setOpenSlug(slug || null);
    };

    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [projects]);

  return (
    <section className="s2-subgrid pb-30">
      {projects.map((project, index) => (
        <LedgerRow
          key={project._id}
          project={project}
          nextProject={projects[index + 1] ?? null}
          isFirst={index === 0}
          isOpen={openSlug === project.slug}
          onToggle={() =>
            setOpen(openSlug === project.slug ? null : project.slug)
          }
          onOpen={(slug) => setOpen(slug)}
        />
      ))}
    </section>
  );
}
