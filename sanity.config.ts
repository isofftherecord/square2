"use client";

import { icons } from "@sanity/icons";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { ArrayItemWithDone } from "./src/sanity/components/array-item-with-done";
import { dataset, projectId } from "./src/sanity/env";
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
          template.schemaType !== "firmHero" &&
          template.schemaType !== "firmTeam" &&
          template.schemaType !== "firmPartners",
      ),
  },
  form: {
    components: {
      item: ArrayItemWithDone,
    },
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
            S.listItem()
              .title("Firm — Team")
              .id("firmTeam")
              .icon(icons.users)
              .schemaType("firmTeam")
              .child(
                S.document().schemaType("firmTeam").documentId("firmTeam"),
              ),
            S.listItem()
              .title("Firm — Partners")
              .id("firmPartners")
              .icon(icons["earth-globe"])
              .schemaType("firmPartners")
              .child(
                S.document()
                  .schemaType("firmPartners")
                  .documentId("firmPartners"),
              ),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
          ]),
    }),
  ],
});
