export type Partner = {
  _key: string;
  name: string;
};

export type FirmPartnersDoc = {
  intro?: string;
  partners?: {
    _key: string;
    name?: string;
  }[];
};

export function toPartners(doc: FirmPartnersDoc | null):
  | { intro: string; partners: Partner[] }
  | undefined {
  if (!doc) return undefined;

  return {
    intro: doc.intro?.trim() ?? "",
    partners:
      doc.partners
        ?.filter(
          (partner): partner is Partner =>
            Boolean(partner._key && partner.name),
        )
        .map((partner) => ({
          _key: partner._key,
          name: partner.name,
        })) ?? [],
  };
}

const COLUMN_COUNT = 3;

const DEFAULT_INTRO =
  "Capital partners, lenders, and advisors Square2 has worked with across the portfolio.";

/**
 * Reparte N ítems en `columnCount` columnas lo más parejas posible.
 * El resto (N % columnas) se suma de izquierda a derecha, como en Figma:
 * 6 → 2-2-2, 7 → 3-2-2, 8 → 3-3-2, 5 → 2-2-1.
 */
export function splitIntoColumns<T>(items: T[], columnCount: number): T[][] {
  const base = Math.floor(items.length / columnCount);
  const remainder = items.length % columnCount;
  const columns: T[][] = [];
  let offset = 0;

  for (let i = 0; i < columnCount; i++) {
    const size = base + (i < remainder ? 1 : 0);
    columns.push(items.slice(offset, offset + size));
    offset += size;
  }

  return columns;
}

type PartnersProps = {
  intro?: string;
  partners: Partner[];
};

export function Partners({ intro, partners }: PartnersProps) {
  if (partners.length === 0) return null;

  const description = intro?.trim() || DEFAULT_INTRO;
  const columns = splitIntoColumns(partners, COLUMN_COUNT);

  return (
    <section className="s2-subgrid pt-20 pb-20">
      <div className="col-span-12 lg:col-span-10 lg:col-start-2">
        <h2 className="text-h2">Partners.</h2>
        {/* 30px bajo el H2, igual que Team y Figma */}
        <hr className="mt-[30px] border-t border-s2-black" />

        <div className="mt-9 grid grid-cols-1 lg:grid-cols-10 lg:gap-x-5">
          <p className="text-body lg:col-span-6">{description}</p>
        </div>

        {/* Móvil: una sola columna, en el orden de Sanity */}
        <ul className="mt-9 flex flex-col gap-5 lg:hidden">
          {partners.map((partner) => (
            <li key={partner._key} className="text-metrics">
              {partner.name}
            </li>
          ))}
        </ul>

        {/* Desktop: 3 columnas de la banda de 10, cantidades niveladas */}
        <div className="mt-9 hidden lg:grid lg:grid-cols-3 lg:gap-x-5">
          {columns.map((column, index) => (
            <ul key={index} className="flex flex-col gap-5">
              {column.map((partner) => (
                <li key={partner._key} className="text-metrics">
                  {partner.name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
