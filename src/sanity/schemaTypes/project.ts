import { icons } from "@sanity/icons";
import {
  defineArrayMember,
  defineField,
  defineType,
  type ConditionalPropertyCallbackContext,
} from "sanity";

export const PROJECT_CLASSES = [
  { title: "Office", value: "Office" },
  { title: "Mixed-use", value: "Mixed-use" },
  { title: "Adaptive re-use", value: "Adaptive re-use" },
] as const;

export const PROJECT_ROLES = [
  { title: "Owned", value: "Owned" },
  { title: "Managed", value: "Managed" },
  { title: "Owned & Managed", value: "Owned & Managed" },
] as const;

export const PROJECT_STATUSES = [
  { title: "Realized", value: "Realized" },
  { title: "Held", value: "Held" },
  { title: "In progress", value: "In progress" },
  { title: "Under management", value: "Under management" },
] as const;

function roleOf(document: ConditionalPropertyCallbackContext["document"]) {
  if (!document) return undefined;
  const role = (document as { role?: unknown }).role;
  return typeof role === "string" ? role : undefined;
}

// Owned y Owned & Managed comparten el caso práctico completo.
function isOwnedStory(role?: string) {
  return role === "Owned" || role === "Owned & Managed";
}

function hideUntilRole({ document }: ConditionalPropertyCallbackContext) {
  return !roleOf(document);
}

function hideOwnedStory({ document }: ConditionalPropertyCallbackContext) {
  return !isOwnedStory(roleOf(document));
}

