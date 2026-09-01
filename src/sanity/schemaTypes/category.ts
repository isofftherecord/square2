import { icons } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  icon: icons.tag,
  fields: [
    defineField({
      name: "title",
      title: "Nombre de la categoría",
      description: "Ej.: Residencial, Comercial, Remodelación…",
      type: "string",
      validation: (rule) => rule.required().error("El nombre es obligatorio"),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      description:
        "Se genera automáticamente con el botón «Generate». No necesitas editarlo.",
      type: "slug",
      options: { source: "title" },
      validation: (rule) =>
        rule.required().error("Presiona «Generate» para crear la URL"),
    }),
    defineField({
      name: "description",
      title: "Descripción (opcional)",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
