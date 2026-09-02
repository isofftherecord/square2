import type { ReactNode } from "react";

type DoubleBlockProps = {
  heading: ReactNode;
  body: ReactNode;
};

export function DoubleBlock({ heading, body }: DoubleBlockProps) {
  return (
    // 10 columnas centradas (1 vacía a cada lado); en móvil se apilan.
    <section className="s2-subgrid items-center py-30">
      <div className="col-span-12 lg:col-start-2 lg:col-span-5">
        <p className="text-h1">{heading}</p>
      </div>
      <div className="col-span-12 lg:col-span-5">
        <p className="text-body">{body}</p>
      </div>
    </section>
  );
}
