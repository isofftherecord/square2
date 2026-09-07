"use client";

import { icons } from "@sanity/icons";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { SeedLasOlasAction } from "./src/sanity/actions/seed-las-olas";
import { ArrayItemWithDone } from "./src/sanity/components/array-item-with-done";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "square2",
  title: "Square2 — Content studio",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons: no deben aparecer en «Crear nuevo».
    templates: (templates) =>
      templates.filter(
        (template) =>
          template.schemaType !== "homeHero" &&
          template.schemaType !== "firmHero",
      ),
  },
  form: {
    components: {
      item: ArrayItemWithDone,
    },
  },
  document: {
    actions: (input) => [...input, SeedLasOlasAction],
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Home — Slider")
              .id("homeHero")
              .icon(icons.images)
              .schemaType("homeHero")
              .child(
                S.document().schemaType("homeHero").documentId("homeHero"),
              ),
            S.listItem()
              .title("Firm — Hero")
              .id("firmHero")
              .icon(icons.document)
              .schemaType("firmHero")
              .child(
                S.document().schemaType("firmHero").documentId("firmHero"),
              ),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
          ]),
    }),
    // Herramienta para probar consultas GROQ (útil solo para desarrolladores).
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
