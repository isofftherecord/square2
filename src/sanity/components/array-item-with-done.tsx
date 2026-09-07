import { Box, Button, Flex } from "@sanity/ui";
import { isObjectItemProps, type ItemProps } from "sanity";

// Pie «Done» en el modal de ítems de array. Cierra el diálogo; el draft ya se
// guarda solo. No publica el documento.
export function ArrayItemWithDone(props: ItemProps) {
  if (!isObjectItemProps(props) || !props.onClose) {
    return props.renderDefault(props);
  }

  return props.renderDefault({
    ...props,
    children: (
      <Flex direction="column" gap={5} style={{ minHeight: "100%" }}>
        <Box flex={1}>{props.children}</Box>
        <Flex
          justify="flex-end"
          paddingTop={4}
          paddingBottom={4}
          paddingRight={4}
          style={{
            position: "sticky",
            bottom: 0,
            background: "var(--card-bg-color)",
          }}
        >
          <Button text="Done" tone="primary" type="button" onClick={props.onClose} />
        </Flex>
      </Flex>
    ),
  });
}
