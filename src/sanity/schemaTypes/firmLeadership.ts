import { icons } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const firmLeadership = defineType({
  name: "firmLeadership",
  title: "Firm — Leadership",
  type: "document",
  icon: icons.user,
  fields: [
    defineField({
      name: "people",
      title: "Leadership",
      description:
        "People shown as portrait cards on the Firm page. Drag to reorder. These are the only profiles with a photo.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "leader",
          title: "Person",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              description: "Example: Jay Caplin",
              type: "string",
              validation: (rule) => rule.required().error("Name is required"),
            }),
            defineField({
              name: "role",
              title: "Role",
              description: "Example: Co-Founder & PRINCIPAL",
              type: "string",
              validation: (rule) => rule.required().error("Role is required"),
            }),
            defineField({
              name: "photo",
              title: "Photo",
              description: "Portrait on the card. Leave empty to show the placeholder.",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  description: "Describe the portrait. Defaults to the person's name.",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "email",
              title: "Email",
              description:
                "Address for the Mail button. The button is a mailto link and only appears when this is set. Example: jcaplin@s2c.com",
              type: "email",
            }),
            defineField({
              name: "linkedin",
              title: "LinkedIn",
              description:
                "Profile URL for the LinkedIn button. Example: https://www.linkedin.com/in/name",
              type: "url",
              validation: (rule) =>
                rule
                  .uri({ scheme: ["http", "https"] })
                  .error("Enter a full LinkedIn URL, including https://"),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role", media: "photo" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Firm — Leadership" };
    },
  },
});
