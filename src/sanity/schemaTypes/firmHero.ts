import { icons } from "@sanity/icons";
import { defineType } from "sanity";

import { titleSlidesField } from "./titleSlides";

export const firmHero = defineType({
  name: "firmHero",
  title: "Firm — Hero",
  type: "document",
  icon: icons.images,
  fields: [titleSlidesField],
  preview: {
    prepare() {
      return { title: "Firm — Hero" };
    },
  },
});
