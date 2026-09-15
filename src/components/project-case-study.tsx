"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Arrow } from "@/components/arrow";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import type {
  ProjectChapter,
  ProjectCredit,
  ProjectExit,
  ProjectExitSide,
  ProjectGalleryItem,
  ProjectImage,
  ProjectMetric,
  ProjectSummary,
} from "@/components/project-index";
import { hasImageAsset, urlFor } from "@/sanity/lib/image";

function present(value?: string | null) {
  return Boolean(value && value.trim());
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function filledMetrics(metrics?: ProjectMetric[]) {
  return (metrics ?? []).filter((metric) => present(metric.value));
}

function filledParagraphs(chapter: ProjectChapter) {
  return (chapter.paragraphs ?? []).filter((paragraph) =>
    present(paragraph.text),
  );
}

function filledCredits(credits?: ProjectCredit[]) {
  return (credits ?? []).filter(
    (credit) => present(credit.label) || present(credit.detail),
  );
}

function filledDetails(details?: string[]) {
  return (details ?? []).filter((line) => present(line));
}

type ChapterSlide = {
  after?: ProjectImage;
  before?: ProjectImage;
};

function galleryAfter(item: ProjectGalleryItem) {
  if (hasImageAsset(item.image)) return item.image;
  // Ítems viejos: la extra era una imagen suelta, no un objeto After/Before.
  if (hasImageAsset(item)) return item;
  return undefined;
}

function chapterSlides(chapter: ProjectChapter) {
  const slides: ChapterSlide[] = [];
  const mainAfter = hasImageAsset(chapter.image) ? chapter.image : undefined;
  const mainBefore = hasImageAsset(chapter.beforeImage)
    ? chapter.beforeImage
    : undefined;

  if (mainAfter || mainBefore) {
    slides.push({ after: mainAfter, before: mainBefore });
  }

  for (const item of chapter.gallery ?? []) {
    const after = galleryAfter(item);
    const before = hasImageAsset(item.beforeImage)
      ? item.beforeImage
      : undefined;
    // Cada extra es un slide propio, aunque reutilice el After del capítulo.
    if (!after && !before) continue;
    slides.push({ after, before });
  }

  return slides;
}

function slideImage(slide: ChapterSlide) {
  return slide.after ?? slide.before;
}

function hasChapter(chapter: ProjectChapter) {
  return (
    present(chapter.heading) ||
    filledParagraphs(chapter).length > 0 ||
    chapterSlides(chapter).length > 0
  );
}

function hasExitSide(side?: ProjectExitSide) {
  return (
    present(side?.value) ||
    present(side?.line) ||
    filledDetails(side?.details).length > 0
  );
}

// Alturas Figma: sold $145.5M → 146px; acquired $90M → ~90px (proporcional).
const EXIT_BAR_MAX_HEIGHT = 146;
const EXIT_BAR_WIDTH = 200;

function parseMoneyValue(value?: string) {
  if (!present(value)) return null;
  const match = value!.trim().match(/([\d,.]+)\s*([KMB])?/i);
  if (!match) return null;
  const amount = Number.parseFloat(match[1].replace(/,/g, ""));
  if (Number.isNaN(amount)) return null;
  const suffix = match[2]?.toUpperCase();
  const multiplier =
    suffix === "K" ? 1e3 : suffix === "M" ? 1e6 : suffix === "B" ? 1e9 : 1;
  return amount * multiplier;
}

function exitBarHeight(value?: string, peerValue?: string) {
  const amount = parseMoneyValue(value);
  const peer = parseMoneyValue(peerValue);
  if (amount == null || amount <= 0) return EXIT_BAR_MAX_HEIGHT;
  const max = Math.max(amount, peer ?? amount);
  if (max <= 0) return EXIT_BAR_MAX_HEIGHT;
  return Math.max(1, Math.round((amount / max) * EXIT_BAR_MAX_HEIGHT));
}

function hasExitContent(exit?: ProjectExit) {
  return (
    present(exit?.heading) ||
    hasExitSide(exit?.acquired) ||
    hasExitSide(exit?.sold) ||
    filledMetrics(exit?.metrics).length > 0 ||
    present(exit?.proceedsNote)
  );
}

function navClearance() {
  const nav = document.querySelector<HTMLElement>('nav[aria-label="Main"]');
  return (nav?.getBoundingClientRect().bottom ?? 0) + 16;
}

function caseStudyFrame(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const topMin = navClearance();
  const slack = 2;
  return {
    topHidden: rect.top < topMin - slack,
    bottomHidden: rect.bottom > window.innerHeight + slack,
    fits: rect.height <= window.innerHeight - topMin + slack * 2,
  };
}

// La rueda recorre paneles solo cuando el case study cabe entero en pantalla.
// Si aún se corta, el gesto baja o sube la página hasta revelarlo.
function useCaseStudyWheel(
  scrollerRef: RefObject<HTMLDivElement | null>,
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onWheel = (event: WheelEvent) => {
      if (!desktop.matches) return;
      if (event.ctrlKey || event.shiftKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const pixels =
        event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      if (pixels === 0) return;

      const frame = caseStudyFrame(rootRef.current ?? scroller);
      const fullyVisible = !frame.topHidden && !frame.bottomHidden;
      const revealing =
        !fullyVisible &&
        (frame.fits ||
          (pixels > 0 && frame.bottomHidden) ||
          (pixels < 0 && frame.topHidden));

      if (revealing) {
        event.preventDefault();
        window.scrollBy({ top: pixels, left: 0, behavior: "instant" });
        return;
      }

      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const atStart = scroller.scrollLeft <= 0 && pixels < 0;
      const atEnd = scroller.scrollLeft >= max - 1 && pixels > 0;

      event.preventDefault();
      if (atStart || atEnd) {
        window.scrollBy({ top: pixels, left: 0, behavior: "instant" });
        return;
      }

      scroller.scrollLeft = Math.min(
        max,
        Math.max(0, scroller.scrollLeft + pixels),
      );
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
  }, [scrollerRef, rootRef]);
}

type ProjectCaseStudyProps = {
  project: ProjectSummary;
  nextProject?: Pick<ProjectSummary, "slug" | "title"> | null;
  onClose: () => void;
  onOpenNext?: () => void;
};

export function ProjectCaseStudy({
  project,
  nextProject,
  onClose,
  onOpenNext,
}: ProjectCaseStudyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState(0);
  const [progress, setProgress] = useState(0);
  useCaseStudyWheel(scrollerRef, rootRef);

  const chapters = useMemo(
    () => (project.chapters ?? []).filter(hasChapter),
    [project.chapters],
  );
  const credits = useMemo(
    () => filledCredits(project.credits),
    [project.credits],
  );
  const creditsIntro = present(project.creditsIntro)
    ? project.creditsIntro!.trim()
    : null;
  const showExit =
    hasExitContent(project.exit) || credits.length > 0 || Boolean(creditsIntro);

  const panelCount = 1 + chapters.length + (showExit ? 1 : 0);

  const syncPanel = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    setPanel(
      Math.min(panelCount - 1, Math.max(0, Math.round(el.scrollLeft / width))),
    );
    // La barra arranca en 1/N (slide visible) y crece con el scroll.
    const seen = el.scrollLeft + el.clientWidth;
    setProgress(el.scrollWidth > 0 ? seen / el.scrollWidth : 0);
  }, [panelCount]);

  useEffect(() => {
    syncPanel();
  }, [syncPanel]);

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
    setPanel(0);
    setProgress(0);
  }, [project.slug]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const headerLine = [project.role, project.status, project.years]
    .filter((part) => present(part))
    .join(" · ");

  return (
    <div
      ref={rootRef}
      data-case-study={project.slug}
      className="s2-case-study @container flex h-auto flex-col bg-background text-foreground lg:h-full"
    >
      <header className="relative shrink-0 bg-s2-fog">
        {/* Inset izq. 96px (Figma); close cerca del borde derecho. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4 pl-[var(--s2-case-inset)] pr-4 max-lg:px-[var(--s2-margin)] lg:py-5">
          <p className="text-navigation min-w-0 flex-1 truncate lg:flex-none lg:max-w-[280px]">
            {project.title}
          </p>
          {headerLine ? (
            <p className="text-navigation order-last w-full lg:absolute lg:left-1/2 lg:order-none lg:w-auto lg:-translate-x-1/2">
              {headerLine}
            </p>
          ) : null}
          <button
            type="button"
            aria-label="Close project"
            onClick={onClose}
            className="ml-auto flex size-8 shrink-0 cursor-pointer items-center justify-center bg-s2-orange text-s2-white"
          >
       
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" className="size-3" aria-hidden="true">
<rect x="11.375" width="1.625" height="1.625" fill="white"/>
<rect width="1.625" height="1.625" fill="white"/>
<rect x="9.75" y="1.625" width="1.625" height="1.625" fill="white"/>
<rect x="1.625" y="1.625" width="1.625" height="1.625" fill="white"/>
<rect x="8.125" y="3.25" width="1.625" height="1.625" fill="white"/>
<rect x="3.25" y="3.25" width="1.625" height="1.625" fill="white"/>
<rect x="6.5" y="4.875" width="1.625" height="1.625" fill="white"/>
<rect x="4.875" y="4.875" width="1.625" height="1.625" fill="white"/>
<rect x="4.875" y="6.5" width="1.625" height="1.625" fill="white"/>
<rect x="6.5" y="6.5" width="1.625" height="1.625" fill="white"/>
<rect x="8.125" y="8.125" width="1.625" height="1.625" fill="white"/>
<rect x="3.25" y="8.125" width="1.625" height="1.625" fill="white"/>
<rect x="9.75" y="9.75" width="1.625" height="1.625" fill="white"/>
<rect x="1.625" y="9.75" width="1.625" height="1.625" fill="white"/>
<rect x="11.375" y="11.375" width="1.625" height="1.625" fill="white"/>
<rect y="11.375" width="1.625" height="1.625" fill="white"/>
</svg>
           
          </button>
        </div>
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-s2-steel"
        />
      </header>

      <div
        ref={scrollerRef}
        onScroll={syncPanel}
        className="min-h-0 flex-1 max-lg:overflow-visible lg:overflow-x-auto lg:overflow-y-hidden lg:overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex h-auto max-lg:flex-col lg:h-full">
          <CoverPanel project={project} />

          {chapters.map((chapter, index) => (
            <ChapterPanel
              key={chapter._key || index}
              chapter={chapter}
              fallbackAlt={project.title}
            />
          ))}

          {showExit ? (
            <ExitPanel
              exit={project.exit}
              creditsIntro={creditsIntro}
              credits={credits}
              nextProject={nextProject}
              onOpenNext={onOpenNext}
            />
          ) : null}
        </div>
      </div>

      <footer className="relative hidden shrink-0 bg-s2-fog lg:block">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-s2-steel"
        />
        <div className="flex items-end justify-between px-[var(--s2-case-inset)] py-5">
          <div className="w-[min(196px,14%)]">
            <p className="text-navigation">
              {pad(panel + 1)} / {pad(panelCount)}
            </p>
            <div
              className="mt-3 h-px bg-s2-steel"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label="Case study progress"
            >
              <div
                className="h-0.5 -translate-y-px bg-s2-black"
                style={{ width: `${Math.max(progress, 1 / Math.max(panelCount, 1)) * 100}%` }}
              />
            </div>
          </div>
          {panelCount > 1 && panel < panelCount - 1 ? (
            <p className="text-navigation inline-flex items-center gap-1.5">
              Scroll
              <img
                src="/icons/arrow-right.svg"
                alt=""
                width={10}
                height={9}
                className="shrink-0"
              />
            </p>
          ) : null}
        </div>
      </footer>
    </div>
  );
}

function CoverPanel({ project }: { project: ProjectSummary }) {
  const facts = [
    present(project.owner) ? { label: "Owner", value: project.owner! } : null,
    present(project.assetClass)
      ? { label: "Class", value: project.assetClass! }
      : null,
    present(project.role) ? { label: "Role", value: project.role! } : null,
    present(project.status)
      ? { label: "Status", value: project.status! }
      : null,
    present(project.market)
      ? { label: "Market", value: project.market! }
      : null,
  ].filter((row): row is { label: string; value: string } => row != null);

  const dealMetrics = filledMetrics(project.dealMetrics);
  const addressLines = present(project.address)
    ? project.address!.split("\n").filter((line) => present(line))
    : [];

  return (
    <section className="relative h-auto w-full shrink-0 py-10 max-lg:px-[var(--s2-margin)] lg:flex lg:h-full lg:w-[100cqw] lg:items-center lg:py-0">
      <div
        className={`w-full lg:pl-[var(--s2-case-inset)] ${
          dealMetrics.length > 0
            ? "lg:pr-[calc(var(--s2-case-deal)+var(--s2-case-deal-gap))]"
            : "lg:pr-[var(--s2-case-inset)]"
        }`}
      >
        <h1 className="text-h1">{project.title}</h1>
        {addressLines.length > 0 ? (
          <p className="text-metrics mt-6">
            {addressLines.map((line, index) => (
              <span key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        ) : null}

        {facts.length > 0 ? (
          <dl className="mt-10 border-t-2 border-s2-black lg:mt-16">
            {facts.map((row) => (
              <div
                key={row.label}
                className="flex border-b border-s2-steel/40 py-4"
              >
                <dt className="text-data w-32 shrink-0 text-s2-steel">
                  {row.label}
                </dt>
                <dd className="text-body">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {dealMetrics.length > 0 ? (
        <div className="relative mt-8 max-lg:-mx-[var(--s2-margin)] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[var(--s2-case-deal)]">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 z-[1] hidden w-px bg-s2-steel lg:block"
          />
          <div className="flex flex-col justify-top bg-s2-fog px-6 pt-20 pb-8 lg:h-full lg:px-0 lg:pl-[var(--s2-case-deal-pad)]">
            <h3 className="text-metrics">
              {present(project.dealHeading) ? project.dealHeading : "The Deal."}
            </h3>
            <div aria-hidden className="mt-2 h-px w-[168px] bg-s2-black" />
            <dl className="mt-8 space-y-7">
              {dealMetrics.map((metric, index) => (
                <div key={metric._key || index}>
                  <dt className="text-h1">{metric.value}</dt>
                  {present(metric.label) ? (
                    <dd className="text-micro mt-1">{metric.label}</dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ChapterPanel({
  chapter,
  fallbackAlt,
}: {
  chapter: ProjectChapter;
  fallbackAlt: string;
}) {
  const paragraphs = filledParagraphs(chapter);
  const slides = chapterSlides(chapter);
  const showText = present(chapter.heading) || paragraphs.length > 0;
  const showFigure = slides.length > 0;

  return (
    <section className="relative h-auto w-full shrink-0 overflow-visible py-10 max-lg:px-[var(--s2-margin)] lg:h-full lg:w-[100cqw] lg:overflow-hidden lg:py-20">
      {/* Rail fog + vertical a 40px (Figma capítulos). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[var(--s2-case-rail)] bg-s2-fog lg:block"
      >
        <div className="absolute inset-y-0 right-0 w-px bg-s2-steel" />
      </div>

      {showFigure ? (
        <div
          className={
            showText
              ? "lg:absolute lg:inset-y-0 lg:left-[var(--s2-case-inset)] lg:flex lg:w-[var(--s2-case-figure)] lg:items-start lg:py-20"
              : "lg:absolute lg:inset-y-0 lg:left-[var(--s2-case-inset)] lg:right-[var(--s2-case-inset)] lg:flex lg:items-start lg:py-20"
          }
        >
          <ChapterFigure
            chapter={chapter}
            slides={slides}
            fallbackAlt={fallbackAlt}
            wide={!showText}
          />
        </div>
      ) : null}

      {showText ? (
        <div
          className={
            showFigure
              ? "mt-8 w-full lg:absolute lg:inset-y-0 lg:right-[var(--s2-case-inset)] lg:mt-0 lg:flex lg:w-[var(--s2-case-copy)] lg:items-start lg:py-20"
              : "w-full lg:absolute lg:inset-y-0 lg:left-[var(--s2-case-inset)] lg:flex lg:w-[min(940px,66%)] lg:items-start lg:py-20"
          }
        >
          <div className="w-full">
            {present(chapter.heading) ? (
              <h2 className="text-metrics border-b border-s2-black pb-4">
                {chapter.heading}
              </h2>
            ) : null}
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph._key || index}
                className={`text-body ${index === 0 && present(chapter.heading) ? "mt-8" : "mt-6"} ${paragraph.emphasis ? "font-bold" : ""}`}
              >
                {paragraph.text}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ChapterFigure({
  chapter,
  slides,
  fallbackAlt,
  wide,
}: {
  chapter: ProjectChapter;
  slides: ChapterSlide[];
  fallbackAlt: string;
  wide: boolean;
}) {
  const [index, setIndex] = useState(0);
  const current = slides[index] ?? slides[0];
  const after = current?.after;
  const before = current?.before;
  const showCompare = hasImageAsset(before) && hasImageAsset(after);
  const active = slideImage(current);
  const caption = present(chapter.caption)
    ? chapter.caption
    : present(active?.alt)
      ? active?.alt
      : null;

  if (!current || !active || !hasImageAsset(active)) return null;

  return (
    <figure className="w-full">
      {showCompare && before && after ? (
        <BeforeAfterSlider
          before={{
            src: urlFor(before)
              .width(wide ? 1200 : 1432)
              .height(wide ? 900 : 796)
              .url(),
            alt: before.alt ?? fallbackAlt,
          }}
          after={{
            src: urlFor(after)
              .width(wide ? 1200 : 1432)
              .height(wide ? 900 : 796)
              .url(),
            alt: after.alt ?? fallbackAlt,
          }}
          sizes={wide ? "(min-width: 1024px) 1200px, 100vw" : "(min-width: 1024px) 716px, 100vw"}
          className={wide ? "aspect-[4/3]" : "aspect-[716/398]"}
        />
      ) : (
        <div className={`relative ${wide ? "aspect-[4/3]" : "aspect-[716/398]"}`}>
          <Image
            src={urlFor(active)
              .width(wide ? 1200 : 1432)
              .height(wide ? 900 : 796)
              .url()}
            alt={active.alt ?? fallbackAlt}
            fill
            sizes={wide ? "(min-width: 1024px) 1200px, 100vw" : "(min-width: 1024px) 716px, 100vw"}
            className="object-cover"
          />
        </div>
      )}
      {caption ? (
        <figcaption className="text-micro bg-s2-orange px-4 py-3 text-s2-white">
          {caption}
        </figcaption>
      ) : null}
      {slides.length > 1 ? (
        <div className="ml-auto flex w-full items-center justify-between bg-s2-black px-4 py-3 text-s2-white lg:w-[230px]">
          <p className="text-body">
            {pad(index + 1)}/{pad(slides.length)}
          </p>
          <div className="flex gap-x-6">
            <button
              type="button"
              aria-label="Previous image"
              className="text-micro"
              onClick={() =>
                setIndex((current) => (current - 1 + slides.length) % slides.length)
              }
            >
               <Arrow className="rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="text-micro text-s2-orange" 
              onClick={() => setIndex((current) => (current + 1) % slides.length)}
            >
                <Arrow  />
            </button>
          </div>
        </div>
      ) : null}
    </figure>
  );
}

function ExitPanel({
  exit,
  creditsIntro,
  credits,
  nextProject,
  onOpenNext,
}: {
  exit?: ProjectExit;
  creditsIntro?: string | null;
  credits: ProjectCredit[];
  nextProject?: Pick<ProjectSummary, "slug" | "title"> | null;
  onOpenNext?: () => void;
}) {
  const acquired = hasExitSide(exit?.acquired) ? exit!.acquired : null;
  const sold = hasExitSide(exit?.sold) ? exit!.sold : null;
  const metrics = filledMetrics(exit?.metrics);
  const proceedsNote = present(exit?.proceedsNote) ? exit!.proceedsNote : null;
  const showStory = Boolean(acquired || sold || metrics.length > 0 || proceedsNote);
  const showCredits = Boolean(creditsIntro) || credits.length > 0;
  const heading = present(exit?.heading)
    ? exit!.heading
    : showStory
      ? "The exit."
      : null;

  return (
    <section className="relative h-auto w-full shrink-0 overflow-visible max-lg:px-[var(--s2-margin)] lg:h-full lg:w-[100cqw] lg:overflow-hidden">
      {/* Rail izq. 40px + fog de credits desde 867 (Figma). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[var(--s2-case-rail)] bg-s2-fog lg:block"
      >
        <div className="absolute inset-y-0 right-0 w-px bg-s2-steel" />
      </div>
      {showCredits ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-[var(--s2-case-credits-start)] right-0 hidden bg-s2-fog lg:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-[var(--s2-case-credits-start)] hidden w-px bg-s2-steel lg:block"
          />
        </>
      ) : null}

      {showStory ? (
        <div className="relative py-10 lg:absolute lg:inset-y-0 lg:left-[var(--s2-case-exit-inset)] lg:w-[min(630px,calc(var(--s2-case-credits-start)-var(--s2-case-exit-inset)-2.78%))] lg:pt-20">
          {heading ? (
            <h2 className="text-metrics border-b border-s2-black pb-4">{heading}</h2>
          ) : null}

          {acquired || sold ? (
            <div className="mt-10 flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-x-12 lg:mt-12">
              {acquired ? (
                <ExitSideBlock
                  side={acquired}
                  variant="acquired"
                  barHeight={exitBarHeight(acquired.value, sold?.value)}
                />
              ) : null}
              {sold ? (
                <ExitSideBlock
                  side={sold}
                  variant="sold"
                  barHeight={exitBarHeight(sold.value, acquired?.value)}
                />
              ) : null}
            </div>
          ) : null}

          {metrics.length > 0 ? (
            <dl className="mt-8 flex flex-col gap-6 border-t border-b border-s2-black pt-3 pb-3 sm:flex-row sm:justify-between lg:mt-10">
              {metrics.map((metric, index) => (
                <div key={metric._key || index}>
                  <dt className="text-metrics">{metric.value}</dt>
                  {present(metric.label) ? (
                    <dd className="text-micro mt-1">{metric.label}</dd>
                  ) : null}
                </div>
              ))}
            </dl>
          ) : null}

          {/* Línea + nota micro (Figma 553:1770 / 570:590). */}
          {proceedsNote ? (
            <div className={metrics.length > 0 || acquired || sold ? "mt-8" : "mt-10"}>
              <p className="text-micro mt-8 text-s2-steel">{proceedsNote}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {showCredits ? (
        <div
          className={`relative flex flex-col bg-s2-fog px-5 pt-10 pb-6 max-lg:-mx-[var(--s2-margin)] lg:absolute lg:inset-y-0 lg:bg-transparent lg:px-0 lg:pt-10 lg:pb-6 ${
            showStory
              ? "lg:left-[var(--s2-case-credits-inset)] lg:w-[var(--s2-case-credits-width)]"
              : "lg:left-[var(--s2-case-exit-inset)] lg:w-[var(--s2-case-credits-width)]"
          }`}
        >
          {creditsIntro ? (
            <p className="text-body">{creditsIntro}</p>
          ) : null}
          <h2
            className={`text-metrics border-b border-s2-black pb-4 ${
              creditsIntro ? "mt-4" : ""
            }`}
          >
            In house.
          </h2>
          {credits.length > 0 ? (
            <dl>
              {credits.map((credit, index) => (
                <div
                  key={credit._key || index}
                  className="border-b border-s2-steel py-3"
                >
                  {present(credit.label) ? (
                    <dt className="text-micro">{credit.label}</dt>
                  ) : null}
                  {present(credit.detail) ? (
                    <dd
                      className={`text-body ${present(credit.label) ? "" : ""}`}
                    >
                      {credit.detail}
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>
          ) : null}
          {nextProject && onOpenNext ? (
            <button
              type="button"
              onClick={onOpenNext}
              className="text-data mt-10 inline-flex cursor-pointer gap-x-1.5 items-center justify-center self-stretch bg-s2-black px-4 py-3 text-s2-steel lg:mt-auto lg:w-auto lg:self-end"
            >
              Next · {nextProject.title}
              <img
                src="/icons/arrow-right.svg"
                alt=""
                width={10}
                height={9}
                className="shrink-0"
              />
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function ExitSideBlock({
  side,
  variant,
  barHeight,
}: {
  side: ProjectExitSide;
  variant: "acquired" | "sold";
  barHeight: number;
}) {
  const details = filledDetails(side.details);

  return (
    <div>
      {/* Contenedor fijo para alinear bases; la barra crece con el valor. */}
      <div
        className="flex items-end"
        style={{ height: EXIT_BAR_MAX_HEIGHT, width: EXIT_BAR_WIDTH }}
      >
        <div
          className={variant === "acquired" ? "bg-s2-black" : "bg-s2-orange"}
          style={{ height: barHeight, width: EXIT_BAR_WIDTH }}
        />
      </div>
      {present(side.value) ? <p className="text-h1 mt-6">{side.value}</p> : null}
      {present(side.line) ? (
        <p className="text-micro mt-5 text-s2-steel">{side.line}</p>
      ) : null}
      {details.map((line, index) => (
        <p key={line} className={`text-body ${index === 0 ? "mt-3" : ""}`}>
          {line}
        </p>
      ))}
    </div>
  );
}