function hideManagedOnly({ document }: ConditionalPropertyCallbackContext) {
  return roleOf(document) !== "Managed";
}

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
    {
      name: "cover",
      title: "Property hero + The Deal.",
      hidden: ({ document }) => !isOwnedStory(roleOf(document)),
    },
    {
      name: "managedCover",
      title: "Property hero + Under management.",
      hidden: ({ document }) => roleOf(document) !== "Managed",
    },
    {
      name: "story",
      title: "02–04 Story",
      hidden: ({ document }) => !isOwnedStory(roleOf(document)),
    },
    {
      name: "exit",
      title: "05 Exit",
      hidden: ({ document }) => !isOwnedStory(roleOf(document)),
    },
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
      title: "In house.",
    },
  ],
  fields: [
    defineField({
      name: "role",
      title: "Role",
      description:
        "Choose this first. Owned and Owned & Managed keep the full case study. Managed keeps only the short property details.",
      type: "string",
      group: "listing",
      options: { list: [...PROJECT_ROLES], layout: "radio" },
      validation: (rule) => rule.required().error("Role is required"),
    }),
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
      hidden: hideUntilRole,
      validation: (rule) =>
        rule.required().error("Press Generate to create the URL"),
    }),
    defineField({
      name: "market",
      title: "Market",
      description: "City or submarket. Example: Fort Lauderdale.",
      type: "string",
      group: "listing",
      hidden: hideUntilRole,
      validation: (rule) => rule.required().error("Market is required"),
    }),
    defineField({
      name: "assetClass",
      title: "Class",
      type: "string",
      group: "listing",
      hidden: hideUntilRole,
      options: { list: [...PROJECT_CLASSES], layout: "radio" },
    }),
    defineField({
      name: "squareFootage",
      title: "SF",
      description: "Rentable square footage. Shown with commas, e.g. 267,955.",
      type: "number",
      group: "listing",
      hidden: hideUntilRole,
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
      description: "Year or range. Example: 2016–2022. Leave blank to hide it.",
      type: "string",
      group: "listing",
      hidden: hideUntilRole,
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      description: "Photo in the projects table. No caption.",
      type: "image",
      group: "listing",
      hidden: hideUntilRole,
      options: { hotspot: true },
      fields: altImageFields(),
      validation: (rule) => rule.required().error("Add a main image"),
    }),
    defineField({
      name: "featured",
      title: "Featured project?",
      description: "Featured projects appear first on the home page.",
      type: "boolean",
      group: "listing",
      hidden: hideUntilRole,
      initialValue: false,
    }),

    defineField({
      name: "address",
      title: "Address",
      description:
        "Under the title. One line per row. Example: 501 & 515 East Las Olas Boulevard / Downtown Fort Lauderdale.",
      type: "text",
      rows: 3,
      group: ["cover", "managedCover"],
      fieldset: "coverFacts",
      hidden: hideUntilRole,
    }),
    defineField({
      name: "owner",
      title: "Owner",
      description: "Example: SQUARE2 / Apollo JV",
      type: "string",
      group: "cover",
      fieldset: "coverFacts",
      hidden: hideOwnedStory,
    }),
    defineField({
      name: "scope",
      title: "Scope",
      description: "What SQUARE2 runs here. Example: Leasing and operations.",
      type: "string",
      group: "managedCover",
      fieldset: "coverFacts",
      hidden: hideManagedOnly,
    }),
    defineField({
      name: "status",
      title: "Status",
      description: "Managed properties use Under management.",
      type: "string",
      group: ["cover", "managedCover"],
      fieldset: "coverFacts",
      hidden: hideUntilRole,
      options: { list: [...PROJECT_STATUSES], layout: "radio" },
    }),
    defineField({
      name: "dealHeading",
      title: "Deal heading",
      description: "Defaults to “The Deal.” if you add metrics below.",
      type: "string",
      group: ["cover", "managedCover"],
      fieldset: "coverDeal",
      hidden: hideUntilRole,
    }),
    defineField({
      name: "dealMetrics",
      title: "The Deal",
      description:
        "Cover figures. Example: $90M Acquisition, $330 Per square foot.",
      type: "array",
      group: ["cover", "managedCover"],
      fieldset: "coverDeal",
      hidden: hideUntilRole,
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
      name: "buildingImage",
      title: "Building image",
      description: "Photo on The building panel. The caption is the orange bar.",
      type: "image",
      group: "managedCover",
      hidden: hideManagedOnly,
      options: { hotspot: true },
      fields: [
        ...altImageFields(),
        defineField({
          name: "caption",
          title: "Caption",
          description: "Orange bar under the photo.",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "buildingHeading",
      title: "Building heading",
      description: "Defaults to “The building.”",
      type: "string",
      group: "managedCover",
      initialValue: "The building.",
      hidden: hideManagedOnly,
    }),
    defineField({
      name: "buildingSummary",
      title: "The building",
      description:
        "Two sentences: what it is, where it sits, and what SQUARE2 runs there.",
      type: "text",
      rows: 4,
      group: "managedCover",
      hidden: hideManagedOnly,
    }),

    defineField({
      name: "chapters",
      title: "Story chapters",
      description:
        "One chapter per horizontal panel (02 Out of True, 03 The Work, 04 Squared). Only filled chapters are shown.",
      type: "array",
      group: "story",
      hidden: hideOwnedStory,
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
                "If set together with Image, the panel shows a Before / After comparison slider.",
              type: "image",
              options: { hotspot: true },
              fields: altImageFields(),
            }),
            defineField({
              name: "gallery",
              title: "Extra images",
              description:
                "Optional extra photos. Add After only for a single image, or After and Before for a comparison slider.",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "galleryImage",
                  title: "Image",
                  fields: [
                    defineField({
                      name: "image",
                      title: "After",
                      description:
                        "Shown alone if Before is empty.",
                      type: "image",
                      options: { hotspot: true },
                      fields: altImageFields(),
                    }),
                    defineField({
                      name: "beforeImage",
                      title: "Before",
                      description:
                        "If set together with After, this extra shows a Before / After slider.",
                      type: "image",
                      options: { hotspot: true },
                      fields: altImageFields(),
                    }),
                  ],
                  preview: {
                    select: {
                      media: "image",
                      before: "beforeImage.asset",
                      alt: "image.alt",
                    },
                    prepare({
                      media,
                      before,
                      alt,
                    }: {
                      media?: string;
                      before?: string;
                      alt?: string;
                    }) {
                      return {
                        title: alt || "Extra image",
                        subtitle: before ? "Before / After" : "After",
                        media,
                      };
                    },
                  },
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
      hidden: hideOwnedStory,
      options: { columns: 1 },
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          description: "Defaults to “The exit.” if other exit fields are filled.",
          type: "string",
        }),
        defineField({
          name: "notes",
          title: "Notes",
          description: "Paragraph under the exit title.",
          type: "text",
          rows: 4,
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
        defineField({
          name: "proceedsNote",
          title: "Proceeds note",
          description:
            "Micro footnote under the exit metrics. Example: Sale price is the building. Gross proceeds include the $22M land assemblage.",
          type: "text",
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: "creditsIntro",
      title: "Intro",
      description:
        "Paragraph above the list. Example: Cradle to grave. The people who underwrote the acquisition…",
      type: "text",
      rows: 4,
      group: "exit",
      fieldset: "exitCredits",
      hidden: hideOwnedStory,
    }),
    defineField({
      name: "credits",
      title: "In house.",
      description: "Optional roles shown on the exit panel.",
      type: "array",
      group: "exit",
      fieldset: "exitCredits",
      hidden: hideOwnedStory,
      of: [
        defineArrayMember({
          type: "object",
          name: "credit",
          title: "Role",
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
