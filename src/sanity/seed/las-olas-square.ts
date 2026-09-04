import type { ProjectSummary } from "@/components/project-index";

export const LAS_OLAS_SLUG = "las-olas-square";
export const LAS_OLAS_DOCUMENT_ID = "9e4cbfce-ef17-4ece-ad2a-b05f23a38978";

export const lasOlasCaseStudy: Pick<
  ProjectSummary,
  | "address"
  | "owner"
  | "status"
  | "dealHeading"
  | "dealMetrics"
  | "chapters"
  | "exit"
  | "credits"
> = {
  address: "501 & 515 East Las Olas Boulevard\nDowntown Fort Lauderdale",
  owner: "Square2 / Apollo JV",
  status: "Realized",
  dealHeading: "The Deal.",
  dealMetrics: [
    { _key: "deal-acquisition", value: "$90M", label: "Acquisition" },
    { _key: "deal-psf", value: "$330", label: "Per square foot" },
    { _key: "deal-leased", value: "77%", label: "Leased at entry" },
    { _key: "deal-irr", value: "27%", label: "Leveraged IRR" },
    { _key: "deal-moic", value: "2.6×", label: "MOIC / six years" },
  ],
  chapters: [
    {
      _key: "chapter-out-of-true",
      heading: "Out of True.",
      caption: "501 East Las Olas — as acquired, 2016",
      paragraphs: [
        {
          _key: "oot-p1",
          text: "SunTrust had held the two buildings for twenty years: a seventeen-story Class A tower from 1992 and a three-story Class C building from 1972, neither meaningfully updated, at 77% leased with rents well below market. In the heart of the strongest office corridor in Fort Lauderdale.",
        },
        {
          _key: "oot-p2",
          text: "Acquired June 2016 from SunTrust in a programmatic joint venture with Apollo Global Management. $90 million. $330 per square foot. Substantially below replacement cost.",
        },
      ],
    },
    {
      _key: "chapter-the-work",
      heading: "The Work.",
      caption: "The urban park between 501 and 515",
      paragraphs: [
        {
          _key: "work-p1",
          text: "An $11 million gut renovation of 501, at $250 per square foot: stripping and reskinning the former bank branch, replacing mechanical, roof, and finishes. A $1 million modernization of 515.",
        },
        {
          _key: "work-p2",
          text: "Between the two buildings, a shaded urban park. Along the frontage, a pedestrian streetscape reconnected to Las Olas Boulevard.",
        },
        {
          _key: "work-p3",
          emphasis: true,
          text: "An $8 million land assemblage sold to Related Group for $22 million.",
        },
        {
          _key: "work-p4",
          emphasis: true,
          text: "Eighteen months of construction, carried out in an occupied building.",
        },
      ],
    },
    {
      _key: "chapter-squared",
      heading: "Squared.",
      caption: "Pedestrian streetscape, Las Olas Boulevard",
      paragraphs: [
        {
          _key: "sq-p1",
          text: "A building is not repositioned by its shell. A tenant meets a lobby, a restroom, a place to hold a meeting, and somewhere to sit outside at one o'clock.",
        },
        {
          _key: "sq-p2",
          text: "515 received a new lobby, rebuilt common areas and restrooms, and an upgraded garage, along with new conference centers and a covered outdoor community space. Between the two buildings, a shaded urban park with restaurant and tenant seating.",
        },
        {
          _key: "sq-p3",
          text: "Occupancy moved from 77% to 94%. Nearly 190,000 square feet leased or renewed at record Las Olas rents. Holland & Knight, Billings Cochran, and Berkowitz Dick & Pollack renewed. Del Frisco's Grille and Spaces signed.",
        },
        {
          _key: "sq-p4",
          emphasis: true,
          text: "The people who underwrote the deal are the people the tenants called.",
        },
      ],
    },
  ],
  exit: {
    heading: "The exit.",
    acquired: {
      value: "$90M",
      line: "2016 · Acquired",
      details: ["$330 per square foot", "77% leased"],
    },
    sold: {
      value: "$145.5M",
      line: "2022 · Sold",
      details: ["$521 per square foot", "94% leased · 5.5% cap"],
    },
    metrics: [
      { _key: "exit-moic", value: "2.6×", label: "MOIC" },
      { _key: "exit-irr", value: "27%", label: "Leveraged IRR" },
      { _key: "exit-equity", value: "$34M", label: "Original equity" },
      { _key: "exit-proceeds", value: "$167M", label: "Gross proceeds" },
    ],
  },
  credits: [
    {
      _key: "credit-acquisition",
      label: "Acquisition",
      detail: "Sourced and underwritten",
    },
    {
      _key: "credit-capital",
      label: "Capital",
      detail: "Joint venture with Apollo",
    },
    {
      _key: "credit-construction",
      label: "Construction",
      detail: "Managed on site",
    },
    {
      _key: "credit-leasing",
      label: "Leasing",
      detail: "Directed, 77% to 94%",
    },
    {
      _key: "credit-am",
      label: "Asset management",
      detail: "Six years to exit",
    },
  ],
};

function hasItems<T>(value?: T[] | null) {
  return Array.isArray(value) && value.length > 0;
}

export function hydrateLasOlas(project: ProjectSummary): ProjectSummary {
  if (project.slug !== LAS_OLAS_SLUG) return project;

  return {
    ...project,
    address: project.address || lasOlasCaseStudy.address,
    owner: project.owner || lasOlasCaseStudy.owner,
    status: project.status || lasOlasCaseStudy.status,
    dealHeading: project.dealHeading || lasOlasCaseStudy.dealHeading,
    dealMetrics: hasItems(project.dealMetrics)
      ? project.dealMetrics
      : lasOlasCaseStudy.dealMetrics,
    chapters: hasItems(project.chapters)
      ? project.chapters
      : lasOlasCaseStudy.chapters,
    exit: project.exit?.acquired || project.exit?.sold || project.exit?.metrics
      ? project.exit
      : lasOlasCaseStudy.exit,
    credits: hasItems(project.credits)
      ? project.credits
      : lasOlasCaseStudy.credits,
  };
}

export function lasOlasSanityPatch() {
  return {
    address: lasOlasCaseStudy.address,
    owner: lasOlasCaseStudy.owner,
    status: lasOlasCaseStudy.status,
    dealHeading: lasOlasCaseStudy.dealHeading,
    dealMetrics: lasOlasCaseStudy.dealMetrics?.map((metric) => ({
      ...metric,
      _type: "metric",
    })),
    chapters: lasOlasCaseStudy.chapters?.map((chapter) => ({
      _type: "chapter",
      _key: chapter._key,
      heading: chapter.heading,
      caption: chapter.caption,
      paragraphs: chapter.paragraphs?.map((paragraph) => ({
        _type: "paragraph",
        _key: paragraph._key,
        text: paragraph.text,
        emphasis: paragraph.emphasis ?? false,
      })),
    })),
    exit: {
      heading: lasOlasCaseStudy.exit?.heading,
      acquired: lasOlasCaseStudy.exit?.acquired,
      sold: lasOlasCaseStudy.exit?.sold,
      metrics: lasOlasCaseStudy.exit?.metrics?.map((metric) => ({
        ...metric,
        _type: "metric",
      })),
    },
    credits: lasOlasCaseStudy.credits?.map((credit) => ({
      ...credit,
      _type: "credit",
    })),
  };
}
