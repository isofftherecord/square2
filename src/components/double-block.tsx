import type { ReactNode } from "react";

type HeadingLevel = "h1" | "h2";
type Space = "4" | "5";
type Space2 = "5" | "7";
type DoubleBlockProps = {
  heading: ReactNode;
  body: ReactNode;
  headingAs?: HeadingLevel;
  space?: Space;
  space2?: Space2;
};

const headingClass: Record<HeadingLevel, string> = {
  h1: "text-h1",
  h2: "text-h2",
};

const spanClasses: Record<number, string> = {
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  7: 'lg:col-start-7',

  // ...add whatever values `space` can actually take
};

export function DoubleBlock({
  heading,
  body,
  headingAs = "h1",
  space = "5",
  space2 = "7",
}: DoubleBlockProps) {
  const Heading = headingAs;

  return (
    // 10 columnas centradas (1 vacía a cada lado); en móvil se apilan.
    <section className="s2-subgrid items-start py-30">
    <div className={`col-span-12 lg:col-start-2 ${spanClasses[space]} max-w-[507px]`}>
        <Heading className={headingClass[headingAs]}>{heading}</Heading>
      </div>
      <div className={`col-span-12 lg:col-start-6 ${spanClasses[space2]} lg:col-span-5`}>
        <p className="text-body">{body}</p>
      </div>
    </section>
  );
}
