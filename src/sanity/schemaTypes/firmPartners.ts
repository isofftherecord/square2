import { icons } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const firmPartners = defineType({
  name: "firmPartners",
  title: "Firm — Partners",
  type: "document",
  icon: icons["earth-globe"],
  fields: [
    defineField({
      name: "intro",
      title: "Intro",
      description:
        "Line under the heading. Example: Capital partners, lenders, and advisors Square2 has worked with across the portfolio.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().error("Intro is required"),
    }),
    defineField({
      name: "partners",
      title: "Partners",
      description:
        "Names listed under Partners on the Firm page. Drag to reorder. They fill columns top-to-bottom, left-to-right, kept as even as possible.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "partner",
          title: "Partner",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              description: "Example: Apollo Global Management",
              type: "string",
              validation: (rule) => rule.required().error("Name is required"),
            }),
          ],
          preview: {
            select: { title: "name" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Firm — Partners" };
    },
  },
  initialValue: {
    intro:
      "Capital partners, lenders, and advisors Square2 has worked with across the portfolio.",
    partners: [
      { _type: "partner", name: "Apollo Global Management" },
      { _type: "partner", name: "Blackstone" },
      { _type: "partner", name: "Lone Star Funds" },
      { _type: "partner", name: "Ascentris" },
      { _type: "partner", name: "DRA Advisors" },
      { _type: "partner", name: "Gresham Partners" },
    ],
  },
});
