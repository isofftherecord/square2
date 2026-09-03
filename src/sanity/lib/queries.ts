import { defineQuery } from "next-sanity";

export const homeHeroQuery = defineQuery(`
  *[_id == "homeHero"][0] {
    slides[] {
      _key,
      property,
      year,
      image
    }
  }
`);

export const firmHeroQuery = defineQuery(`
  *[_id == "firmHero"][0] {
    slides[] {
      _key,
      title,
      image
    }
  }
`);

export const projectsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)]
    | order(featured desc, title asc) {
      _id,
      title,
      "slug": slug.current,
      market,
      assetClass,
      squareFootage,
      years,
      role,
      summary,
      mainImage,
      featured
    }
`);

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    market,
    assetClass,
    squareFootage,
    years,
    role,
    summary,
    mainImage,
    gallery,
    content
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
