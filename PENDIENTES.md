# Pendientes

Lista de lo que falta revisar o cerrar. No es un roadmap: son huecos concretos del sitio actual.

## Footer

- [ ] URLs reales de **LinkedIn** (`src/components/footer.tsx`, array `CONNECTIONS`; hoy apuntan a `#`).
- [ ] Destino del formulario **Subscribe**: a dónde se envía o guarda el email (Mailchimp, Sanity, API, etc.). El submit existe pero no hace nada.

## Páginas

- [ ] Crear **Firm** (`/`), **Platform** (`/platform`), **Portfolio** y **Contact** (`/contact`) según Figma. Navbar y footer ya enlazan a Platform y Contact; esas rutas todavía no existen.
- [ ] Alinear el home y el detalle de proyecto a la grilla 1440 / 12 y al styleguide (el detalle aún usa clases genéricas: `text-3xl`, `text-neutral-*`, `prose-invert`).

## Marca

- [ ] Comprar la licencia web de **Signifier** (Klim Type) y reemplazar `src/fonts/TestSignifier-*.otf` antes de publicar. Hoy es la versión de prueba.
- [ ] Exportar desde Figma una **variante clara del logo** para fondos oscuros (`public/logo.png` es para fondos claros).

## CMS

- [ ] Confirmar Sanity en `.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`) y CORS de `localhost:3000` si el listado de proyectos sigue vacío.
- [ ] Recrear documentos en Studio si había contenido: los tipos pasaron de `proyecto` / `categoria` a `project` / `category` (campos en inglés). Los títulos del panel siguen en español.
