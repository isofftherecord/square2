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

export const firmTeamQuery = defineQuery(`
  *[_id == "firmTeam"][0] {
    members[] {
      _key,
      name,
      title
    }
  }
`);

export const firmPartnersQuery = defineQuery(`
  *[_id == "firmPartners"][0] {
    intro,
    partners[] {
      _key,
      name
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
      mainImage,
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
        gallery[] {
          _key,
          _type,
          alt,
          asset,
          image,
          beforeImage
        }
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
