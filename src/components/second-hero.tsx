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
      <div className="relative h-[420px] w-full overflow-hidden lg:h-[800px]">
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
          {/* Título y controles apilados sin separación, centrados en el hero */}
          <div className="s2-page h-full items-center">
            <div className="col-span-12 max-w-[535px] lg:col-span-6 lg:col-start-2">
              <div className="text-h1 bg-s2-orange px-5 py-6 text-s2-white lg:px-10 lg:py-10">
                {slide.title}
              </div>
              {total > 1 ? (
                <div className="flex h-[62px] w-[218px] items-center justify-between bg-s2-orange px-3">
                  <span className="text-body text-s2-black">
                    {String(index + 1).padStart(2, "0")}/
                    {String(total).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label="Previous slide"
                      className="cursor-pointer text-s2-white transition-transform duration-200 hover:-translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-s2-white)]"
                    >
                      <Arrow />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label="Next slide"
                      className="cursor-pointer text-s2-black transition-transform duration-200 hover:translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-s2-black)]"
                    >
                      <Arrow className="rotate-180" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="15"
      viewBox="0 0 18 15"
      // El color lo define la clase text-* del botón
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.0006 7.50042C18.0006 7.69933 17.9216 7.8901 17.7809 8.03075C17.6403 8.1714 17.4495 8.25042 17.2506 8.25042H2.5609L8.03122 13.7198C8.1009 13.7895 8.15617 13.8722 8.19389 13.9632C8.2316 14.0543 8.25101 14.1519 8.25101 14.2504C8.25101 14.349 8.2316 14.4465 8.19389 14.5376C8.15617 14.6286 8.1009 14.7114 8.03122 14.781C7.96153 14.8507 7.87881 14.906 7.78776 14.9437C7.69672 14.9814 7.59914 15.0008 7.50059 15.0008C7.40204 15.0008 7.30446 14.9814 7.21342 14.9437C7.12237 14.906 7.03965 14.8507 6.96996 14.781L0.219965 8.03104C0.150233 7.96139 0.0949134 7.87867 0.0571702 7.78762C0.019427 7.69657 0 7.59898 0 7.50042C0 7.40186 0.019427 7.30426 0.0571702 7.21321C0.0949134 7.12216 0.150233 7.03945 0.219965 6.96979L6.96996 0.219792C7.1107 0.0790615 7.30157 -1.48284e-09 7.50059 0C7.69961 1.48284e-09 7.89048 0.0790615 8.03122 0.219792C8.17195 0.360523 8.25101 0.551394 8.25101 0.750417C8.25101 0.94944 8.17195 1.14031 8.03122 1.28104L2.5609 6.75042H17.2506C17.4495 6.75042 17.6403 6.82943 17.7809 6.97009C17.9216 7.11074 18.0006 7.3015 18.0006 7.50042Z" />
    </svg>
  );
}
