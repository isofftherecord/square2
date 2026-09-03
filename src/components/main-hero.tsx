"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const BRAND = "var(--color-s2-orange)";

export type HeroSlide = {
  src: string;
  property: string;
  year: string;
};

// Mosaico: 11 columnas x 5 filas, anclado al borde inferior.
// 0 = vacío · 1 = naranja translúcido · 2 = naranja sólido
const PATTERN: number[][] = [
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2],
  [0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0],
  [0, 0, 2, 0, 0, 0, 0, 1, 1, 1, 2],
  [0, 2, 0, 1, 1, 0, 2, 1, 1, 2, 0],
  [1, 1, 0, 1, 2, 0, 1, 1, 2, 0, 1],
];

export function MainHero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const total = slides.length;
  const slide = slides[index] ?? slides[0];

  // Reinicia el mosaico en cada slide para que la animación se repita.
  useEffect(() => {
    setRevealed(false);
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setRevealed(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [index]);

  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [index, total]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (total === 0) return;
      setIndex((prev) => (prev + dir + total) % total);
    },
    [total]
  );

  if (!slide) return null;

  return (
    // Sale de la grilla 1440 para ocupar todo el viewport.
    <section className="col-span-12 ml-[calc(50%-50vw)] w-screen max-w-[100vw]">
      <div className="relative h-svh   w-full overflow-hidden max-h-[900px]">
        {/* Imágenes */}
        {slides.map((s, i) => (
          <Image
            key={`${s.src}-${i}`}
            src={s.src}
            alt={s.property}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Mosaico naranja */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 grid grid-cols-11">
          {PATTERN.map((row, r) =>
            row.map((cell, c) => (
              <span
                key={`${r}-${c}`}
                className="aspect-square transition-opacity ease-out motion-reduce:transition-none"
                style={{
                  backgroundColor: cell === 0 ? "transparent" : BRAND,
                  opacity: !revealed || cell === 0 ? 0 : cell === 2 ? 1 : 0.62,
                  // El reset es instantáneo; solo la entrada se escalona.
                  transitionDuration: revealed ? "500ms" : "0ms",
                  transitionDelay: revealed ? `${(r + c) * 45}ms` : "0ms",
                }}
              />
            ))
          )}
        </div>

        {/* Ficha de proyecto */}
        <div className="absolute bottom-0 right-0 flex flex-col items-end">
          <div className="flex h-[68px] w-[327px] items-end justify-between bg-s2-white px-3 pb-[10px]">
            <div>
              <p className="text-label-hero text-s2-steel">
                Property
              </p>
              <p className="text-body">
                {slide.property}
              </p>
            </div>
            <div className="text-right">
              <p className="text-label-hero text-s2-steel">
                Year
              </p>
              <p className="text-body">
                {slide.year}
              </p>
            </div>
          </div>

          <div className="flex h-[62px] w-[218px] items-center justify-between bg-s2-white px-3">
            <span className="text-body ">
              {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous project"
                className="cursor-pointer text-s2-black transition-transform duration-200 hover:-translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-s2-orange)]"
              >
                <Arrow className="rotate-180 " />
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
