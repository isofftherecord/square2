import type { ReactNode } from "react";

type HeadingLevel = "h1" | "h2";

type DoubleBlockProps = {
  heading: ReactNode;
  body: ReactNode;
  headingAs?: HeadingLevel;
  space?: string;
};

const headingClass: Record<HeadingLevel, string> = {
  h1: "text-h1",
  h2: "text-h2",
};

const spanClasses: Record<number, string> = {
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',

  // ...add whatever values `space` can actually take
};

export function DoubleBlock({
  heading,
  body,
  headingAs = "h1",
  space = "lg:col-span-5",
}: DoubleBlockProps) {
  const Heading = headingAs;

  return (
    // 10 columnas centradas (1 vacía a cada lado); en móvil se apilan.
    <section className="s2-subgrid items-start py-30">
    <div className={`col-span-12 lg:col-start-2 lg:col-span-5`}>
        <Heading className={headingClass[headingAs]}>{heading}</Heading>
      </div>
      <div className="col-span-12 lg:col-span-5">
        <p className="text-body">{body}</p>
      </div>
    </section>
  );
}
