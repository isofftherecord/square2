import { icons } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const proyecto = defineType({
  name: "proyecto",
  title: "Proyecto",
  type: "document",
  icon: icons.case,
  fields: [
    defineField({
      name: "titulo",
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
      options: { source: "titulo" },
      validation: (rule) => rule.required().error("Presiona «Generate» para crear la URL"),
    }),
    defineField({
      name: "categoria",
      title: "Categoría",
      description: "¿A qué tipo de proyecto pertenece?",
      type: "reference",
      to: [{ type: "categoria" }],
      validation: (rule) => rule.required().error("Elige una categoría"),
    }),
    defineField({
      name: "resumen",
      title: "Resumen corto",
      description: "Una o dos frases que se muestran en la lista de proyectos.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(200).warning("Mejor si es breve (máx. 200 caracteres)"),
    }),
    defineField({
      name: "imagenPrincipal",
      title: "Imagen principal",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          description: "Describe la imagen (ayuda a Google y a la accesibilidad).",
          type: "string",
        }),
      ],
      validation: (rule) => rule.required().error("Agrega una imagen principal"),
    }),
    defineField({
      name: "galeria",
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
      name: "fecha",
      title: "Fecha del proyecto",
      type: "date",
      options: { dateFormat: "DD-MM-YYYY" },
    }),
    defineField({
      name: "cliente",
      title: "Cliente (opcional)",
      type: "string",
    }),
    defineField({
      name: "contenido",
      title: "Descripción completa",
      description: "El contenido detallado del proyecto. Puedes agregar texto e imágenes.",
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
      name: "destacado",
      title: "¿Proyecto destacado?",
      description: "Los proyectos destacados aparecen primero en la página de inicio.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Fecha (más reciente primero)",
      name: "fechaDesc",
      by: [{ field: "fecha", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "titulo",
      subtitle: "categoria.titulo",
      media: "imagenPrincipal",
    },
  },
});
