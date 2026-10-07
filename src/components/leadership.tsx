import Image from "next/image";

import { hasImageAsset, urlFor } from "@/sanity/lib/image";

export type Leader = {
  _key: string;
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string;
  email?: string;
  linkedin?: string;
};

export type FirmLeadershipDoc = {
  people?: {
    _key: string;
    name?: string;
    role?: string;
    email?: string;
    linkedin?: string;
    photo?: { alt?: string } & Record<string, unknown>;
  }[];
};

export function toLeaders(
  doc: FirmLeadershipDoc | null,
): Leader[] | undefined {
  if (!doc) return undefined;

  return (
    doc.people
      ?.filter(
        (person): person is NonNullable<FirmLeadershipDoc["people"]>[number] & {
          name: string;
          role: string;
        } => Boolean(person._key && person.name && person.role),
      )
      .map((person) => ({
        _key: person._key,
        name: person.name,
        role: person.role,
        photo: hasImageAsset(person.photo)
          ? urlFor(person.photo).width(690).height(632).fit("crop").url()
          : undefined,
        photoAlt: person.photo?.alt?.trim() || person.name,
        email: person.email?.trim() || undefined,
        linkedin: person.linkedin?.trim() || undefined,
      })) ?? []
  );
}

function LeadershipChip({
  href,
  icon,
  iconWidth,
  label,
  className,
}: {
  href?: string;
  icon: string;
  iconWidth: number;
  label: string;
  className: string;
}) {
  const classes = `inline-flex h-5 items-center gap-1.5 px-3 text-navigation text-s2-white ${className}`;
  const content = (
    <>
      <img src={icon} alt="" width={iconWidth} height={7} className="shrink-0" />
      {label}
    </>
  );

  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return <span className={classes}>{content}</span>;
}

type LeadershipProps = {
  people: Leader[];
};

export function Leadership({ people }: LeadershipProps) {
  if (people.length === 0) return null;

  return (
    <section className="s2-subgrid pt-20">
      <div className="col-span-12 lg:col-span-10 lg:col-start-2">
        <h2 className="text-h2">Leadership.</h2>
        <hr className="mt-4 border-t border-s2-black" />

        <ul className="mt-[59px] grid grid-cols-1 gap-x-5 gap-y-14 lg:grid-cols-10">
          {people.map((person, index) => (
            <li
              key={person._key}
              className={
                index === 1 ? "lg:col-span-3 lg:col-start-5" : "lg:col-span-3"
              }
            >
              <h3 className="text-h4">{person.name}</h3>
              <p className="text-body">{person.role}</p>
              <div className="relative mt-[35px] aspect-[345/316] max-w-[345px] border border-s2-black">
                {person.photo ? (
                  <Image
                    src={person.photo}
                    alt={person.photoAlt ?? person.name}
                    fill
                    sizes="345px"
                    className="object-cover"
                  />
                ) : (
                  // Placeholder del wireframe mientras no hay retrato
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 0 L100 100 M100 0 L0 100"
                      fill="none"
                      stroke="currentColor"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}
              </div>
              <div className="mt-4 flex gap-2.5">
                {person.email ? (
                  <LeadershipChip
                    href={`mailto:${person.email}`}
                    icon="/icons/mail.svg"
                    iconWidth={9}
                    label="Mail"
                    className="bg-s2-orange cursor-pointer"
                  />
                ) : null}
                <LeadershipChip
                  href={person.linkedin}
                  icon="/icons/linkedin.svg"
                  iconWidth={10}
                  label="LinkedIn"
                  className="bg-s2-linkedin cursor-pointer"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
