# Square2

Sitio corporativo con portafolio de proyectos, construido con:

- **Next.js 16** (App Router, TypeScript, Tailwind CSS 4)
- **Sanity 6** como CMS, con el Studio embebido en `/studio`
- **Vercel** para el despliegue

## Primeros pasos

### 1. Crear el proyecto en Sanity

1. Entra a [sanity.io](https://www.sanity.io/) y crea una cuenta (gratis).
2. En [sanity.io/manage](https://sanity.io/manage) crea un proyecto nuevo con un dataset llamado `production`.
3. Copia el **Project ID**.

### 2. Configurar las variables de entorno

Copia `.env.example` a `.env.local` y pega tu Project ID:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="abc12345"
NEXT_PUBLIC_SANITY_DATASET="production"
```

### 3. Autorizar el dominio local en Sanity

En [sanity.io/manage](https://sanity.io/manage) → tu proyecto → **API** → **CORS origins**, agrega `http://localhost:3000` (con credenciales permitidas).

### 4. Correr el proyecto

```bash
npm install
npm run dev
```

- Sitio: [http://localhost:3000](http://localhost:3000)
- Panel de contenido (Sanity Studio): [http://localhost:3000/studio](http://localhost:3000/studio)

## Para el cliente: ¿cómo edito el contenido?

1. Entra a `/studio` (ej. `https://tusitio.com/studio`) e inicia sesión.
2. En **Proyectos**, crea o edita un proyecto: nombre, categoría, resumen, fotos y descripción.
3. En el campo URL presiona **Generate** y listo.
4. Presiona **Publish** para que el cambio salga al sitio (tarda ~1 minuto en verse).

Las **Categorías** (ej. Residencial, Comercial…) se administran en su propia sección.

## Despliegue en Vercel

1. Sube este repositorio a GitHub.
2. En [vercel.com](https://vercel.com), importa el repo.
3. Agrega las variables de entorno `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET` en la configuración del proyecto.
4. Despliega. Luego agrega el dominio de Vercel (ej. `https://square2.vercel.app`) a los **CORS origins** de Sanity para poder usar el Studio en producción.

## Estructura

```
src/
  app/                  # Páginas del sitio (App Router)
    (site)/page.tsx     # Home: lista de proyectos
    (site)/projects/[slug]/  # Detalle de cada proyecto
    studio/             # Sanity Studio embebido
  sanity/
    env.ts              # Variables de entorno
    lib/                # Cliente, imágenes y consultas GROQ
    schemaTypes/        # Esquemas: project y category
sanity.config.ts        # Configuración del Studio
```
