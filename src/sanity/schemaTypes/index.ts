import type { SchemaTypeDefinition } from "sanity";

import { firmHero } from "./firmHero";
import { firmPartners } from "./firmPartners";
import { firmTeam } from "./firmTeam";
import { homeHero } from "./homeHero";
import { project } from "./project";

export const schemaTypes: SchemaTypeDefinition[] = [
  homeHero,
  firmHero,
  firmTeam,
  firmPartners,
  project,
];
