import type { ReactNode } from "react";

type Metric = {
  value: ReactNode;
  label: string;
};

export function MetricsBar({ items }: { items: Metric[] }) {
  return (
    // Banda de 10 columnas; en desktop las 4 celdas siguen las
    // proporciones de Figma (289 / 267 / 377 / 182). En móvil se apilan.
    <section className="s2-subgrid ">
      <div className="col-span-12 grid grid-cols-1 lg:col-span-10 lg:col-start-2 lg:grid-cols-[289fr_267fr_377fr_182fr]">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`flex flex-col items-start justify-center py-6 px-5 lg:py-5 ${
              index === 0
                ? ""
                : "border-t border-s2-black lg:border-t-0 lg:border-l lg:pl-5"
            }`}
          >
            <p className="text-h2 whitespace-nowrap">{item.value}</p>
            <p className="text-tags mt-2 whitespace-nowrap text-s2-orange">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
