import { icons } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const firmTeam = defineType({
  name: "firmTeam",
  title: "Firm — Team",
  type: "document",
  icon: icons.users,
  fields: [
    defineField({
      name: "members",
      title: "Team",
      description:
        "People listed under Team on the Firm page. Drag to reorder.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "teamMember",
          title: "Person",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              description: "Example: Alexandra Ramirez",
              type: "string",
              validation: (rule) => rule.required().error("Name is required"),
            }),
            defineField({
              name: "title",
              title: "Title",
              description: "Example: Operations",
              type: "string",
              validation: (rule) => rule.required().error("Title is required"),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "title" },
          },
        }),
      ],
      initialValue: [
        { _type: "teamMember", name: "Alexandra Ramirez", title: "Operations" },
        { _type: "teamMember", name: "Name Surname", title: "Title" },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Firm — Team" };
    },
  },
});
