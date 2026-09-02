import { icons } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const PROJECT_CLASSES = [
  { title: "Office", value: "Office" },
  { title: "Mixed-use", value: "Mixed-use" },
  { title: "Adaptive re-use", value: "Adaptive re-use" },
] as const;

export const PROJECT_ROLES = [
  { title: "Owned", value: "Owned" },
  { title: "Managed", value: "Managed" },
] as const;

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: icons.case,
  fields: [
    defineField({
      name: "title",
      title: "Property",
      description: "Property name shown in the projects table. Example: Las Olas Square.",
      type: "string",
      validation: (rule) => rule.required().error("Property name is required"),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      description:
        "Generated with the Generate button. You usually don’t need to edit it.",
      type: "slug",
      options: { source: "title" },
      validation: (rule) =>
        rule.required().error("Press Generate to create the URL"),
    }),
    defineField({
      name: "market",
      title: "Market",
      description: "City or submarket. Example: Fort Lauderdale.",
      type: "string",
      validation: (rule) => rule.required().error("Market is required"),
    }),
    defineField({
      name: "assetClass",
      title: "Class",
      type: "string",
      options: { list: [...PROJECT_CLASSES], layout: "radio" },
      validation: (rule) => rule.required().error("Class is required"),
    }),
    defineField({
      name: "squareFootage",
      title: "SF",
      description: "Rentable square footage. Shown with commas, e.g. 267,955.",
      type: "number",
      validation: (rule) =>
        rule
          .required()
          .integer()
          .min(1)
          .error("Enter square footage as a whole number"),
    }),
    defineField({
      name: "years",
      title: "Year",
      description: "Year or range. Example: 2016–2022",
      type: "string",
      validation: (rule) => rule.required().error("Year is required"),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: { list: [...PROJECT_ROLES], layout: "radio" },
      validation: (rule) => rule.required().error("Role is required"),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      description: "One or two sentences for the project page.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(200).warning("Keep it short (max 200 characters)"),
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
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
      validation: (rule) => rule.required().error("Add a main image"),
    }),
    defineField({
      name: "gallery",
      title: "Photo gallery (optional)",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "content",
      title: "Full description",
      description: "Detailed project content. You can add text and images.",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured project?",
      description: "Featured projects appear first on the home page.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Featured first",
      name: "featuredDesc",
      by: [
        { field: "featured", direction: "desc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      market: "market",
      role: "role",
      media: "mainImage",
    },
    prepare({ title, market, role, media }) {
      return {
        title,
        subtitle: [market, role].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
