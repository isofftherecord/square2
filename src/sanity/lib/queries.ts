import { defineQuery } from "next-sanity";

export const proyectosQuery = defineQuery(`
  *[_type == "proyecto" && defined(slug.current)]
    | order(destacado desc, fecha desc) {
      _id,
      titulo,
      "slug": slug.current,
      resumen,
      imagenPrincipal,
      fecha,
      destacado,
      "categoria": categoria->{ titulo, "slug": slug.current }
    }
`);

export const proyectoPorSlugQuery = defineQuery(`
  *[_type == "proyecto" && slug.current == $slug][0] {
    _id,
    titulo,
    "slug": slug.current,
    resumen,
    imagenPrincipal,
    galeria,
    fecha,
    cliente,
    contenido,
    "categoria": categoria->{ titulo, "slug": slug.current }
  }
`);

export const categoriasQuery = defineQuery(`
  *[_type == "categoria" && defined(slug.current)] | order(titulo asc) {
    _id,
    titulo,
    "slug": slug.current,
    descripcion
  }
`);
