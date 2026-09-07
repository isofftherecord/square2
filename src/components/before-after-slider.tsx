"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type SlideImage = {
  src: string;
  alt: string;
};

type BeforeAfterSliderProps = {
  before: SlideImage;
  after: SlideImage;
  sizes?: string;
};

export function BeforeAfterSlider({
  before,
  after,
  sizes = "580px",
}: BeforeAfterSliderProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);

  const moveTo = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const { left, width } = frame.getBoundingClientRect();
    if (width <= 0) return;
    const next = ((clientX - left) / width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <div
      ref={frameRef}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
      className="relative aspect-[4/3] w-full cursor-ew-resize touch-none select-none outline-none"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        moveTo(event.clientX);
      }}
      onPointerMove={(event) => {
        moveTo(event.clientX);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          setPosition((current) => Math.max(0, current - 2));
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          setPosition((current) => Math.min(100, current + 2));
        }
        if (event.key === "Home") {
          event.preventDefault();
          setPosition(0);
        }
        if (event.key === "End") {
          event.preventDefault();
          setPosition(100);
        }
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes={sizes}
          draggable={false}
          className="pointer-events-none object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={before.src}
            alt={before.alt}
            fill
            sizes={sizes}
            draggable={false}
            className="pointer-events-none object-cover"
          />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-s2-orange" />
        <div className="absolute top-1/2 left-0 flex -translate-x-1/2 -translate-y-1/2">
          <span className="text-micro whitespace-nowrap bg-s2-black px-3 py-1.5 text-s2-white">
            Before
          </span>
          <span className="text-micro whitespace-nowrap bg-s2-orange px-3 py-1.5 text-s2-white">
            After
          </span>
        </div>
      </div>
    </div>
  );
}
