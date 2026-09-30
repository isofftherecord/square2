import { isObjectItemProps, type ItemProps } from "sanity";

const STORY_HEADINGS = ["Out of True.", "The Work.", "Squared."] as const;

// El título no es un campo. El nombre de la fila sigue el puesto en la lista.
export function StoryChapterItem(props: ItemProps) {
  if (!isObjectItemProps(props)) return props.renderDefault(props);

  const heading = STORY_HEADINGS[props.index];
  if (!heading || !props.value) return props.renderDefault(props);

  return props.renderDefault({
    ...props,
    value: { ...props.value, heading },
  });
}
