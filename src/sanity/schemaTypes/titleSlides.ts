import { defineArrayMember, defineField } from "sanity";

// Campo de slides (H1 + imagen) reutilizado en Firm y Pages.
export const titleSlidesField = defineField({
  name: "slides",
  title: "Hero slides",
  description:
    "Title and image per slide. Maximum 5; fewer is fine. Drag to reorder.",
  type: "array",
  of: [
    defineArrayMember({
      type: "object",
      name: "titleSlide",
      title: "Slide",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          description: "H1 shown over this slide.",
          type: "string",
          validation: (rule) => rule.required().error("Title is required"),
        }),
        defineField({
          name: "image",
          title: "Image",
          description: "Full-bleed background. Covers the 800px hero.",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              description: "Describe the image (helps SEO and accessibility).",
              type: "string",
            }),
          ],
          validation: (rule) =>
            rule.required().error("Upload an image for this slide"),
        }),
      ],
      preview: {
        select: {
          title: "title",
          media: "image",
        },
      },
    }),
  ],
  validation: (rule) => rule.max(5).error("Maximum 5 slides"),
});
