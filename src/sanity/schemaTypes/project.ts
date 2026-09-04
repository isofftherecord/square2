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

export const PROJECT_STATUSES = [
  { title: "Realized", value: "Realized" },
  { title: "Held", value: "Held" },
  { title: "In progress", value: "In progress" },
] as const;

function altImageFields() {
  return [
    defineField({
      name: "alt",
      title: "Alt text",
      description: "Describe the image (helps SEO and accessibility).",
      type: "string",
    }),
  ];
}

function metricFields() {
  return [
    defineField({
      name: "value",
      title: "Value",
      description: "Example: $90M, 77%, 2.6×",
      type: "string",
    }),
    defineField({
      name: "label",
      title: "Label",
      description: "Example: Acquisition, Leveraged IRR",
      type: "string",
    }),
  ];
}

function metricPreview() {
  return {
    select: { value: "value", label: "label" },
    prepare({ value, label }: { value?: string; label?: string }) {
      return {
        title: value || "Metric",
        subtitle: label,
      };
    },
  };
}

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: icons.case,
  groups: [
    { name: "listing", title: "Listing", default: true },
    { name: "cover", title: "01 Cover" },
    { name: "story", title: "02–04 Story" },
    { name: "exit", title: "05 Exit" },
  ],
  fieldsets: [
    {
      name: "coverFacts",
      title: "Address and facts",
      options: { columns: 2 },
    },
    {
      name: "coverDeal",
      title: "The Deal",
    },
    {
      name: "exitCredits",
      title: "Credits",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Property",
      description: "Property name shown in the projects table. Example: Las Olas Square.",
      type: "string",
      group: "listing",
      validation: (rule) => rule.required().error("Property name is required"),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      description:
        "Generated with the Generate button. You usually don’t need to edit it.",
      type: "slug",
      group: "listing",
      options: { source: "title" },
      validation: (rule) =>
        rule.required().error("Press Generate to create the URL"),
    }),
    defineField({
      name: "market",
      title: "Market",
      description: "City or submarket. Example: Fort Lauderdale.",
      type: "string",
      group: "listing",
      validation: (rule) => rule.required().error("Market is required"),
    }),
    defineField({
      name: "assetClass",
      title: "Class",
      type: "string",
      group: "listing",
      options: { list: [...PROJECT_CLASSES], layout: "radio" },
      validation: (rule) => rule.required().error("Class is required"),
    }),
    defineField({
      name: "squareFootage",
      title: "SF",
      description: "Rentable square footage. Shown with commas, e.g. 267,955.",
      type: "number",
      group: "listing",
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
      group: "listing",
      validation: (rule) => rule.required().error("Year is required"),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      group: "listing",
      options: { list: [...PROJECT_ROLES], layout: "radio" },
      validation: (rule) => rule.required().error("Role is required"),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      description: "One or two sentences for the project page.",
      type: "text",
      rows: 3,
      group: "listing",
      validation: (rule) =>
        rule.max(200).warning("Keep it short (max 200 characters)"),
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      group: "listing",
      options: { hotspot: true },
      fields: altImageFields(),
      validation: (rule) => rule.required().error("Add a main image"),
    }),
    defineField({
      name: "gallery",
      title: "Photo gallery (optional)",
      description:
        "Used when the project has no story chapters. Each image becomes a horizontal panel.",
      type: "array",
      group: "listing",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: altImageFields(),
        }),
      ],
    }),
    defineField({
      name: "content",
      title: "Full description",
      description: "Unused. Story copy now lives in 02–04 Story.",
      type: "array",
      group: "listing",
      hidden: true,
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: altImageFields(),
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured project?",
      description: "Featured projects appear first on the home page.",
      type: "boolean",
      group: "listing",
      initialValue: false,
    }),

    defineField({
      name: "address",
      title: "Address",
      description:
        "Under the title. One line per row. Example: 501 & 515 East Las Olas Boulevard / Downtown Fort Lauderdale.",
      type: "text",
      rows: 3,
      group: "cover",
      fieldset: "coverFacts",
    }),
    defineField({
      name: "owner",
      title: "Owner",
      description: "Example: Square2 / Apollo JV",
      type: "string",
      group: "cover",
      fieldset: "coverFacts",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "cover",
      fieldset: "coverFacts",
      options: { list: [...PROJECT_STATUSES], layout: "radio" },
    }),
    defineField({
      name: "dealHeading",
      title: "Deal heading",
      description: "Defaults to “The Deal.” if you add metrics below.",
      type: "string",
      group: "cover",
      fieldset: "coverDeal",
    }),
    defineField({
      name: "dealMetrics",
      title: "The Deal",
      description:
        "Cover figures. Example: $90M Acquisition, $330 Per square foot.",
      type: "array",
      group: "cover",
      fieldset: "coverDeal",
      of: [
        defineArrayMember({
          type: "object",
          name: "metric",
          title: "Metric",
          fields: metricFields(),
          preview: metricPreview(),
        }),
      ],
    }),

    defineField({
      name: "chapters",
      title: "Story chapters",
      description:
        "One chapter per horizontal panel (02 Out of True, 03 The Work, 04 Squared). Only filled chapters are shown.",
      type: "array",
      group: "story",
      of: [
        defineArrayMember({
          type: "object",
          name: "chapter",
          title: "Chapter",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              description: "Example: Out of True.",
              type: "string",
            }),
            defineField({
              name: "paragraphs",
              title: "Paragraphs",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "paragraph",
                  title: "Paragraph",
                  fields: [
                    defineField({
                      name: "text",
                      title: "Text",
                      type: "text",
                      rows: 4,
                    }),
                    defineField({
                      name: "emphasis",
                      title: "Bold",
                      type: "boolean",
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: { title: "text", emphasis: "emphasis" },
                    prepare({
                      title,
                      emphasis,
                    }: {
                      title?: string;
                      emphasis?: boolean;
                    }) {
                      return {
                        title: title || "Paragraph",
                        subtitle: emphasis ? "Bold" : "Body",
                      };
                    },
                  },
                }),
              ],
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: altImageFields(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
            defineField({
              name: "beforeImage",
              title: "Before image",
              description:
                "If set together with Image, the panel shows a Before / After toggle.",
              type: "image",
              options: { hotspot: true },
              fields: altImageFields(),
            }),
            defineField({
              name: "gallery",
              title: "Extra images",
              description:
                "Optional extra photos in this chapter, with previous / next controls.",
              type: "array",
              of: [
                defineArrayMember({
                  type: "image",
                  options: { hotspot: true },
                  fields: altImageFields(),
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "heading", media: "image" },
            prepare({ title, media }: { title?: string; media?: string }) {
              return { title: title || "Chapter", media };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "exit",
      title: "The exit",
      description: "Optional. Leave blank if this project has no exit story.",
      type: "object",
      group: "exit",
      options: { columns: 1 },
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          description: "Defaults to “The exit.” if other exit fields are filled.",
          type: "string",
        }),
        defineField({
          name: "acquired",
          title: "Acquired",
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              description: "Example: $90M",
              type: "string",
            }),
            defineField({
              name: "line",
              title: "Line",
              description: "Example: 2016 · Acquired",
              type: "string",
            }),
            defineField({
              name: "details",
              title: "Details",
              description: "Example: $330 per square foot",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        }),
        defineField({
          name: "sold",
          title: "Sold",
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              description: "Example: $145.5M",
              type: "string",
            }),
            defineField({
              name: "line",
              title: "Line",
              description: "Example: 2022 · Sold",
              type: "string",
            }),
            defineField({
              name: "details",
              title: "Details",
              description: "Example: $521 per square foot",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        }),
        defineField({
          name: "metrics",
          title: "Exit metrics",
          description: "Example: 2.6× MOIC, 27% Leveraged IRR",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "metric",
              title: "Metric",
              fields: metricFields(),
              preview: metricPreview(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "credits",
      title: "Credits",
      description: "Optional roles shown on the exit panel.",
      type: "array",
      group: "exit",
      fieldset: "exitCredits",
      of: [
        defineArrayMember({
          type: "object",
          name: "credit",
          title: "Credit",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              description: "Example: Acquisition",
              type: "string",
            }),
            defineField({
              name: "detail",
              title: "Detail",
              description: "Example: Sourced and underwritten",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "detail" },
          },
        }),
      ],
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
