"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "square2",
  title: "Square2 — Panel de contenido",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.documentTypeListItem("proyecto").title("Proyectos"),
            S.documentTypeListItem("categoria").title("Categorías"),
          ]),
    }),
    // Herramienta para probar consultas GROQ (útil solo para desarrolladores).
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
