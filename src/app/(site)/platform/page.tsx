import type { Metadata } from "next";
import { Button } from "@/components/button";
import { DoubleBlock } from "@/components/double-block";
import { TitleHero, type TitleHeroSlide } from "@/components/second-hero";
import { Cta } from "@/components/cta";
export const metadata: Metadata = {
  title: "Platform — Square2",
};

// Slides del hero: se editan aquí, no vienen del CMS.
const slides: TitleHeroSlide[] = [
  {
    title: "Two halves, one discipline.",
    src: "/heroes/Hero-Platform.png",
    alt: "Square2 platform",
  },
];

export default function PlatformPage() {
  return <><TitleHero slides={slides} />

    <DoubleBlock
      headingAs="h2"
      space="4"
      space2="7"
      heading={<>
        The people who <span className="italic">underwrite</span> it are the people who <span className="italic">run it.</span>
      </>
      }
      body={
        <>
SQUARE2 acquires and repositions office, mixed-use, and adaptive reuse assets across Florida's core submarkets. It also operates buildings: its own, and buildings owned by other people. That combination is less common than it sounds.          <br /><br />
The arrangement has a practical consequence. What the operating team learns about a building goes into how the next acquisition is underwritten. What the underwriting assumes at the point of purchase is tested every day by the people running the asset. Neither side can make a claim the other will not have to support.          <br /><br />
          <span className="font-bold">That is what one discipline means.</span>
        </>
      }

    />

    <section className="s2-subgrid items-start gap-y-12 py-10">

      <div className="col-span-12 lg:col-span-5 lg:col-start-2">
        <p className="text-h3">Investment</p>
        <hr className="border-t border-s2-black mt-5 max-w-[465px]"  />
        <p className="text-body pt-5">Office, mixed-use, and adaptive reuse across Florida's core submarkets, sourced on and off-market and underwritten below replacement cost. Repositioning that extends to the building's name, its identity, and how it is marketed, not only its systems and finishes.</p>

        <Button href="/portfolio" variant="text" className="mt-7 text-navigation">THE ASSETS WE OWN </Button>

      </div>
      <div className="col-span-12 lg:col-span-5">
        <p className="text-h3">Property Management</p>
        <hr className="border-t border-s2-black  mt-5  max-w-[465px]" />
        <p className="text-body pt-5">Dedicated on-site teams. Managers accountable for the financials, not only the finishes. Experience governance at every point of entry, proactive rather than reactive maintenance, and the protection of how a building is perceived by its tenants, its market, and its owner.
        </p>
        <Button href="/portfolio" variant="text" className="mt-7 text-navigation">THE ASSETS WE OPERATE </Button>

      </div>
    </section>

    <section className="s2-subgrid py-12 lg:py-30">
      <img src="/heroes/platform.png" alt="Platform" className="col-span-12 h-[240px] w-full object-cover lg:col-span-10 lg:col-start-2 lg:h-[560px]"  />

    </section>
    {/* Investment Criteria: banda a sangre; contenido en columnas 2–11 (span 10). */}
    <section className="col-span-12 ml-[calc(50%-50vw)] w-screen max-w-[100vw] bg-s2-fog ">
      <div className="s2-page py-16 lg:py-30">
        <h2 className="text-h2 col-span-12 lg:col-start-2 lg:col-span-10">
          Investment Criteria.
        </h2>

        <dl className="s2-subgrid pt-12">
          <div className="col-span-12 grid grid-cols-1 gap-y-2 border-b border-s2-black py-6 lg:col-start-2 lg:col-span-10 lg:grid-cols-subgrid lg:gap-y-0">
            <dt className="text-data text-s2-orange lg:col-span-3">What we buy</dt>
            <dd className="text-body lg:col-span-7">
            Office, mixed-use, and adaptive reuse assets.
            </dd>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-y-2 border-b border-s2-black py-6 lg:col-start-2 lg:col-span-10 lg:grid-cols-subgrid lg:gap-y-0">
            <dt className="text-data text-s2-orange lg:col-span-3">Where</dt>
            <dd className="lg:col-span-7">
              <p className="text-body">
              Major Florida markets with high barriers to entry. Submarkets proximate to where the people making the decision already live.
              </p>
              <p className="text-body mt-4">
              <b>An inch wide and a mile deep.</b>
              </p>
            </dd>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-y-2 border-b border-s2-black py-6 lg:col-start-2 lg:col-span-10 lg:grid-cols-subgrid lg:gap-y-0">
            <dt className="text-data text-s2-orange lg:col-span-3">How we find it</dt>
            <dd className="text-body lg:col-span-7">
            On and off-market, through principal relationships.
            </dd>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-y-2 border-b border-s2-black py-6 lg:col-start-2 lg:col-span-10 lg:grid-cols-subgrid lg:gap-y-0">
            <dt className="text-data text-s2-orange lg:col-span-3">
            WHAT WE UNDERWRITE TO (LIRR)
            </dt>
            <dd className="text-body lg:col-span-7">Value-add, 14 to 18 percent. Opportunistic, 19 percent and above.
            </dd>
          </div>


          <div className="col-span-12 grid grid-cols-1 gap-y-2 border-b border-s2-black py-6 lg:col-start-2 lg:col-span-10 lg:grid-cols-subgrid lg:gap-y-0">
            <dt className="text-data text-s2-orange lg:col-span-3">
            HOW WE REPOSITION
            </dt>
            <dd className="text-body lg:col-span-7">The building and its brand. Renamed, rebranded, and the marketing rebuilt.
            </dd>
          </div>


        </dl>
      </div>
    </section>

    <DoubleBlock
      headingAs="h1"
      space="4"
      space2="7"

      heading={<>
        An owner's stake, not a <span className="italic">fee.</span>
      </>
      }
      body={
        <>
        The fee-only model pays for attendance. An owner's stake pays for outcomes. SQUARE2 makes decisions at acquisition and on site the way an owner makes them, because on most of these assets we are one. On the rest, we behave as though we were.
        </>
      }

    />


    <Cta />

  </>;
}
