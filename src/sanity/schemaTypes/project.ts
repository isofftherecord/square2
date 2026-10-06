import { icons } from "@sanity/icons";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import {
  defineArrayMember,
  defineField,
  defineType,
  type ConditionalPropertyCallbackContext,
} from "sanity";
import { StoryChapterItem } from "../components/story-chapter-item";

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
  { title: "Sold and reinvested", value: "Sold and reinvested" },
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
  description:
    "Drag projects in the Projects list to set their order on the site. Featured projects keep that same order on the home page.",
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
    // Rango lexicográfico; lo escribe la lista arrastrable del Studio.
    orderRankField({ type: "project" }),
    defineField({
      name: "role",
      title: "Role",
      description:
        "Choose this first. Owned and Owned & Managed keep the full case study. Managed keeps a single panel: the property hero and Under management. No second panel and no link out to the property.",
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
      description:
        "Only featured projects appear on the home page, in the same order as the Projects list.",
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
      name: "chapters",
      title: "Story chapters",
      description:
        "Three panels, in order: Out of True., The Work., Squared. Titles are fixed. Empty chapters stay off the site.",
      type: "array",
      group: "story",
      hidden: hideOwnedStory,
      initialValue: [
        { _type: "chapter", heading: "Out of True." },
        { _type: "chapter", heading: "The Work." },
        { _type: "chapter", heading: "Squared." },
      ],
      validation: (rule) => rule.max(3),
      of: [
        defineArrayMember({
          type: "object",
          name: "chapter",
          title: "Chapter",
          components: { item: StoryChapterItem },
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              hidden: true,
              readOnly: true,
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
                    defineField({
                      name: "caption",
                      title: "Caption",
                      description: "Orange bar under this extra photo.",
                      type: "string",
                    }),
                  ],
                  preview: {
                    select: {
                      media: "image",
                      before: "beforeImage.asset",
                      alt: "image.alt",
                      caption: "caption",
                    },
                    prepare({
                      media,
                      before,
                      alt,
                      caption,
                    }: {
                      media?: string;
                      before?: string;
                      alt?: string;
                      caption?: string;
                    }) {
                      return {
                        title: caption || alt || "Extra image",
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
  orderings: [orderRankOrdering],
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
