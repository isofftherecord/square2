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

import type {
  ProjectChapter,
  ProjectCredit,
  ProjectExit,
  ProjectExitSide,
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

function assetId(image: ProjectImage) {
  const asset = image.asset as { _ref?: string; _id?: string } | undefined;
  return asset?._ref ?? asset?._id ?? "";
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

function chapterImages(chapter: ProjectChapter) {
  const seen = new Set<string>();
  const images: ProjectImage[] = [];

  for (const image of [chapter.image, ...(chapter.gallery ?? [])]) {
    if (!image || !hasImageAsset(image)) continue;
    const id = assetId(image);
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    images.push(image);
  }

  return images;
}

function hasChapter(chapter: ProjectChapter) {
  return (
    present(chapter.heading) ||
    filledParagraphs(chapter).length > 0 ||
    hasImageAsset(chapter.image) ||
    hasImageAsset(chapter.beforeImage) ||
    chapterImages(chapter).length > 0
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

function fallbackImages(project: ProjectSummary): ProjectImage[] {
  const seen = new Set<string>();
  const images: ProjectImage[] = [];

  for (const image of [project.mainImage, ...(project.gallery ?? [])]) {
    if (!image || !hasImageAsset(image)) continue;
    const id = assetId(image);
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    images.push(image);
  }

  return images;
}

// Inercia tipo BIG.dk: la rueda empuja un objetivo y el riel se acerca con lerp.
const SCROLL_EASE = 0.12;
const SCROLL_SCALE = 0.55;

function useSoftHorizontalScroll(
  scrollerRef: RefObject<HTMLDivElement | null>,
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    const root = rootRef.current;
    if (!scroller || !root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = scroller.scrollLeft;
    let current = scroller.scrollLeft;
    let raf = 0;

    const maxScroll = () =>
      Math.max(0, scroller.scrollWidth - scroller.clientWidth);

    const clamp = (value: number) => Math.min(maxScroll(), Math.max(0, value));

    const tick = () => {
      current += (target - current) * SCROLL_EASE;
      if (Math.abs(target - current) < 0.35) {
        current = target;
        scroller.scrollLeft = current;
        raf = 0;
        return;
      }
      scroller.scrollLeft = current;
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;

      // Gesto nativo horizontal (trackpad): no interferir.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        target = scroller.scrollLeft;
        current = scroller.scrollLeft;
        return;
      }

      const max = maxScroll();
      const goingRight = event.deltaY > 0;
      const goingLeft = event.deltaY < 0;
      if ((goingRight && scroller.scrollLeft >= max - 0.5) || (goingLeft && scroller.scrollLeft <= 0.5)) {
        return;
      }

      event.preventDefault();
      const pixels =
        event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      const delta = pixels * SCROLL_SCALE;

      if (reduced) {
        scroller.scrollLeft = clamp(scroller.scrollLeft + delta);
        return;
      }

      current = scroller.scrollLeft;
      target = clamp(target + delta);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rootRef, scrollerRef]);
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
  useSoftHorizontalScroll(scrollerRef, rootRef);

  const chapters = useMemo(
    () => (project.chapters ?? []).filter(hasChapter),
    [project.chapters],
  );
  const credits = useMemo(
    () => filledCredits(project.credits),
    [project.credits],
  );
  const showExit = hasExitContent(project.exit) || credits.length > 0;
  const galleryPanels =
    chapters.length === 0 ? fallbackImages(project) : [];

  const panelCount = 1 + chapters.length + galleryPanels.length + (showExit ? 1 : 0);

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
      <header className="relative shrink-0">
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
            className="col-start-12 flex size-8 items-center justify-center justify-self-end bg-s2-orange text-s2-white"
          >
            <svg viewBox="0 0 10 10" className="size-3" aria-hidden="true">
              <path
                d="M1 1 L9 9 M9 1 L1 9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
        <div
          aria-hidden
          className="absolute bottom-0 left-[calc(50%-50vw)] h-px w-screen max-w-[100vw] bg-s2-steel/40"
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

          {galleryPanels.map((image, index) => (
            <ImagePanel
              key={assetId(image) || index}
              image={image}
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

      <footer className="relative shrink-0">
        <div
          aria-hidden
          className="absolute top-0 left-[calc(50%-50vw)] h-px w-screen max-w-[100vw] bg-s2-steel/40"
        />
        <div className="s2-page items-end py-5">
          <div className="col-span-4 col-start-2">
            <p className="text-navigation">
              {pad(panel + 1)} / {pad(panelCount)}
            </p>
            <div
              className="mt-3 h-px bg-s2-steel/40"
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
          {nextProject && onOpenNext && panel === panelCount - 1 ? (
            <button
              type="button"
              onClick={onOpenNext}
              className="text-navigation col-span-3 col-start-8 justify-self-start text-left"
            >
              Next · {nextProject.title}{" "}
              <img
                src="/icons/arrow-right.svg"
                alt=""
                width={10}
                height={9}
                className="ml-1.5 inline-block"
              />
            </button>
          ) : panelCount > 1 ? (
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
            className="absolute inset-y-0 left-0 w-px bg-s2-steel/40"
          />
          <div className="flex h-full flex-col justify-center pl-8">
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
  const images = chapterImages(chapter);
  const hasBefore = hasImageAsset(chapter.beforeImage);
  const hasAfter = hasImageAsset(chapter.image) || images.length > 0;
  const showText = present(chapter.heading) || paragraphs.length > 0;
  const showFigure = hasBefore || hasAfter;

  return (
    <section className="s2-page h-full w-screen shrink-0 content-start overflow-y-auto py-20">
      {showFigure ? (
        <ChapterFigure
          chapter={chapter}
          images={images}
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
  images,
  fallbackAlt,
  wide,
}: {
  chapter: ProjectChapter;
  images: ProjectImage[];
  fallbackAlt: string;
  wide: boolean;
}) {
  const hasBefore = hasImageAsset(chapter.beforeImage);
  const afterImage = hasImageAsset(chapter.image)
    ? chapter.image
    : images[0];
  const extras = afterImage
    ? images.filter((image) => assetId(image) !== assetId(afterImage))
    : images;
  const slides = afterImage ? [afterImage, ...extras] : extras;
  const [side, setSide] = useState<"before" | "after">(
    hasBefore && afterImage ? "after" : hasBefore ? "before" : "after",
  );
  const [slide, setSlide] = useState(0);
  const showToggle = hasBefore && Boolean(afterImage);
  const active =
    showToggle && side === "before"
      ? chapter.beforeImage
      : slides[slide] ?? afterImage ?? chapter.beforeImage;
  const caption = present(chapter.caption)
    ? chapter.caption
    : present(active?.alt)
      ? active?.alt
      : null;

  if (!active || !hasImageAsset(active)) return null;

  return (
    <figure className={wide ? "col-start-2 col-span-10" : "col-start-2 col-span-5"}>
      <div className="relative aspect-[4/3]">
        <Image
          src={urlFor(active).width(1200).height(900).url()}
          alt={active.alt ?? fallbackAlt}
          fill
          sizes="580px"
          className="object-cover"
        />
        {showToggle ? (
          <div className="absolute left-4 top-4 flex gap-x-1">
            <button
              type="button"
              aria-pressed={side === "before"}
              onClick={() => setSide("before")}
              className={`text-micro px-3 py-1.5 ${
                side === "before"
                  ? "bg-s2-orange text-s2-white"
                  : "bg-s2-white text-s2-black"
              }`}
            >
              Before
            </button>
            <button
              type="button"
              aria-pressed={side === "after"}
              onClick={() => setSide("after")}
              className={`text-micro px-3 py-1.5 ${
                side === "after"
                  ? "bg-s2-orange text-s2-white"
                  : "bg-s2-white text-s2-black"
              }`}
            >
              After
            </button>
          </div>
        ) : null}
      </div>
      {caption ? (
        <figcaption className="text-micro bg-s2-orange px-4 py-3 text-s2-white">
          {caption}
        </figcaption>
      ) : null}
      {slides.length > 1 && !(showToggle && side === "before") ? (
        <div className="flex items-center justify-between bg-s2-black px-4 py-3 text-s2-white">
          <p className="text-micro">
            {pad(slide + 1)}/{pad(slides.length)}
          </p>
          <div className="flex gap-x-4">
            <button
              type="button"
              aria-label="Previous image"
              className="text-micro"
              onClick={() =>
                setSlide((current) => (current - 1 + slides.length) % slides.length)
              }
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="text-micro"
              onClick={() => setSlide((current) => (current + 1) % slides.length)}
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </figure>
  );
}

function ImagePanel({
  image,
  fallbackAlt,
}: {
  image: ProjectImage;
  fallbackAlt: string;
}) {
  return (
    <section className="s2-page h-full w-screen shrink-0 content-start overflow-y-auto py-20">
      <figure className="col-start-2 col-span-10 flex h-full flex-col">
        <div className="relative min-h-0 flex-1">
          <Image
            src={urlFor(image).width(1600).url()}
            alt={image.alt ?? fallbackAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {present(image.alt) ? (
          <figcaption className="text-micro bg-s2-orange px-4 py-3 text-s2-white">
            {image.alt}
          </figcaption>
        ) : null}
      </figure>
    </section>
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
    <section className="s2-page h-full w-screen shrink-0 content-start overflow-y-auto py-20">
      {showStory ? (
        <div className="col-start-2 col-span-7">
          {heading ? <h2 className="text-metrics">{heading}</h2> : null}

          {acquired || sold ? (
            <div className="mt-12 flex items-end gap-x-16">
              {acquired ? <ExitSideBlock side={acquired} variant="acquired" /> : null}
              {sold ? <ExitSideBlock side={sold} variant="sold" /> : null}
            </div>
          ) : null}

          {metrics.length > 0 ? (
            <dl className="mt-20 flex gap-x-16 border-t border-s2-black pt-6">
              {metrics.map((metric, index) => (
                <div key={metric._key || index}>
                  <dt className="text-data">{metric.value}</dt>
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
          className={`flex h-full flex-col ${
            showStory ? "col-start-10 col-span-3" : "col-start-2 col-span-4"
          }`}
        >
          <h2 className="text-metrics border-b border-s2-black pb-4">Credits.</h2>
          <dl className="mt-8">
            {credits.map((credit, index) => (
              <div key={credit._key || index} className={index === 0 ? "" : "mt-6"}>
                {present(credit.label) ? (
                  <dt className="text-micro">{credit.label}</dt>
                ) : null}
                {present(credit.detail) ? (
                  <dd className={`text-body ${present(credit.label) ? "mt-1" : ""}`}>
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
              className="text-micro mt-auto self-end bg-s2-black px-5 py-3 text-s2-white"
            >
              Next · {nextProject.title}{" "}
              <span className="text-s2-orange">→</span>
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
        <div className="h-24 w-40 bg-s2-black" />
      ) : (
        <div className="h-32 w-32 bg-s2-orange" />
      )}
      {present(side.value) ? <p className="text-h2 mt-8">{side.value}</p> : null}
      {present(side.line) ? (
        <p className="text-micro mt-2">{side.line}</p>
      ) : null}
      {details.map((line, index) => (
        <p
          key={line}
          className={`text-data ${index === 0 ? "mt-3" : ""}`}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
