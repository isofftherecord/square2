import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

const DOCUMENT_ID = "9e4cbfce-ef17-4ece-ad2a-b05f23a38978";

const patch = {
  address: "501 & 515 East Las Olas Boulevard\nDowntown Fort Lauderdale",
  owner: "Square2 / Apollo JV",
  status: "Realized",
  dealHeading: "The Deal.",
  dealMetrics: [
    { _key: "deal-acquisition", _type: "metric", value: "$90M", label: "Acquisition" },
    { _key: "deal-psf", _type: "metric", value: "$330", label: "Per square foot" },
    { _key: "deal-leased", _type: "metric", value: "77%", label: "Leased at entry" },
    { _key: "deal-irr", _type: "metric", value: "27%", label: "Leveraged IRR" },
    { _key: "deal-moic", _type: "metric", value: "2.6×", label: "MOIC / six years" },
  ],
  chapters: [
    {
      _key: "chapter-out-of-true",
      _type: "chapter",
      heading: "Out of True.",
      caption: "501 East Las Olas — as acquired, 2016",
      paragraphs: [
        {
          _key: "oot-p1",
          _type: "paragraph",
          text: "SunTrust had held the two buildings for twenty years: a seventeen-story Class A tower from 1992 and a three-story Class C building from 1972, neither meaningfully updated, at 77% leased with rents well below market. In the heart of the strongest office corridor in Fort Lauderdale.",
        },
        {
          _key: "oot-p2",
          _type: "paragraph",
          text: "Acquired June 2016 from SunTrust in a programmatic joint venture with Apollo Global Management. $90 million. $330 per square foot. Substantially below replacement cost.",
        },
      ],
    },
    {
      _key: "chapter-the-work",
      _type: "chapter",
      heading: "The Work.",
      caption: "The urban park between 501 and 515",
      paragraphs: [
        {
          _key: "work-p1",
          _type: "paragraph",
          text: "An $11 million gut renovation of 501, at $250 per square foot: stripping and reskinning the former bank branch, replacing mechanical, roof, and finishes. A $1 million modernization of 515.",
        },
        {
          _key: "work-p2",
          _type: "paragraph",
          text: "Between the two buildings, a shaded urban park. Along the frontage, a pedestrian streetscape reconnected to Las Olas Boulevard.",
        },
        {
          _key: "work-p3",
          _type: "paragraph",
          emphasis: true,
          text: "An $8 million land assemblage sold to Related Group for $22 million.",
        },
        {
          _key: "work-p4",
          _type: "paragraph",
          emphasis: true,
          text: "Eighteen months of construction, carried out in an occupied building.",
        },
      ],
    },
    {
      _key: "chapter-squared",
      _type: "chapter",
      heading: "Squared.",
      caption: "Pedestrian streetscape, Las Olas Boulevard",
      paragraphs: [
        {
          _key: "sq-p1",
          _type: "paragraph",
          text: "A building is not repositioned by its shell. A tenant meets a lobby, a restroom, a place to hold a meeting, and somewhere to sit outside at one o'clock.",
        },
        {
          _key: "sq-p2",
          _type: "paragraph",
          text: "515 received a new lobby, rebuilt common areas and restrooms, and an upgraded garage, along with new conference centers and a covered outdoor community space. Between the two buildings, a shaded urban park with restaurant and tenant seating.",
        },
        {
          _key: "sq-p3",
          _type: "paragraph",
          text: "Occupancy moved from 77% to 94%. Nearly 190,000 square feet leased or renewed at record Las Olas rents. Holland & Knight, Billings Cochran, and Berkowitz Dick & Pollack renewed. Del Frisco's Grille and Spaces signed.",
        },
        {
          _key: "sq-p4",
          _type: "paragraph",
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
      line: "June 2016 · Acquired",
      details: ["$330 per square foot", "77% leased"],
    },
    sold: {
      value: "$145.5M",
      line: "March 2022 · Sold",
      details: ["$521 per square foot", "94% leased · 5.5% cap"],
    },
    metrics: [
      { _key: "exit-moic", _type: "metric", value: "2.6×", label: "MOIC" },
      { _key: "exit-irr", _type: "metric", value: "27%", label: "Leveraged IRR" },
      { _key: "exit-equity", _type: "metric", value: "$34M", label: "Original equity" },
      { _key: "exit-proceeds", _type: "metric", value: "$167M", label: "Gross proceeds" },
    ],
  },
  credits: [
    { _key: "credit-acquisition", _type: "credit", label: "Acquisition", detail: "Sourced and underwritten" },
    { _key: "credit-capital", _type: "credit", label: "Capital", detail: "Joint venture with Apollo" },
    { _key: "credit-construction", _type: "credit", label: "Construction", detail: "Managed on site" },
    { _key: "credit-leasing", _type: "credit", label: "Leasing", detail: "Directed, 77% to 94%" },
    { _key: "credit-am", _type: "credit", label: "Asset management", detail: "Six years to exit" },
  ],
};

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}

if (!token) {
  console.error("Missing SANITY_API_TOKEN (Editor or Admin write token).");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-09-01",
  token,
  useCdn: false,
});

await client.patch(DOCUMENT_ID).set(patch).commit();
console.log(`Seeded case study on ${DOCUMENT_ID}`);
