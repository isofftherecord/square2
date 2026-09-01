import type { SchemaTypeDefinition } from "sanity";

import { categoria } from "./categoria";
import { proyecto } from "./proyecto";

export const schemaTypes: SchemaTypeDefinition[] = [proyecto, categoria];
