"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Arrow } from "@/components/arrow";
import { PixelSwap } from "@/components/pixel-swap";

export type HeroSlide = {
  src: string;
  property: string;
  year: string;
};

function HeroFrame({
  slide,
  priority,
}: {
  slide: HeroSlide | null;
  priority?: boolean;
}) {
  if (!slide) {
    return <div className="absolute inset-0 bg-s2-orange" />;
  }

  return (
    <div className="absolute inset-0">
      <Image
        src={slide.src}
        alt={slide.property}
        fill
        priority={priority}
        sizes="(min-width: 1440px) 1440px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

export function MainHero({ slides }: { slides: HeroSlide[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(true);
  const [sized, setSized] = useState(false);
  // null = cubre naranja del intro; el otro slot arranca con el primer slide.
  const [firstIndex, setFirstIndex] = useState<number | null>(null);
  const [secondIndex, setSecondIndex] = useState(0);

  const total = slides.length;
  const slide = slides[index] ?? slides[0];
  const firstSlide = firstIndex === null ? null : (slides[firstIndex] ?? null);
  const secondSlide = slides[secondIndex] ?? null;

  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [index, total]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const markReady = () => {
      if (el.clientWidth > 0 && el.clientHeight > 0) setSized(true);
    };
    markReady();
    const observer = new ResizeObserver(markReady);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Dispara el swap inicial cuando el hero ya tiene medidas.
  useEffect(() => {
    if (!sized) return;
    const timer = window.setTimeout(() => setActive(true), 60);
    return () => window.clearTimeout(timer);
  }, [sized]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (busy || total < 2) return;
      const next = (index + dir + total) % total;
      if (next === index) return;

      setBusy(true);
      if (active) {
        setFirstIndex(next);
        setActive(false);
      } else {
        setSecondIndex(next);
        setActive(true);
      }
      setIndex(next);
    },
    [active, busy, index, total]
  );

  if (!slide) return null;

  return (
    // Canvas 1440: la imagen no se estira más allá del marco de diseño.
    <section className="s2-hero">
      <div
        ref={rootRef}
        className="relative h-svh w-full max-h-[900px] overflow-hidden"
      >
        <PixelSwap
          firstContent={<HeroFrame slide={firstSlide} priority />}
          secondContent={<HeroFrame slide={secondSlide} priority />}
          pixelSize={130}
          gap={0}
          pixelRadius={0}
          pixelSpin={0}
          pixelScale={0.35}
          duration={1400}
          pixelDuration={450}
          pattern="diagonal"
          randomness={0.45}
          fade
          trigger="manual"
          active={active}
          onComplete={() => setBusy(false)}
          aspectRatio="auto"
          className="h-full w-full"
          style={{ height: "100%" }}
        />

        {/* Ficha de proyecto */}
        <div className="absolute right-0 bottom-0 z-10 flex max-w-full flex-col items-end">
          <div className="flex h-[68px] w-[min(327px,100vw)] items-end justify-between bg-s2-white px-4 pt-[13px] pb-[13px]">
            <div>
              <p className="text-label-hero text-s2-steel">Property</p>
              <p className="text-body">{slide.property}</p>
            </div>
            <div className="text-right">
              <p className="text-label-hero text-s2-steel">Year</p>
              <p className="text-body">{slide.year}</p>
            </div>
          </div>

          <div className="flex h-[62px] w-[218px] items-center justify-between bg-s2-white px-3">
            <span className="text-body text-s2-slate">
              {String(index + 1).padStart(2, "0")}/
              {String(total).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous project"
                className="cursor-pointer text-s2-black transition-transform duration-200 hover:-translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-s2-orange)]"
              >
                <Arrow className="rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next project"
                className="cursor-pointer text-s2-orange transition-transform duration-200 hover:translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-s2-orange)]"
              >
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
