import type { ReactNode } from "react";

type Metric = {
  value: ReactNode;
  label: string;
  /** Columnas en desktop dentro de la banda de 10. */
  span?: 2 | 4;
};

const SPAN_CLASS = {
  2: "lg:col-span-2",
  4: "lg:col-span-4",
} as const;

export function MetricsBar({ items }: { items: Metric[] }) {
  return (
    // 10 columnas centradas; 2 + 2 + 4 + 2. En móvil se apilan.
    <section className="s2-subgrid items-center py-12">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`col-span-12 flex flex-col items-center py-6 text-center lg:py-4 ${SPAN_CLASS[item.span ?? 2]} ${
            index === 0
              ? "lg:col-start-2"
              : "border-t border-s2-black lg:border-t-0 lg:border-l"
          }`}
        >
          <p className="text-h2">{item.value}</p>
          <p className="text-tags mt-2">{item.label}</p>
        </div>
      ))}
    </section>
  );
}
