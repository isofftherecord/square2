"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/button";
import { ProjectCaseStudy } from "@/components/project-case-study";
import { filledYear, type ProjectSummary } from "@/components/project-index";
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

const OPEN_MS = 500;
const CLOSE_FADE_MS = 150;
const CLOSE_FOLD_MS = 320;
const CLOSE_MS = CLOSE_FADE_MS + CLOSE_FOLD_MS;

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const axis = (a: number, b: number, t: number) =>
    3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // Bisección: suficiente precisión para 60fps sin Newton.
    let low = 0;
    let high = 1;
    let t = x;
    for (let i = 0; i < 20; i++) {
      const value = axis(x1, x2, t);
      if (Math.abs(value - x) < 1e-4) break;
      if (value < x) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return axis(y1, y2, t);
  };
}

const easeOut = cubicBezier(0.22, 1, 0.36, 1);
const easeFold = cubicBezier(0.4, 0, 0.2, 1);

function isDesktop() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Scroll de ventana en paralelo a una transición de layout. El destino se
// recalcula cada frame porque el alto de los paneles cambia mientras tanto.
function animateScroll(
  target: () => number,
  { duration, delay = 0, ease }: {
    duration: number;
    delay?: number;
    ease: (x: number) => number;
  },
) {
  if (prefersReducedMotion()) {
    window.scrollTo({ top: target(), behavior: "instant" });
    return () => {};
  }

  let startY = 0;
  let startTime = 0;
  let frame = 0;

  const step = (now: number) => {
    if (!startTime) {
      startTime = now;
      startY = window.scrollY;
    }
    const progress = Math.min(1, (now - startTime) / duration);
    const top = startY + (target() - startY) * ease(progress);
    window.scrollTo({ top, behavior: "instant" });
    if (progress < 1) frame = requestAnimationFrame(step);
  };

  const timer = window.setTimeout(() => {
    frame = requestAnimationFrame(step);
  }, delay);

  return () => {
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
  };
}

function navClearance() {
  const nav = document.querySelector<HTMLElement>('nav[aria-label="Main"]');
  return (nav?.getBoundingClientRect().bottom ?? 100) + 24;
}

// Abrir: el borde inferior del panel termina en el borde inferior de la ventana.
function scrollWithPanel(panel: HTMLElement, finalHeight: () => number) {
  return animateScroll(
    () =>
      Math.max(
        0,
        panel.getBoundingClientRect().top +
          window.scrollY +
          finalHeight() -
          window.innerHeight,
      ),
    { duration: OPEN_MS, ease: easeOut },
  );
}

// Cerrar: la fila de la propiedad vuelve bajo el navbar mientras se pliega.
function scrollBackToRow(row: HTMLElement) {
  // Si el tope de la fila ya está bajo el navbar, la página no se mueve.
  if (row.getBoundingClientRect().top >= navClearance()) return () => {};
  return animateScroll(
    () =>
      Math.max(
        0,
        row.getBoundingClientRect().top + window.scrollY - navClearance(),
      ),
    { duration: CLOSE_FOLD_MS, delay: CLOSE_FADE_MS, ease: easeFold },
  );
}

// Ignora la rueda mientras el panel abre o cierra; captura en window para
// adelantarse al handler de scroll lateral del case study.
let wheelLockUntil = 0;

function lockWheel(ms: number) {
  wheelLockUntil = Math.max(wheelLockUntil, performance.now() + ms);
}

