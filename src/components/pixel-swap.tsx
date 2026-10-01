"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import "./pixel-swap.css";

// Tope de celdas para no saturar el DOM en transiciones grandes.
const MAX_PIXELS = 220;
// Pasos de la curva de animación (más = más suave, más caro).
const KEYFRAME_STEPS = 14;

export type PixelSwapPattern =
  | "random"
  | "center"
  | "edges"
  | "left-to-right"
  | "right-to-left"
  | "top-to-bottom"
  | "bottom-to-top"
  | "diagonal"
  | "spiral";

export type PixelSwapProps = {
  firstContent: ReactNode;
  secondContent: ReactNode;
  pixelSize?: number;
  gap?: number;
  pixelRadius?: number;
  pixelSpin?: number;
  pixelScale?: number;
  fade?: boolean;
  duration?: number;
  pixelDuration?: number;
  pattern?: PixelSwapPattern;
  randomness?: number;
  easing?: string;
  trigger?: "hover" | "click" | "manual";
  initialActive?: boolean;
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  onComplete?: (active: boolean) => void;
  aspectRatio?: string;
  className?: string;
  style?: CSSProperties;
};

type PatternFn = (x: number, y: number) => number | null;

type GridPixel = {
  id: number;
  left: number;
  top: number;
  offset: number;
};

type PixelGrid = {
  pixels: GridPixel[];
  size: number;
  gap: number;
  width: number;
  height: number;
};

// Cada patrón devuelve 0–1: cuándo arranca esa celda. `null` = orden aleatorio.
const PATTERNS: Record<PixelSwapPattern, PatternFn> = {
  random: () => null,
  center: (x, y) => Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2,
  edges: (x, y) => Math.min(x, 1 - x, y, 1 - y) * 2,
  "left-to-right": (x) => x,
  "right-to-left": (x) => 1 - x,
  "top-to-bottom": (_x, y) => y,
  "bottom-to-top": (_x, y) => 1 - y,
  diagonal: (x, y) => (x + y) / 2,
  spiral: (x, y) => {
    const angle = (Math.atan2(y - 0.5, x - 0.5) + Math.PI) / (Math.PI * 2);
    const radius = Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
    return (angle + radius) % 1;
  },
};

const EASINGS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// Pseudoaleatorio estable por índice (mismo seed = mismo valor).
const noise = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

// Convierte un easing CSS a una función 0–1 → 0–1 para los keyframes.
const makeEasing = (value: string): ((progress: number) => number) => {
  const match = /cubic-bezier\(([^)]+)\)/.exec(value);
  const points = match ? match[1].split(",").map(Number) : EASINGS[value];
  if (!points || points.length !== 4 || points.some(Number.isNaN)) {
    return makeEasing("ease");
  }

  const [x1, y1, x2, y2] = points;
  if (x1 === y1 && x2 === y2) return (progress) => progress;

  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  return (progress) => {
    let t = progress;
    for (let i = 0; i < 5; i += 1) {
      const slope = (3 * ax * t + 2 * bx) * t + cx;
      if (!slope) break;
      t -= (((ax * t + bx) * t + cx) * t - progress) / slope;
    }
    t = clamp(t, 0, 1);
    return ((ay * t + by) * t + cy) * t;
  };
};

// Escala final para que cada celda cubra huecos y esquinas redondeadas.
const coverScale = (size: number, gap: number, radius: number) => {
  const p = clamp(radius, 0, 50) / 100;
  const corner = Math.SQRT1_2 / (Math.SQRT2 * (0.5 - p) + p);
  return ((size + gap) / size) * Math.max(1, corner);
};

