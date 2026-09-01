import { defineQuery } from "next-sanity";

export const projectsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)]
    | order(featured desc, date desc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      mainImage,
      date,
      featured,
      "category": category->{ title, "slug": slug.current }
    }
`);

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    mainImage,
    gallery,
    date,
    client,
    content,
    "category": category->{ title, "slug": slug.current }
  }
`);

export const categoriesQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`);
