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
        The people who underwrite it are the people who run it.
      </>
      }
      body={
        <>
          Square2 acquires and repositions office and mixed-use real estate across Florida's core submarkets. It also operates buildings; its own, and buildings owned by other people. That combination is less common than it sounds.
          <br /><br />
          The arrangement has a practical consequence. What the operating team learns about a building goes into how the next acquisition is underwritten. What the underwriting assumes at the point of purchase is tested every day by the people running the asset. Neither side can make a claim the other will not have to support.
          <br /><br />
          <span className="font-bold">That is what one discipline means.</span>
        </>
      }

    />

    <section className="s2-subgrid items-start py-10 ">

      <div className="lg:col-start-2 lg:col-span-5 ">
        <p className="text-h3">The Investor’s Eye</p>
        <hr className="border-t border-s2-black mt-5 max-w-[465px]"  />
        <p className="text-body pt-5">Office, mixed-use, and adaptive re-use across Florida's core submarkets. Sourced off-market through principal relationships. Underwritten below replacement cost, with a thesis built from the submarket up. Value-add through opportunistic returns.</p>
        <Button href="/portfolio" variant="text" className="mt-7 text-navigation">THE ASSETS WE OWN </Button>

      </div>
      <div className="col-span-12 lg:col-span-5">
        <p className="text-h3">The Owner’s Hand</p>
        <hr className="border-t border-s2-black  mt-5  max-w-[465px]" />
        <p className="text-body pt-5">Dedicated on-site teams. Managers accountable for the financials, not only the finishes. Experience governance at every point of entry, proactive rather than reactive maintenance, and the protection of how a building is perceived by its tenants, its market, and its owner.</p>
        <Button href="/portfolio" variant="text" className="mt-7 text-navigation">THE ASSETS WE OPERATE </Button>

      </div>
    </section>

    <section className="s2-subgrid py-30">
      <img src="/heroes/platform.png" alt="Platform" className="col-span-12  col-start-2 h-[560px] object-cover"  />

    </section>
    {/* Investment Criteria: banda a sangre; contenido en columnas 2–11 (span 10). */}
    <section className="col-span-12 ml-[calc(50%-50vw)] w-screen max-w-[100vw] bg-[#F9F9F9] ">
      <div className="s2-page py-30">
        <h2 className="text-h2 col-span-12 lg:col-start-2 lg:col-span-10">
          Investment Criteria.
        </h2>

        <dl className="s2-subgrid pt-12">
          <div className="col-span-12 grid grid-cols-1 gap-y-2 border-b border-s2-black py-6 lg:col-start-2 lg:col-span-10 lg:grid-cols-subgrid lg:gap-y-0">
            <dt className="text-data text-s2-orange lg:col-span-3">What we buy</dt>
            <dd className="text-body lg:col-span-7">
              Office, mixed-use, and adaptive re-use.
            </dd>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-y-2 border-b border-s2-black py-6 lg:col-start-2 lg:col-span-10 lg:grid-cols-subgrid lg:gap-y-0">
            <dt className="text-data text-s2-orange lg:col-span-3">Where</dt>
            <dd className="lg:col-span-7">
              <p className="text-body">
                Major Florida markets with high barriers to entry. Submarkets
                proximate to where the people making the decision already live.
              </p>
              <p className="text-metrics mt-4">
                An <em>inch</em> wide and a <em>mile</em> deep.
              </p>
            </dd>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-y-2 border-b border-s2-black py-6 lg:col-start-2 lg:col-span-10 lg:grid-cols-subgrid lg:gap-y-0">
            <dt className="text-data text-s2-orange lg:col-span-3">How we find it</dt>
            <dd className="text-body lg:col-span-7">
              Off-market, through principal relationships.
            </dd>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-y-2 border-b border-s2-black py-6 lg:col-start-2 lg:col-span-10 lg:grid-cols-subgrid lg:gap-y-0">
            <dt className="text-data text-s2-orange lg:col-span-3">
              What we underwrite to
            </dt>
            <dd className="text-body lg:col-span-7">
              Value-add, 15 to 19 percent. Opportunistic, 20 and above.
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <DoubleBlock
      headingAs="h2"
      space="4"
      space2="7"

      heading={<>
        An owner's stake,<br/><span className="italic"> not a fee.</span>
      </>
      }
      body={
        <>
          The fee-only model pays for attendance. An owner's stake pays for outcomes. Square2 makes decisions at acquisition and on site the way an owner makes them, because on most of these assets we are one. On the rest, we behave as though we were.
        </>
      }

    />


    <Cta />

  </>;
}
