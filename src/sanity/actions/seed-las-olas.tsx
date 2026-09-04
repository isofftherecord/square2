import { useDocumentOperation, type DocumentActionComponent } from "sanity";

import {
  LAS_OLAS_SLUG,
  lasOlasSanityPatch,
} from "@/sanity/seed/las-olas-square";

export const SeedLasOlasAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const slug =
    (props.draft as { slug?: { current?: string } } | null)?.slug?.current ??
    (props.published as { slug?: { current?: string } } | null)?.slug?.current;

  if (props.type !== "project" || slug !== LAS_OLAS_SLUG) return null;

  return {
    label: "Fill case study",
    onHandle: () => {
      patch.execute([{ set: lasOlasSanityPatch() }]);
      props.onComplete();
    },
  };
};
