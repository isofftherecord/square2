import type { SchemaTypeDefinition } from "sanity";

import { firmHero } from "./firmHero";
import { firmLeadership } from "./firmLeadership";
import { firmPartners } from "./firmPartners";
import { firmTeam } from "./firmTeam";
import { homeHero } from "./homeHero";
import { project } from "./project";

export const schemaTypes: SchemaTypeDefinition[] = [
  homeHero,
  firmHero,
  firmLeadership,
  firmTeam,
  firmPartners,
  project,
];
