import { icons } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const homeHero = defineType({
  name: "homeHero",
  title: "Home — Slider",
  type: "document",
  icon: icons.images,
  fields: [
    defineField({
      name: "slides",
      title: "Hero slides",
      description:
        "Home slider images. Maximum 5; fewer is fine. Drag to reorder.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "heroSlide",
          title: "Slide",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  description:
                    "Describe the image (helps SEO and accessibility).",
                  type: "string",
                }),
              ],
              validation: (rule) =>
                rule.required().error("Upload an image for this slide"),
            }),
            defineField({
              name: "property",
              title: "Property",
              description: "Property name shown on the slider card.",
              type: "string",
              validation: (rule) =>
                rule.required().error("Property name is required"),
            }),
            defineField({
              name: "year",
              title: "Year",
              description: "Year or range. Example: 2021 - 2025",
              type: "string",
              validation: (rule) =>
                rule.required().error("Year is required"),
            }),
          ],
          preview: {
            select: {
              title: "property",
              subtitle: "year",
              media: "image",
            },
          },
        }),
      ],
      validation: (rule) => rule.max(5).error("Maximum 5 slides"),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home — Slider" };
    },
  },
});
