# Styleguide — Square2

Guía de uso de los estilos de marca del sitio. Todo está definido en
`src/app/globals.css` (estilos y colores) y `src/app/layout.tsx` (fuentes).

## Logo

El logo vive en `public/logo.png` (561×110 px, fondo transparente, letras
negras con el "2" naranja). Está pensado para fondos claros.

```tsx
import Image from "next/image";

<Image src="/logo.png" alt="Square2" width={224} height={44} priority />
```

- Usa `priority` solo cuando el logo es visible al cargar la página (ej. header).
- Mantén la proporción: el ancho debe ser ~5.1 veces la altura.
- Para usarlo sobre fondo oscuro se necesita exportar una variante clara desde Figma.

## Grilla

El sitio se diseña sobre un canvas de **1440px** con **12 columnas de 100px**.

| Token | Valor | Variable CSS |
|---|---|---|
| Ancho de página | 1440px | `--s2-page` |
| Columnas | 12 × 100px | `--s2-columns`, `--s2-col` |
| Gutter | 20px | `--s2-gutter` |
| Margen lateral | 10px | `--s2-margin` |

`10 + 12×100 + 11×20 + 10 = 1440`. Por debajo de 1440px el margen pasa a 20px y el gutter a 16px; las columnas se comprimen.

La clase `s2-page` centra ese canvas y activa la grilla CSS. Cada hijo directo usa `col-span-*` (1–12) para ocupar columnas. `s2-subgrid` anida secciones en las mismas 12 pistas. Navbar y contenido del sitio viven dentro de este wrapper.

```tsx
<div className="s2-page">
  <header className="col-span-12">{/* ancho completo */}</header>
  <main className="s2-subgrid">
    <section className="col-span-8">{/* 8 columnas */}</section>
    <aside className="col-span-4">{/* 4 columnas */}</aside>
  </main>
</div>
```

## Fuentes

Las tres familias están en `src/fonts/` y se cargan en `src/app/layout.tsx`.
Cada una se expone como una variable CSS; los estilos tipográficos las usan
automáticamente — nunca necesitas nombrar la fuente directamente.

| Familia | Variable CSS | Pesos disponibles | Uso |
|---|---|---|---|
| Signifier (versión de prueba) | `--font-signifier` | Extralight 200, Light 300, Light Italic | Títulos serif |
| Archivo | `--font-archivo` | Regular 400, Medium 500, Bold 700 | Textos y subtítulos |
| Fragment Mono | `--font-mono-brand` | Regular 400 | Etiquetas técnicas |

> ⚠️ Los archivos `TestSignifier-*.otf` son la versión de prueba de Klim Type.
> Antes de publicar en producción hay que comprar la licencia web y reemplazar
> los archivos en `src/fonts/`.

## Estilos tipográficos

Cada estilo es una clase de Tailwind lista para usar. La clase aplica fuente,
peso, tamaño, interlineado y (en los estilos mono) mayúsculas automáticas.

| Estilo | Clase | Fuente | Tamaño / interlineado | Cuándo usarlo |
|---|---|---|---|---|
| H1 | `text-h1` | Signifier Extralight | 40px / 120% (64px ≥1024px) | Título principal de cada página (uno por página) |
| H2 | `text-h2` | Signifier Light | 32px / 105% (48px ≥1024px) | Títulos de sección |
| H3 | `text-h3` | Signifier Medium | 28px / 115% (32px ≥1024px) | Subtítulos destacados |
| H4 | `text-h4` | Archivo Medium | 22px / 120% (28px ≥1024px) | Encabezados de bloques de contenido |
| H5 | `text-h5` | Archivo Bold | 18px / 150% | Títulos de tarjetas y elementos pequeños |
| Micro | `text-micro` | Fragment Mono | 10px / 120%, MAYÚSCULAS | Notas al pie, créditos, metadatos mínimos |
| Body | `text-body` | Archivo Regular | 18px / 150% | Párrafos y texto corrido |
| Tags | `text-tags` | Fragment Mono | 14px / 100%, MAYÚSCULAS | Etiquetas de categoría, chips |
| Navigation | `text-navigation` | Fragment Mono | 12px / 100%, MAYÚSCULAS | Menús y enlaces de navegación |
| Metrics | `text-metrics` | Signifier Light | 20px / 120% | Cifras y datos destacados con estilo editorial |
| Data | `text-data` | Fragment Mono | 16px / 130%, MAYÚSCULAS | Valores técnicos, números de referencia |

### Ejemplos

```tsx
// Título de página
<h1 className="text-h1">Our projects</h1>

// Título de sección con color de marca
<h2 className="text-h2 text-s2-slate">Residencial</h2>

// Etiqueta de categoría (las mayúsculas son automáticas)
<span className="text-tags text-s2-steel">Comercial</span>

// Párrafo
<p className="text-body">Project description…</p>

// Enlace de menú
<a className="text-navigation" href="/projects">Projects</a>
```

