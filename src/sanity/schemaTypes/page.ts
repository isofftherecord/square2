import { icons } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { titleSlidesField } from "./titleSlides";

const PAGE_SLUGS = ["platform", "contact"] as const;

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: icons.document,
  fields: [
    defineField({
      name: "title",
      title: "Page name",
      description: "Internal name in the studio. Example: Platform.",
      type: "string",
      validation: (rule) => rule.required().error("Page name is required"),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      description: "Must be platform or contact.",
      type: "slug",
      options: { source: "title" },
      validation: (rule) =>
        rule.required().custom((value) => {
          const slug = value?.current;
          if (!slug) return "Press Generate to create the URL";
          if (!(PAGE_SLUGS as readonly string[]).includes(slug)) {
            return "Slug must be platform or contact";
          }
          return true;
        }),
    }),
    titleSlidesField,
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
      media: "slides.0.image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `/${subtitle}` : "Missing slug",
        media,
      };
    },
  },
});
