"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/button";
import { ProjectCaseStudy } from "@/components/project-case-study";
import type { ProjectSummary } from "@/components/project-index";
import { roleBadgeClass } from "@/lib/project-role";
import { hasImageAsset, urlFor } from "@/sanity/lib/image";

// Centra el case study en el área libre bajo el navbar fijo.
function scrollCaseStudyIntoView(
  panel: HTMLElement,
  inner: HTMLElement | null,
) {
  const nav = document.querySelector<HTMLElement>('nav[aria-label="Main"]');
  const topClearance = (nav?.getBoundingClientRect().bottom ?? 100) + 24;
  const height = inner?.offsetHeight ?? panel.offsetHeight;
  const absoluteTop = panel.getBoundingClientRect().top + window.scrollY;
  const extra = Math.max(0, window.innerHeight - topClearance - 24 - height);

  window.scrollTo({
    top: Math.max(0, absoluteTop - topClearance - extra / 2),
    behavior: "smooth",
  });
}

function projectImageSrc(image?: ProjectSummary["mainImage"]) {
  if (!hasImageAsset(image)) return null;
  return urlFor(image).width(600).height(600).url();
}

function useExpand(open: boolean) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [render, setRender] = useState(open);
  const [height, setHeight] = useState(open ? "auto" : "0px");
  const skipIntro = useRef(open);

  const measure = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    setHeight(`${el.getBoundingClientRect().height}px`);
  }, []);

  useEffect(() => {
    if (skipIntro.current) {
      skipIntro.current = false;
      setRender(open);
      if (open) {
        const frame = requestAnimationFrame(() => measure());
        return () => cancelAnimationFrame(frame);
      }
      setHeight("0px");
      return;
    }

    if (open) {
      setRender(true);
      setHeight("0px");
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(measure);
      });
      return () => cancelAnimationFrame(frame);
    }

    setHeight("0px");
    const timer = window.setTimeout(() => setRender(false), 500);
    return () => window.clearTimeout(timer);
  }, [open, measure]);

  useEffect(() => {
    if (!open || !render) return;
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, render, measure]);

  return { render, height, innerRef };
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
    const panel = panelRef.current;
    if (!panel) return;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      scrollCaseStudyIntoView(panel, expand.innerRef.current);
    };

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName === "height") reveal();
    };
    panel.addEventListener("transitionend", onEnd);
    const fallback = window.setTimeout(reveal, 520);
    return () => {
      panel.removeEventListener("transitionend", onEnd);
      window.clearTimeout(fallback);
    };
  }, [isOpen]);

  return (
    <article id={`project-${project.slug}`} className="s2-subgrid">
      {!isOpen ? (
        <div className="relative col-span-12 max-lg:py-10 lg:-mx-[var(--s2-margin)] lg:grid lg:h-[var(--s2-ledger-row)] lg:grid-cols-[427fr_520fr_40fr_453fr]">
          <button
            type="button"
            aria-expanded={false}
            aria-controls={`case-${project.slug}`}
            onClick={onToggle}
            className="absolute inset-0 z-10 cursor-pointer"
          >
            <span className="sr-only">Open {project.title}</span>
          </button>

          {/* Celda 1 (427): fog y regla solo hasta el alto del texto */}
          <div className="relative lg:pt-[84px] lg:pl-[clamp(92px,9.0278vw,130px)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden lg:block"
            >
              <div className="absolute inset-x-0 top-0 h-[var(--s2-ledger-head)] bg-s2-fog" />
              <div className="absolute inset-x-0 top-[var(--s2-ledger-head)] h-[0.5px] bg-s2-steel" />
              <div className="absolute inset-y-0 right-0 w-px bg-s2-steel" />
            </div>

            <div className="relative">
              <h3 className="text-h4 text-s2-black">{project.title}</h3>
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
              {project.role ? (
                <span
                  className={`text-tags mt-5 inline-block px-3 py-1.5 text-s2-white ${
                    roleBadgeClass(project.role)
                  }`}
                >
                  {project.role}
                </span>
              ) : null}
            </div>
          </div>

          {/* Celda 2 (520): cuadrada, con la foto de 400 centrada */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-s2-steel lg:block"
            />

            <div className="relative mx-auto mt-8 aspect-square w-full max-w-[600px] lg:mt-[61px] lg:size-[clamp(360px,27.7778vw,400px)]">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={alt}
                  fill
                  sizes="(min-width: 1440px) 400px, (min-width: 1296px) 27.78vw, (min-width: 1024px) 360px, 100vw"
                  className="object-cover object-center"
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
          </div>

          {/* Celda 3 (40): solo separa la foto de la franja de Details */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-s2-steel lg:block"
            />
          </div>

          {/* Celda 4 (453): fog y regla solo en la franja de Details */}
          <div className="relative lg:flex lg:h-full lg:flex-col lg:justify-end">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden lg:block"
            >
              <div className="absolute inset-x-0 bottom-0 h-[var(--s2-ledger-foot)] bg-s2-fog" />
              <div className="absolute inset-x-0 bottom-[var(--s2-ledger-foot)] h-px bg-s2-steel" />
            </div>

            <div className="relative mt-6 lg:mt-0 lg:flex lg:h-[var(--s2-ledger-foot)] lg:items-center lg:pl-[var(--s2-gutter)]">
              <Button
                type="button"
                variant="text"
                onClick={onToggle}
                className="relative z-20 text-navigation"
              >
                Details
              </Button>
            </div>
          </div>

          {/* Reglas de fila a todo el canvas; la de arriba solo en la primera */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden lg:block"
          >
            {isFirst ? (
              <div className="absolute inset-x-0 top-0 h-px bg-s2-steel" />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 h-px bg-s2-steel" />
          </div>
        </div>
      ) : null}

      <div
        ref={panelRef}
        id={`case-${project.slug}`}
        className="s2-hero overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none"
        style={{ height: expand.height }}
        aria-hidden={!isOpen}
      >
        <div ref={expand.innerRef} className="lg:h-[var(--s2-case-study)]">
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
    <section className="s2-subgrid pb-16 lg:pb-30">
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