const buildGrid = ({
  width,
  height,
  pixelSize,
  gap,
  pattern,
  randomness,
}: {
  width: number;
  height: number;
  pixelSize: number;
  gap: number;
  pattern: PixelSwapPattern;
  randomness: number;
}): PixelGrid => {
  let size = pixelSize;
  let columns = Math.max(1, Math.ceil((width + gap) / (size + gap)));
  let rows = Math.max(1, Math.ceil((height + gap) / (size + gap)));

  // Si hay demasiadas celdas, agranda el pixel y recalcula filas/columnas.
  if (columns * rows > MAX_PIXELS) {
    size = Math.ceil(size * Math.sqrt((columns * rows) / MAX_PIXELS));
    columns = Math.max(1, Math.ceil((width + gap) / (size + gap)));
    rows = Math.max(1, Math.ceil((height + gap) / (size + gap)));
  }

  const stride = size + gap;
  // Centra la grilla respecto al contenedor.
  // En px enteros para que los bordes no queden a medio pixel.
  const originX = Math.floor((width - (columns * stride - gap)) / 2);
  const originY = Math.floor((height - (rows * stride - gap)) / 2);
  const order = PATTERNS[pattern] ?? PATTERNS.random;
  const mix = clamp(randomness, 0, 1);
  const pixels: GridPixel[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const x = columns <= 1 ? 0.5 : column / (columns - 1);
      const y = rows <= 1 ? 0.5 : row / (rows - 1);
      const base = order(x, y);
      const random = noise(index + 1);

      pixels.push({
        id: index,
        left: originX + column * stride,
        top: originY + row * stride,
        // Mezcla el patrón con ruido; `offset` es el delay relativo (0–1).
        offset: base === null ? random : base * (1 - mix) + random * mix,
      });
    }
  }

  return { pixels, size, gap, width, height };
};

const buildKeyframes = ({
  ease,
  startScale,
  endScale,
  spin,
  fade,
}: {
  ease: (progress: number) => number;
  startScale: number;
  endScale: number;
  spin: number;
  fade: boolean;
}) => {
  const windowFrames: Keyframe[] = [];
  const content: Keyframe[] = [];

  for (let step = 0; step <= KEYFRAME_STEPS; step += 1) {
    const progress = step / KEYFRAME_STEPS;
    const eased = ease(progress);
    const scale = startScale + (endScale - startScale) * eased;
    const angle = spin * (1 - eased);

    // La “ventana” (celda) crece y gira.
    windowFrames.push({
      offset: progress,
      opacity: fade ? Math.min(1, eased * 1.6) : 1,
      transform: `rotate(${angle}deg) scale(${scale})`,
    });
    // El contenido hace lo inverso para que la imagen no se vea distorsionada.
    content.push({
      offset: progress,
      transform: `scale(${1 / scale}) rotate(${-angle}deg)`,
    });
  }

  return { window: windowFrames, content };
};

// Recorte de un cuadrado que crece desde el centro, sin transformar la foto.
const clipStyle = ({
  eased,
  fromScale,
  fade,
  boxSize,
}: {
  eased: number;
  fromScale: number;
  fade: boolean;
  boxSize: number;
}) => {
  const start = clamp(fromScale, 0.05, 1);
  const visible = start + (1 - start) * eased;
  // Redondeado a 0.1px: cambios menores no se ven y Safari repinta igual.
  const inset = Math.round(((1 - visible) / 2) * boxSize * 10) / 10;
  return {
    opacity: String(fade ? Math.min(1, eased * 1.6) : 1),
    clipPath: `inset(${inset}px ${inset}px ${inset}px ${inset}px)`,
  };
};

// El delay de WAAPI en Safari muestra un frame el estado final (un salto).
// El arranque va dentro de los keyframes, no en `delay`.
const holdStart = (frames: Keyframe[], delay: number, activeMs: number) => {
  const full = delay + activeMs;
  if (delay <= 0 || full <= 0) return frames;
  const shifted = frames.map((frame) => ({
    ...frame,
    offset: Math.min(1, delay / full + Number(frame.offset) * (activeMs / full)),
  }));
  return [{ ...frames[0], offset: 0 }, ...shifted];
};

// Tamaño final del cuadrado. Sin giro el cuadro ya nace grande y el clip lo abre.
const tileBox = (
  grid: PixelGrid,
  radius: number,
  spin: number
) => {
  const endScale = coverScale(grid.size, grid.gap, radius);
  // Mínimo 1px de solape: Safari deja líneas entre cuadrados contiguos.
  const bleed =
    spin === 0 ? Math.max(1, Math.ceil((grid.size * (endScale - 1)) / 2)) : 0;
  return { endScale, bleed, boxSize: grid.size + bleed * 2 };
};

