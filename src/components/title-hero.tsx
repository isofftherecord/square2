"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type TitleHeroSlide = {
  title: string;
  src: string;
  alt: string;
};

export function TitleHero({ slides }: { slides: TitleHeroSlide[] }) {
  const [index, setIndex] = useState(0);

  const total = slides.length;
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [index, total]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (total < 2) return;
      setIndex((prev) => (prev + dir + total) % total);
    },
    [total],
  );

  if (!slide) return null;

  return (
    // Full-bleed, 800px de alto; el H1 va sobre la grilla 1440.
    <section className="col-span-12 ml-[calc(50%-50vw)] w-screen max-w-[100vw]">
      <div className="relative h-[800px] w-full overflow-hidden">
        {slides.map((item, i) => (
          <Image
            key={`${item.src}-${i}`}
            src={item.src}
            alt={item.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0">
          <div className="s2-page h-full items-end pb-16">
            <h1 className="text-h1 col-span-12 text-s2-white lg:col-span-8">
              {slide.title}
            </h1>
          </div>
        </div>

        {total > 1 ? (
          <div className="absolute bottom-0 right-0 flex h-[62px] w-[218px] items-center justify-between bg-s2-white px-3">
            <span className="text-body">
              {String(index + 1).padStart(2, "0")}/
              {String(total).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="text-s2-black transition-transform duration-200 hover:-translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-s2-orange)]"
              >
                <Arrow className="rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next slide"
                className="text-s2-orange transition-transform duration-200 hover:translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-s2-orange)]"
              >
                <Arrow />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="26"
      height="14"
      viewBox="0 0 26 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 7h24" strokeLinecap="round" />
      <path d="M18 1l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
