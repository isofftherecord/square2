import { icons } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoria = defineType({
  name: "categoria",
  title: "Categoría",
  type: "document",
  icon: icons.tag,
  fields: [
    defineField({
      name: "titulo",
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
      options: { source: "titulo" },
      validation: (rule) => rule.required().error("Presiona «Generate» para crear la URL"),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción (opcional)",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "descripcion" },
  },
});
