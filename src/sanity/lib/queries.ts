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
      gallery,
      featured,
      address,
      owner,
      status,
      dealHeading,
      dealMetrics[] { _key, value, label },
      chapters[] {
        _key,
        heading,
        paragraphs[] { _key, text, emphasis },
        image,
        caption,
        beforeImage,
        gallery
      },
      exit {
        heading,
        acquired { value, line, details },
        sold { value, line, details },
        metrics[] { _key, value, label }
      },
      credits[] { _key, label, detail }
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
    content,
    address,
    owner,
    status,
    dealHeading,
    dealMetrics[] { _key, value, label },
    chapters[] {
      _key,
      heading,
      paragraphs[] { _key, text, emphasis },
      image,
      caption,
      beforeImage,
      gallery
    },
    exit {
      heading,
      acquired { value, line, details },
      sold { value, line, details },
      metrics[] { _key, value, label }
    },
    credits[] { _key, label, detail }
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