function onLockedWheel(event: WheelEvent) {
  if (performance.now() >= wheelLockUntil || !isDesktop()) return;
  event.preventDefault();
  event.stopPropagation();
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
    const timer = window.setTimeout(() => setRender(false), CLOSE_MS);
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
  anyOpen,
  onToggle,
  onOpen,
}: {
  project: ProjectSummary;
  nextProject?: ProjectSummary | null;
  isFirst: boolean;
  isOpen: boolean;
  anyOpen: boolean;
  onToggle: () => void;
  onOpen: (slug: string) => void;
}) {
  const expand = useExpand(isOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLButtonElement>(null);
  const imageSrc = projectImageSrc(project.mainImage);
  const alt =
    project.mainImage?.alt ??
    [project.title, project.market].filter(Boolean).join(", ");

  const wasOpen = useRef(isOpen);

  useEffect(() => {
    const changed = wasOpen.current !== isOpen;
    wasOpen.current = isOpen;
    if (!changed) return;
    lockWheel(isOpen ? OPEN_MS : CLOSE_MS);
    // Si se cerró porque se abre otro proyecto, el scroll y el foco son del nuevo.
    if (isOpen || anyOpen) return;

    const details = detailsRef.current;
    const active = document.activeElement;
    const focusIsOurs =
      !active ||
      active === document.body ||
      Boolean(details?.closest("article")?.contains(active));
    if (focusIsOurs) details?.focus({ preventScroll: isDesktop() });

    const row = rowRef.current;
    if (!row || !isDesktop()) return;
    return scrollBackToRow(row);
    // anyOpen se lee en el mismo render en que cambia isOpen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    if (isDesktop()) {
      const inner = expand.innerRef;
      return scrollWithPanel(
        panel,
        () => inner.current?.offsetHeight ?? panel.offsetHeight,
      );
    }

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

  const detailsButtonClass = `relative z-20 mt-6 justify-start text-navigation hover:opacity-100! lg:mt-0 lg:h-[var(--s2-ledger-foot)] lg:w-full lg:justify-start lg:pl-[var(--s2-gutter)] lg:transition-colors lg:duration-200 lg:ease-[cubic-bezier(0.22,1,0.36,1)] [&_img]:transition-[filter,transform] [&_img]:duration-200 [&_img]:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:[&_img]:transition-none ${
    isOpen
      ? "bg-s2-orange max-lg:h-12 max-lg:w-full max-lg:px-4 [&_img]:rotate-90 [&_img]:brightness-0"
      : "lg:bg-s2-fog lg:hover:bg-s2-orange hover:[&_img]:brightness-0"
  }`;

  return (
    <article
      id={`project-${project.slug}`}
      className="s2-subgrid max-lg:border-b max-lg:border-s2-steel"
    >
      <div
        ref={rowRef}
        className="relative col-span-12 max-lg:py-10 lg:-mx-[var(--s2-margin)] lg:grid lg:h-[var(--s2-ledger-row)] lg:grid-cols-[427fr_520fr_40fr_453fr]">
        {!isOpen ? (
          <button
            type="button"
            data-open-case=""
            aria-expanded={false}
            aria-controls={`case-${project.slug}`}
            onClick={onToggle}
            className="absolute inset-0 z-10 cursor-pointer"
          >
            <span className="sr-only">Open {project.title}</span>
          </button>
        ) : null}

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
                {filledYear(project.years) ? (
                  <p className="text-data text-s2-black">{filledYear(project.years)}</p>
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

          {/* Reglas de fila a todo el canvas; quedan sobre el fondo de Details */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 hidden lg:block"
          >
            {isFirst ? (
              <div className="absolute inset-x-0 top-0 h-px bg-s2-steel" />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 h-px bg-s2-steel" />
          </div>

        {/* Celda 4: Details pasa a Close sin desmontar el botón */}
        <div className="relative lg:flex lg:h-full lg:flex-col lg:justify-end">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[var(--s2-ledger-foot)] hidden h-px bg-s2-steel lg:block"
          />

          <Button
            ref={detailsRef}
            type="button"
            data-open-case=""
            variant="text"
            aria-expanded={isOpen}
            aria-controls={`case-${project.slug}`}
            onClick={onToggle}
            className={detailsButtonClass}
          >
            {isOpen ? "Close" : "Details"}
          </Button>
        </div>
      </div>

      <div
        ref={panelRef}
        id={`case-${project.slug}`}
        className={`s2-hero overflow-hidden transition-[height] motion-reduce:transition-none ${
          isOpen
            ? "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            : "delay-150 duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        }`}
        style={{ height: expand.height }}
        aria-hidden={!isOpen}
      >
        {/* Al cerrar, el contenido se apaga antes de que el panel se pliegue */}
        <div
          ref={expand.innerRef}
          className={`lg:h-[var(--s2-case-study)] ${
            isOpen
              ? "opacity-100"
              : "opacity-0 transition-opacity duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          }`}
        >
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

  // Next: primero se cierra el panel actual y, al terminar, se abre el siguiente.
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  const openNext = useCallback(
    (slug: string) => {
      if (pendingSlug) return;
      setPendingSlug(slug);
      setOpen(null);
    },
    [pendingSlug, setOpen],
  );

  useEffect(() => {
    if (!pendingSlug) return;
    const timer = window.setTimeout(
      () => {
        setPendingSlug(null);
        setOpen(pendingSlug);
        requestAnimationFrame(() => {
          document
            .querySelector<HTMLElement>(
              `#project-${CSS.escape(pendingSlug)} button[aria-expanded="true"]`,
            )
            ?.focus({ preventScroll: true });
        });
      },
      prefersReducedMotion() ? 0 : CLOSE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [pendingSlug, setOpen]);

  useEffect(() => {
    const options = { capture: true, passive: false } as const;
    window.addEventListener("wheel", onLockedWheel, options);
    return () => window.removeEventListener("wheel", onLockedWheel, options);
  }, []);

  useEffect(() => {
    if (openSlug && !projects.some((project) => project.slug === openSlug)) {
      setOpenSlug(null);
    }
  }, [openSlug, projects]);

  useEffect(() => {
    if (!openSlug) return;

    // Un click fuera del panel lo cierra. Abrir otro case lo reemplaza.
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const panel = document.getElementById(`case-${openSlug}`);
      if (panel?.contains(target)) return;
      if (target.closest("[data-open-case]")) return;

      setOpen(null);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [openSlug, setOpen]);

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
    <section className="s2-subgrid">
      {projects.map((project, index) => (
        <LedgerRow
          key={project._id}
          project={project}
          nextProject={projects[index + 1] ?? null}
          isFirst={index === 0}
          isOpen={openSlug === project.slug}
          anyOpen={openSlug !== null || pendingSlug !== null}
          onToggle={() => {
            setPendingSlug(null);
            setOpen(openSlug === project.slug ? null : project.slug);
          }}
          onOpen={openNext}
        />
      ))}
    </section>
  );
}
