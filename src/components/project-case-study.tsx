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

function hasExitContent(exit?: ProjectExit) {
  return (
    present(exit?.heading) ||
    hasExitSide(exit?.acquired) ||
    hasExitSide(exit?.sold) ||
    filledMetrics(exit?.metrics).length > 0
  );
}

// Chrome trata la rueda vertical como scroll X si el riel solo desborda en horizontal.
// Ese gesto se lo devolvemos a la página; el proyecto solo se recorre en horizontal.
function useVerticalPageScroll(scrollerRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.shiftKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      event.preventDefault();
      const pixels =
        event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      window.scrollBy({ top: pixels, left: 0, behavior: "instant" });
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
  }, [scrollerRef]);
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
  useVerticalPageScroll(scrollerRef);

  const chapters = useMemo(
    () => (project.chapters ?? []).filter(hasChapter),
    [project.chapters],
  );
  const credits = useMemo(
    () => filledCredits(project.credits),
    [project.credits],
  );
  const showExit = hasExitContent(project.exit) || credits.length > 0;

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
      className="flex h-full flex-col bg-background text-foreground"
    >
      <header className="relative shrink-0 bg-s2-fog">
        <div className="s2-page items-center py-5">
          <p className="text-navigation col-span-3 col-start-2">
            {project.title}
          </p>
          {headerLine ? (
            <p className="text-navigation col-span-6 col-start-5 justify-self-center">
              {headerLine}
            </p>
          ) : null}
          <button
            type="button"
            aria-label="Close project"
            onClick={onClose}
            className="col-start-12 flex size-8 items-center cursor-pointer justify-center justify-self-end bg-s2-orange text-s2-white"
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
          className="absolute bottom-0 left-[calc(50%-50vw)] h-px w-screen max-w-[100vw] bg-s2-steel"
        />
      </header>

      <div
        ref={scrollerRef}
        onScroll={syncPanel}
        className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex h-full">
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
              credits={credits}
              nextProject={nextProject}
              onOpenNext={onOpenNext}
            />
          ) : null}
        </div>
      </div>

      <footer className="relative shrink-0 bg-s2-fog">
        <div
          aria-hidden
          className="absolute top-0 left-[calc(50%-50vw)] h-px w-screen max-w-[100vw] bg-s2-steel"
        />
        <div className="s2-page items-end py-5">
          <div className="col-span-4 col-start-2">
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
            <p className="text-navigation col-span-2 col-start-11 inline-flex items-center justify-self-end gap-1.5">
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
    <section className="s2-page h-full w-screen shrink-0 items-center">
      <div className="col-span-7 col-start-2">
        <h2 className="text-h1">{project.title}</h2>
        {addressLines.length > 0 ? (
          <p className="text-body mt-6">
            {addressLines.map((line, index) => (
              <span key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        ) : null}

        {facts.length > 0 ? (
          <dl className="mt-16 border-t-2 border-s2-black">
            {facts.map((row) => (
              <div
                key={row.label}
                className="flex border-b border-s2-steel/40 py-4"
              >
                <dt className="text-micro w-32 shrink-0 text-s2-steel">
                  {row.label}
                </dt>
                <dd className="text-metrics">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {dealMetrics.length > 0 ? (
        <div className="relative col-span-3 col-start-10 h-full">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 z-[1] w-px bg-s2-steel"
          />
          <div className="flex h-full flex-col justify-center bg-s2-fog pl-8">
            <h3 className="text-metrics">
              {present(project.dealHeading) ? project.dealHeading : "The Deal."}
            </h3>
            <div aria-hidden className="mt-2 h-px w-16 bg-s2-black" />
            <dl className="mt-8 space-y-7">
              {dealMetrics.map((metric, index) => (
                <div key={metric._key || index}>
                  <dt className="text-h2">{metric.value}</dt>
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
    <section className="s2-page h-full w-screen shrink-0 content-start overflow-hidden py-20">
      {showFigure ? (
        <ChapterFigure
          chapter={chapter}
          slides={slides}
          fallbackAlt={fallbackAlt}
          wide={!showText}
        />
      ) : null}

      {showText ? (
        <div
          className={
            showFigure ? "col-start-8 col-span-4" : "col-start-2 col-span-8"
          }
        >
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
    <figure className={wide ? "col-start-2 col-span-10" : "col-start-2 col-span-5"}>
      {showCompare && before && after ? (
        <BeforeAfterSlider
          before={{
            src: urlFor(before).width(1200).height(900).url(),
            alt: before.alt ?? fallbackAlt,
          }}
          after={{
            src: urlFor(after).width(1200).height(900).url(),
            alt: after.alt ?? fallbackAlt,
          }}
          sizes={wide ? "1200px" : "580px"}
        />
      ) : (
        <div className="relative aspect-[4/3]">
          <Image
            src={urlFor(active).width(1200).height(900).url()}
            alt={active.alt ?? fallbackAlt}
            fill
            sizes={wide ? "1200px" : "580px"}
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
        <div className="ml-auto flex w-[230px] items-center justify-between bg-s2-black px-4 py-3 text-s2-white">
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
  credits,
  nextProject,
  onOpenNext,
}: {
  exit?: ProjectExit;
  credits: ProjectCredit[];
  nextProject?: Pick<ProjectSummary, "slug" | "title"> | null;
  onOpenNext?: () => void;
}) {
  const acquired = hasExitSide(exit?.acquired) ? exit!.acquired : null;
  const sold = hasExitSide(exit?.sold) ? exit!.sold : null;
  const metrics = filledMetrics(exit?.metrics);
  const showStory = Boolean(acquired || sold || metrics.length > 0);
  const heading = present(exit?.heading)
    ? exit!.heading
    : showStory
      ? "The exit."
      : null;

  return (
    <section className="s2-page h-full w-screen shrink-0 overflow-hidden">
      {credits.length > 0 ? (
        <div
          aria-hidden
          className="relative col-start-8 col-span-5 row-start-1 h-full"
        >
          <div className="absolute inset-0 bg-s2-fog" />
        
        
        </div>
      ) : null}

      {showStory ? (
        <div className="col-start-2 col-span-6 row-start-1 max-w-[630px] py-16">
          {heading ? (
            <h2 className="text-metrics border-b border-s2-black pb-4">{heading}</h2>
          ) : null}

          {acquired || sold ? (
            <div className="mt-12 flex items-end justify-between gap-x-12">
              {acquired ? (
                <ExitSideBlock side={acquired} variant="acquired" />
              ) : null}
              {sold ? <ExitSideBlock side={sold} variant="sold" /> : null}
            </div>
          ) : null}

          {metrics.length > 0 ? (
            <dl className="mt-16 flex justify-between border-t border-s2-black pt-3">
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
        </div>
      ) : null}

      {credits.length > 0 ? (
        <div
          className={`relative row-start-1 flex h-full flex-col py-16 max-w-[400px] ${
            showStory ? "col-start-9 col-span-4" : "col-start-2 col-span-4"
          }`}
        >
          <h2 className="text-metrics border-b border-s2-black pb-4">Credits.</h2>
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
                    className={`text-body ${present(credit.label) ? "mt-1" : ""}`}
                  >
                    {credit.detail}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
          {nextProject && onOpenNext ? (
            <button
              type="button"
              onClick={onOpenNext}
              className=" cursor-pointer text-data mt-auto inline-flex items-center gap-1.5 self-end bg-s2-black px-5 py-4 text-s2-steel"
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
}: {
  side: ProjectExitSide;
  variant: "acquired" | "sold";
}) {
  const details = filledDetails(side.details);

  return (
    <div>
      {variant === "acquired" ? (
        <div className="h-[90px] w-[200px] bg-s2-black" />
      ) : (
        <div className="relative flex h-[146px] w-[200px] items-center justify-center bg-s2-orange">
          <img
            src="/icons/s2-mark.svg"
            alt=""
            width={146}
            height={146}
            className="size-[146px]"
          />
        </div>
      )}
      {present(side.value) ? <p className="text-h1 mt-8">{side.value}</p> : null}
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
