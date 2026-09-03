import type { SchemaTypeDefinition } from "sanity";

import { firmHero } from "./firmHero";
import { homeHero } from "./homeHero";
import { project } from "./project";

export const schemaTypes: SchemaTypeDefinition[] = [
  homeHero,
  firmHero,
  project,

];
