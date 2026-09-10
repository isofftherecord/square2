# Square2

Corporate site and project portfolio, built with:

- **Next.js 16** (App Router, TypeScript, Tailwind CSS 4)
- **Sanity 6** as CMS, with the Studio embedded at `/studio`
- **Resend** for Contact and Subscribe forms
- **Google Maps** on the Contact page
- **Vercel** for deployment

## Getting started

### 1. Create the Sanity project

1. Sign in at [sanity.io](https://www.sanity.io/) (free).
2. In [sanity.io/manage](https://sanity.io/manage), create a new project with a dataset named `production`.
3. Copy the **Project ID**.

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID="abc12345"
NEXT_PUBLIC_SANITY_DATASET="production"

# Google Maps (página Contact)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=""

# Formularios (Contact + Subscribe)
RESEND_API_KEY=""
CONTACT_TO_EMAIL=""
CONTACT_FROM_EMAIL="Square2 <beth.t@example.com>"
```

- **Sanity**: get the Project ID at [sanity.io/manage](https://sanity.io/manage).
- **Google Maps**: API key and Map ID from Google Cloud. Required for the map on `/contact`.
- **Resend**: API key from [resend.com](https://resend.com). In testing, verify the same inbox you send from. Change `CONTACT_TO_EMAIL` when going to production.

### 3. Allow the local origin in Sanity

In [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **CORS origins**, add `http://localhost:3000` (allow credentials).

### 4. Run the project

```bash
npm install
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Content studio: [http://localhost:3000/studio](http://localhost:3000/studio)

## For the client: how do I edit content?

1. Open `/studio` (e.g. `https://yoursite.com/studio`) and sign in.
2. Under **Projects**, create or edit a project: name, category, summary, photos, and description.
3. In the URL field, press **Generate**.
4. Press **Publish** so the change goes live. An open site tab updates as soon as you publish.

Home and Firm heroes are edited from their own Studio documents.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the repo at [vercel.com](https://vercel.com).
3. Add the environment variables from `.env.example` in the project settings.
4. Deploy. Then add the Vercel domain (e.g. `https://square2.vercel.app`) to Sanity **CORS origins** so Studio works in production.

## Structure

```
src/
  app/
    (site)/page.tsx              # Home
    (site)/firm/                 # Página Firm
    (site)/platform/             # Página Platform
    (site)/portfolio/            # Índice de proyectos
    (site)/contact/              # Formulario + mapa
    (site)/projects/[slug]/      # Case study de cada proyecto
    studio/                      # Sanity Studio embebido
  components/                    # UI del sitio
  lib/
    form-actions.ts              # Server actions de Contact y Subscribe
    mail.ts                      # Envío con Resend
  sanity/
    env.ts                       # Variables de entorno
    lib/                         # Cliente, imágenes y consultas GROQ
    schemaTypes/                 # Esquemas: project, homeHero, firmHero
sanity.config.ts                 # Configuración del Studio
```