Las clases se combinan con cualquier otra utilidad de Tailwind (color,
márgenes, etc.). Para cambiar un tamaño o interlineado globalmente, edita el
bloque `@utility` correspondiente en `src/app/globals.css` — el cambio aplica
en todo el sitio.

## Colores de marca

Definidos como variables en `src/app/globals.css` y disponibles como clases
de Tailwind con el prefijo `s2-`:

| Color | Hex | Variable CSS | Clases Tailwind |
|---|---|---|---|
| Black | `#000000` | `--S2-Black` | `bg-s2-black`, `text-s2-black`, `border-s2-black` |
| Orange | `#F94704` | `--S2-Orange` | `bg-s2-orange`, `text-s2-orange`, `border-s2-orange` |
| Slate | `#333333` | `--S2-SLATE` | `bg-s2-slate`, `text-s2-slate`, `border-s2-slate` |
| Steel | `#97999B` | `--S2-STEEL` | `bg-s2-steel`, `text-s2-steel`, `border-s2-steel` |
| White | `#FFFFFF` | `--S2-White` | `bg-s2-white`, `text-s2-white`, `border-s2-white` |
| Fog | `#F9F9F9` | `--S2-Fog` | `bg-s2-fog`, `text-s2-fog`, `border-s2-fog` |

Además hay dos alias semánticos que controlan el tema general:

- `--background` (hoy: White) → clase `bg-background`, fondo global del sitio
- `--foreground` (hoy: Black) → clase `text-foreground`, color de texto global

Para cambiar el tema completo del sitio basta con apuntar esas dos variables
a otros colores de marca.

### Ejemplos

```tsx
// El "2" naranja de la marca como acento
<span className="text-s2-orange">2</span>

// Texto secundario
<p className="text-body text-s2-slate">Texto de apoyo…</p>
```

## Botones

Todos los botones del sitio salen de `src/components/button.tsx`. No escribas
las clases a mano: si necesitas un botón nuevo, usa el componente o agrégale
una variante.

El componente es polimórfico. Con `href` renderiza un `Link` de Next; sin
`href` renderiza un `<button>` (útil para submits y acciones).

| Prop | Valores | Default | Qué hace |
|---|---|---|---|
| `variant` | `white`, `black`, `orange`, `text` | `white` | Fondo y color de texto. `text` es label + flecha, sin relleno ni padding |
| `withArrow` | `boolean` | `true` | Muestra la flecha pixelada a la derecha |
| `className` | string | `""` | Solo layout: `col-span-*`, ancho, alineación |
| `href` | string | — | Si está, el botón es un enlace |

La regla importante: **la apariencia vive dentro del componente y el layout
fuera**. Padding, tipografía (`text-data`), color, gap, flecha y focus son
fijos; `col-span-5`, `w-full` o `justify-self-end` se pasan por `className`
desde la página. Si mezclas layout dentro del componente terminas creando una
variante nueva cada vez que cambia la posición.

```tsx
import { Button } from "@/components/button";

// Enlace, alineado a la derecha en una banda de 12 columnas
<Button href="/contact" className="col-span-12 w-fit lg:col-span-5 lg:justify-self-end">
  Get in touch
</Button>

// Submit de formulario, ancho completo
<Button type="submit" className="w-full">Subscribe</Button>

// Sobre fondo claro, sin flecha
<Button href="/portfolio" variant="black" withArrow={false}>View portfolio</Button>

// Enlace de texto (sin caja), con flecha naranja
<Button href="/portfolio" variant="text">The assets we own</Button>
```

La flecha es `public/icons/arrow-right.svg`. Como es un archivo estático, su
naranja está fijo: si una variante necesita la flecha en otro color, hay que
exportar un SVG nuevo a `public/icons/` y mapearlo en el componente.

## Reglas rápidas

1. **No definas tamaños de letra a mano** (`text-[17px]`, `font-serif`, etc.).
   Usa siempre una clase del styleguide; si falta un estilo, se agrega aquí.
2. **No uses colores fuera de la paleta** (`text-gray-500`, `#666`…).
   Usa las clases `s2-*`.
3. **Un solo `text-h1` por página**, por jerarquía y SEO.
4. **Layout sobre la grilla 1440 / 12**. Usa `s2-page`, `s2-subgrid` y `col-span-*`.
   No uses `max-w-6xl`, `px-6` u otros anchos sueltos para el canvas.
5. **Los botones salen de `Button`** (`src/components/button.tsx`). No repitas
   sus clases en una página; agrega una variante si falta.
6. Si el diseño cambia en Figma, actualiza `globals.css` y esta guía a la vez.
