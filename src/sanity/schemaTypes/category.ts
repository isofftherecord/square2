import { icons } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: icons.tag,
  fields: [
    defineField({
      name: "title",
      title: "Category name",
      description: "Example: Residential, Commercial, Renovation…",
      type: "string",
      validation: (rule) => rule.required().error("Name is required"),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      description: "Generated with the Generate button. You usually don’t need to edit it.",
      type: "slug",
      options: { source: "title" },
      validation: (rule) =>
        rule.required().error("Press Generate to create the URL"),
    }),
    defineField({
      name: "description",
      title: "Description (optional)",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
