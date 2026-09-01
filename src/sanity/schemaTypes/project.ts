import { icons } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  icon: icons.case,
  fields: [
    defineField({
      name: "title",
      title: "Nombre del proyecto",
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
      name: "category",
      title: "Categoría",
      description: "¿A qué tipo de proyecto pertenece?",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required().error("Elige una categoría"),
    }),
    defineField({
      name: "summary",
      title: "Resumen corto",
      description: "Una o dos frases que se muestran en la lista de proyectos.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(200).warning("Mejor si es breve (máx. 200 caracteres)"),
    }),
    defineField({
      name: "mainImage",
      title: "Imagen principal",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          description:
            "Describe la imagen (ayuda a Google y a la accesibilidad).",
          type: "string",
        }),
      ],
      validation: (rule) =>
        rule.required().error("Agrega una imagen principal"),
    }),
    defineField({
      name: "gallery",
      title: "Galería de fotos (opcional)",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "date",
      title: "Fecha del proyecto",
      type: "date",
      options: { dateFormat: "DD-MM-YYYY" },
    }),
    defineField({
      name: "client",
      title: "Cliente (opcional)",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Descripción completa",
      description:
        "El contenido detallado del proyecto. Puedes agregar texto e imágenes.",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "¿Proyecto destacado?",
      description:
        "Los proyectos destacados aparecen primero en la página de inicio.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Fecha (más reciente primero)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
      media: "mainImage",
    },
  },
});
