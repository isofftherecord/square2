import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/button";
import { DoubleBlock } from "@/components/double-block";
import { TitleHero } from "@/components/second-hero";
import {
  Partners,
  toPartners,
  type FirmPartnersDoc,
  type Partner,
} from "@/components/partners";
import { Team, toTeamMembers, type FirmTeamDoc, type TeamMember } from "@/components/team";
import { isSanityConfigured } from "@/sanity/env";
import { fetchPublished } from "@/sanity/lib/live";
import {
  firmHeroQuery,
  firmPartnersQuery,
  firmTeamQuery,
} from "@/sanity/lib/queries";
import { toTitleHeroSlides, type TitleHeroDoc } from "@/sanity/lib/title-hero";

// Filas de Figma mientras el documento Firm — Team no está publicado.
const FALLBACK_TEAM: TeamMember[] = [
  { _key: "alexandra-ramirez", name: "Alexandra Ramirez", title: "Operations" },
  { _key: "name-surname", name: "Name Surname", title: "Title" },
];

const FALLBACK_PARTNERS: {
  intro: string;
  partners: Partner[];
} = {
  intro:
    "Capital partners, lenders, and advisors Square2 has worked with across the portfolio.",
  partners: [
    { _key: "apollo", name: "Apollo Global Management" },
    { _key: "blackstone", name: "Blackstone" },
    { _key: "lone-star", name: "Lone Star Funds" },
    { _key: "ascentris", name: "Ascentris" },
    { _key: "dra", name: "DRA Advisors" },
    { _key: "gresham", name: "Gresham Partners" },
  ],
};

// Sin `photo` la tarjeta muestra el placeholder del wireframe.
const LEADERSHIP: {
  name: string;
  role: string;
  photo?: string;
  email?: string;
  linkedin?: string;
}[] = [
  {
    name: "Jay Caplin",
    role: "Co-Founder & PRINCIPAL",
  },
  {
    name: "Michael Manno",
    role: "Co-Founder & PRINCIPAL",
  },
];

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

export const metadata: Metadata = {
  title: "Firm — Square2",
};

export default async function FirmPage() {
  const [slides, teamMembers, partnersDoc] = isSanityConfigured
    ? await Promise.all([
      fetchPublished<TitleHeroDoc | null>(firmHeroQuery).then(toTitleHeroSlides),
      fetchPublished<FirmTeamDoc | null>(firmTeamQuery).then(toTeamMembers),
      fetchPublished<FirmPartnersDoc | null>(firmPartnersQuery).then(
        toPartners,
      ),
    ])
    : [[], undefined, undefined];

  const members = teamMembers ?? FALLBACK_TEAM;
  const { intro, partners } = partnersDoc ?? FALLBACK_PARTNERS;

  return (
    <>
      <TitleHero slides={slides} />
      <DoubleBlock
        space="4"
        space2="5"
        heading="The Firm."
        body={
          <>
            Square2 is a Miami-based, vertically integrated operator and investor. Founded in 2008, in the teeth of the financial crisis, on the view that the firms worth backing are the ones that can still run the building after the capital is in.<br /><br />
            That was not a comfortable year to start. It was a useful one. Every assumption about rent, occupancy and exit was being tested in public, and the firms that came through were the ones close enough to the asset to see the problem early. Square2 has underwritten that way ever since.<br /><br />
            We acquire office, mixed-use, and adaptive re-use assets in Florida markets with high barriers to entry. Submarkets we know at street level, proximate to the people who decide where their companies sit. The list of places we will buy is short, and it does not get longer because capital is available.
          </>
        }

      />

      <section className="s2-subgrid items-center gap-y-4">
        <div className="col-span-12 lg:col-start-2 lg:col-span-10">
          <p className="text-h1">Defined by what we <span className="italic">refuse</span> to be.</p>
        </div>
        <div className="col-span-12 lg:col-start-5 lg:col-span-7 py-8 lg:py-17">
          <p className="text-body py-5">Not the absentee manager who splits attention across buildings and passes the buck.</p>
          <hr className="border-t border-s2-black" />
          <p className="text-body py-5">Not the principal whose ego runs ahead of the partnership.</p>
          <hr className="border-t border-s2-black" />
          <p className="text-body py-5">Not the money-raiser who can't operate the asset once the capital is in.</p>
          <hr className="border-t border-s2-black" />
        </div>
      </section>


      {/* Leadership: 2 tarjetas de 3 columnas, con una columna de aire */}
      <section className="s2-subgrid pt-20">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <h2 className="text-h2">Leadership.</h2>
          <hr className="mt-4 border-t border-s2-black" />

          <ul className="mt-[59px] grid grid-cols-1 gap-x-5 gap-y-14 lg:grid-cols-10">
            {LEADERSHIP.map((person, index) => (
              <li
                key={person.name}
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
                      alt={person.name}
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
                  <LeadershipChip
                    href={person.email ? `mailto:${person.email}` : undefined}
                    icon="/icons/mail.svg"
                    iconWidth={9}
                    label="Mail"
                    className="bg-s2-orange cursor-pointer"
                  />
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

      <Team members={members} />
      <Partners intro={intro} partners={partners} />

      <section className="s2-subgrid items-center pt-5 pb-16 lg:pb-35">
        <div className="col-span-12 lg:col-start-2 lg:col-span-12">
          <p className="text-h1">One team with one <span className="italic">standard</span> out.</p>
        </div>
      </section>

      <section className="col-span-12 ml-[calc(50%-50vw)] w-screen max-w-[100vw] bg-s2-orange">
        <div className="s2-page items-center gap-y-8 py-16 lg:py-20">
          <div className="col-span-12 lg:col-span-5 lg:col-start-2">
            <h2 className="text-h3 text-s2-white">That standard has a method.</h2>
            <p className="text-body mt-5 text-s2-white">How Square2 underwrites, and how it operates once the capital is in.</p>
          </div>

          <Button
            href="/platform"
            className="col-span-12 w-fit lg:col-span-5 lg:justify-self-end"
          >
            HOW WE INVEST AND OPERATE
          </Button>
        </div>
      </section>
    </>
  );
}
