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
| H1 | `text-h1` | Signifier Extralight | 64px / 120% | Título principal de cada página (uno por página) |
| H2 | `text-h2` | Signifier Light | 48px / 105% | Títulos de sección |
| H3 | `text-h3` | Signifier Medium | 32px / 115% | Subtítulos destacados |
| H4 | `text-h4` | Archivo Medium | 28px / 120% | Encabezados de bloques de contenido |
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
<h1 className="text-h1">Nuestros proyectos</h1>

// Título de sección con color de marca
<h2 className="text-h2 text-s2-slate">Residencial</h2>

// Etiqueta de categoría (las mayúsculas son automáticas)
<span className="text-tags text-s2-steel">Comercial</span>

// Párrafo
<p className="text-body">Descripción del proyecto…</p>

// Enlace de menú
<a className="text-navigation" href="/proyectos">Proyectos</a>
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

// Botón de marca
<button className="text-navigation bg-s2-black text-s2-white px-6 py-3 rounded-full">
  Ver proyecto
</button>
```

## Reglas rápidas

1. **No definas tamaños de letra a mano** (`text-[17px]`, `font-serif`, etc.).
   Usa siempre una clase del styleguide; si falta un estilo, se agrega aquí.
2. **No uses colores fuera de la paleta** (`text-gray-500`, `#666`…).
   Usa las clases `s2-*`.
3. **Un solo `text-h1` por página**, por jerarquía y SEO.
4. Si el diseño cambia en Figma, actualiza `globals.css` y esta guía a la vez.
