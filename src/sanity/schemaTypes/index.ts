import type { SchemaTypeDefinition } from "sanity";

import { category } from "./category";
import { firmHero } from "./firmHero";
import { homeHero } from "./homeHero";
import { page } from "./page";
import { project } from "./project";

export const schemaTypes: SchemaTypeDefinition[] = [
  homeHero,
  firmHero,
  page,
  project,
  category,
];