/**
 * Intercambia dos capas con una grilla de “píxeles” que revelan el contenido
 * entrante. El estado `active` elige firstContent (false) o secondContent (true).
 */
export function PixelSwap({
  firstContent,
  secondContent,
  pixelSize = 64,
  gap = 0,
  pixelRadius = 0,
  pixelSpin = 0,
  pixelScale = 0.35,
  fade = true,
  duration = 1400,
  pixelDuration = 450,
  pattern = "random",
  randomness = 0,
  easing = "cubic-bezier(0.22, 1, 0.36, 1)",
  trigger = "hover",
  initialActive = false,
  active,
  onActiveChange,
  onComplete,
  aspectRatio = "16 / 10",
  className = "",
  style,
}: PixelSwapProps) {
  // Si no hay `active` controlado, el padre no manda: usamos estado interno.
  const [internalActive, setInternalActive] = useState(initialActive);
  // Lo que se ve ahora (se actualiza al terminar la animación).
  const [shownActive, setShownActive] = useState(active ?? initialActive);
  // Transición en curso: a qué estado vamos y con qué grilla (congelada).
  const [transition, setTransition] = useState<{
    to: boolean;
    grid: PixelGrid;
  } | null>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pixelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationsRef = useRef<Animation[]>([]);
  const timerRef = useRef(0);
  const frameRef = useRef(0);

  const desiredActive = active ?? internalActive;
  const incomingIndex = transition?.to ? 1 : 0;

  const grid = useMemo(
    () =>
      buildGrid({
        width: box.width,
        height: box.height,
        pixelSize: Math.max(8, Math.round(pixelSize)),
        gap: Math.max(0, Math.round(gap)),
        pattern,
        randomness,
      }),
    [box.width, box.height, pixelSize, gap, pattern, randomness]
  );

  const config = {
    duration,
    pixelDuration,
    pixelSpin,
    pixelScale,
    pixelRadius,
    fade,
    easing,
    onComplete,
  };
  // Refs para leer valores actuales dentro de efectos sin re-dispararlos.
  const configRef = useRef(config);
  const gridRef = useRef(grid);
  configRef.current = config;
  gridRef.current = grid;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      setBox((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height }
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const stopAnimations = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.cancel());
    animationsRef.current = [];
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = 0;
  }, []);

  useEffect(() => stopAnimations, [stopAnimations]);

  // Arranca una transición cuando el estado deseado ya no coincide con lo visible.
  useEffect(() => {
    if (transition || desiredActive === shownActive) return;
    setTransition({ to: desiredActive, grid: gridRef.current });
  }, [desiredActive, shownActive, transition]);

  useEffect(() => {
    if (!transition) return;
    const settings = configRef.current;
    const { grid: frozenGrid, to } = transition;

    const source = layerRefs.current[to ? 1 : 0];
    // Sin DOM, sin celdas o con motion reducido: saltamos al estado final.
    if (
      !source ||
      !frozenGrid.pixels.length ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      stopAnimations();
      setShownActive(to);
      setTransition(null);
      settings.onComplete?.(to);
      return;
    }

    source.querySelectorAll("img").forEach((img) => {
      void img.decode().catch(() => undefined);
    });

    const total = Math.max(200, settings.duration);
    const pixelMs = clamp(settings.pixelDuration, 60, total);
    // Tiempo que queda para escalonar el inicio de cada celda.
    const spread = Math.max(0, total - pixelMs);
    const { endScale, bleed, boxSize } = tileBox(
      frozenGrid,
      settings.pixelRadius,
      settings.pixelSpin
    );
    // Safari desincroniza el scale del cuadrado y el scale inverso de la foto,
    // y la imagen pega un salto. Sin giro, el clip crece y la foto no se mueve.
    const clipReveal = settings.pixelSpin === 0;
    const ease = makeEasing(settings.easing);
    const keyframes = clipReveal
      ? null
      : buildKeyframes({
          ease,
          startScale: clamp(settings.pixelScale, 0.05, 1) * endScale,
          endScale,
          spin: settings.pixelSpin,
          fade: settings.fade,
        });
    const clipAt = (progress: number) =>
      clipStyle({
        eased: ease(progress),
        fromScale: settings.pixelScale,
        fade: settings.fade,
        boxSize,
      });
    const clipTiles: { element: HTMLDivElement; delay: number }[] = [];

    let cancelled = false;
    let settled = false;

    const finish = () => {
      if (cancelled || settled) return;
      settled = true;

      // La capa entrante queda visible antes de quitar la grilla. Si Safari
      // pinta al cancelar la animación, debajo ya está la foto correcta.
      const incoming = layerRefs.current[to ? 1 : 0];
      const outgoing = layerRefs.current[to ? 0 : 1];
      if (incoming) {
        incoming.dataset.visible = "true";
        incoming.style.zIndex = "2";
        incoming.removeAttribute("aria-hidden");
      }
      if (outgoing) {
        outgoing.dataset.visible = "false";
        outgoing.style.zIndex = "1";
        outgoing.setAttribute("aria-hidden", "true");
      }

      pixelRefs.current.forEach((pixelElement) => {
        if (!pixelElement) return;
        pixelElement.style.opacity = "1";
        if (clipReveal) {
          pixelElement.style.clipPath = "inset(0px 0px 0px 0px)";
        }
      });

      let unmounted = false;
      const unmount = () => {
        if (cancelled || unmounted) return;
        unmounted = true;
        stopAnimations();
        setShownActive(to);
        setTransition(null);
        settings.onComplete?.(to);
      };

      // Safari no decodifica la imagen de una capa oculta. Si se quita la
      // grilla antes de que la pinte, el final se queda trabado un momento.
      // Con tope de tiempo: rAF no corre en pestañas en segundo plano.
      const images = incoming ? [...incoming.querySelectorAll("img")] : [];
      const decoded = Promise.all(
        images.map((img) => img.decode().catch(() => undefined))
      );
      const limit = new Promise((resolve) => window.setTimeout(resolve, 120));
      void Promise.race([decoded, limit]).then(() => {
        requestAnimationFrame(unmount);
        window.setTimeout(unmount, 50);
      });
    };

    const startAnimations: Array<() => void> = [];

    frozenGrid.pixels.forEach((pixel, index) => {
      const pixelElement = pixelRefs.current[index];
      if (!pixelElement) return;

      // Recorte: copia del contenido entrante posicionada bajo esta celda.
      const content = document.createElement("div");
      content.className = "pixel-swap__pixel-content";
      content.style.left = `${-pixel.left + bleed}px`;
      content.style.top = `${-pixel.top + bleed}px`;
      content.style.width = `${frozenGrid.width}px`;
      content.style.height = `${frozenGrid.height}px`;

      const clone = source.cloneNode(true) as HTMLElement;
      clone.dataset.visible = "true";
      clone.removeAttribute("aria-hidden");
      // Tamaño en px: en Safari el % de la imagen clonada se resuelve un frame tarde y salta.
      clone.style.width = `${frozenGrid.width}px`;
      clone.style.height = `${frozenGrid.height}px`;
      clone.querySelectorAll("img").forEach((img) => {
        img.style.width = `${frozenGrid.width}px`;
        img.style.height = `${frozenGrid.height}px`;
        img.style.maxWidth = "none";
        img.style.objectFit = "cover";
        // Safari vuelve a elegir el srcset del clon y la foto salta al decodificar.
        if (navigator.vendor !== "Apple Computer, Inc.") return;
        const current = img.currentSrc;
        if (!current || !img.complete) return;
        img.decoding = "sync";
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
        img.src = current;
      });
      content.appendChild(clone);

      const delay = pixel.offset * spread;
      const timing: KeyframeAnimationOptions = {
        duration: delay + pixelMs,
        easing: "linear",
        fill: "forwards",
      };

      if (clipReveal) {
        const first = clipAt(0);
        pixelElement.style.opacity = first.opacity;
        pixelElement.style.clipPath = first.clipPath;
        pixelElement.replaceChildren(content);
        clipTiles.push({ element: pixelElement, delay });
        return;
      }

      pixelElement.replaceChildren(content);

      if (!keyframes) return;

      const originX = pixel.left + frozenGrid.size / 2;
      const originY = pixel.top + frozenGrid.size / 2;
      content.style.transformOrigin = `${originX}px ${originY}px`;
      const contentFrames = keyframes.content.map((frame) => ({
        ...frame,
        transformOrigin: `${originX}px ${originY}px`,
      }));
      const windowFrames = holdStart(keyframes.window, delay, pixelMs);
      const contentFramesHeld = holdStart(contentFrames, delay, pixelMs);
      startAnimations.push(() => {
        animationsRef.current.push(
          pixelElement.animate(windowFrames, timing),
          content.animate(contentFramesHeld, timing)
        );
      });
    });

    // Un solo reflow con el primer frame ya puesto. Si no, Safari pinta el final un instante.
    void containerRef.current?.offsetWidth;

    if (clipReveal) {
      // Estilos inline por frame en vez de WAAPI: Safari deja cuadrados
      // a medio abrir al no repintar clip-path animado.
      const startTime = performance.now();
      const tick = () => {
        if (cancelled || settled) return;
        const elapsed = performance.now() - startTime;
        let running = false;
        clipTiles.forEach(({ element, delay }) => {
          const progress = clamp((elapsed - delay) / pixelMs, 0, 1);
          if (progress < 1) running = true;
          const next = clipAt(progress);
          if (element.style.opacity !== next.opacity) {
            element.style.opacity = next.opacity;
          }
          if (element.style.clipPath !== next.clipPath) {
            element.style.clipPath = next.clipPath;
          }
        });
        if (!running) {
          finish();
          return;
        }
        frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    } else {
      startAnimations.forEach((start) => start());
      const pending = animationsRef.current.map((animation) =>
        animation.finished.then(
          () => undefined,
          () => undefined
        )
      );
      void Promise.all(pending).then(finish);
    }

    // Respaldo si rAF se pausa (pestaña en segundo plano). Va después del último cuadrado.
    timerRef.current = window.setTimeout(finish, total + 120);

    return () => {
      cancelled = true;
      stopAnimations();
    };
  }, [stopAnimations, transition]);

  const requestActive = useCallback(
    (next: boolean) => {
      if (active === undefined) setInternalActive(next);
      onActiveChange?.(next);
    },
    [active, onActiveChange]
  );

  const interactionProps = useMemo(() => {
    if (trigger === "hover") {
      return {
        onMouseEnter: () => requestActive(true),
        onMouseLeave: () => requestActive(false),
        onFocus: () => requestActive(true),
        onBlur: () => requestActive(false),
        tabIndex: 0,
      };
    }

    if (trigger === "click") {
      return {
        onClick: () => requestActive(!desiredActive),
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            requestActive(!desiredActive);
          }
        },
        role: "button" as const,
        tabIndex: 0,
      };
    }

    return {};
  }, [desiredActive, requestActive, trigger]);

  const renderLayer = (content: ReactNode, index: number) => {
    const isShown = index === (shownActive ? 1 : 0);
    return (
      <div
        key={index}
        ref={(element) => {
          layerRefs.current[index] = element;
        }}
        className="pixel-swap__layer"
        // Oculta la capa entrante mientras la grilla la revela.
        data-visible={isShown && !(transition && index === incomingIndex)}
        style={{ zIndex: isShown ? 2 : 1 }}
        aria-hidden={!isShown}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`pixel-swap ${className}`.trim()}
      style={{ aspectRatio, ...style }}
      data-active={shownActive}
      data-transitioning={!!transition}
      {...interactionProps}
    >
      {renderLayer(firstContent, 0)}
      {renderLayer(secondContent, 1)}

      {transition ? (
        <div className="pixel-swap__grid" aria-hidden="true">
          {transition.grid.pixels.map((pixel, index) => {
            const { bleed, boxSize } = tileBox(
              transition.grid,
              pixelRadius,
              pixelSpin
            );
            return (
              <div
                key={pixel.id}
                ref={(element) => {
                  pixelRefs.current[index] = element;
                }}
                className="pixel-swap__pixel"
                style={{
                  left: pixel.left - bleed,
                  top: pixel.top - bleed,
                  width: boxSize,
                  height: boxSize,
                  borderRadius: `${clamp(pixelRadius, 0, 50)}%`,
                }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
