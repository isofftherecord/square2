import type { Metadata } from "next";
import { DoubleBlock } from "@/components/double-block";
import { TitleHero, type TitleHeroSlide } from "@/components/second-hero";

export const metadata: Metadata = {
  title: "Platform — Square2",
};

// Slides del hero: se editan aquí, no vienen del CMS.
const slides: TitleHeroSlide[] = [
  {
    title: "Platform",
    src: "/heroes/Hero-Platform.png",
    alt: "Square2 platform",
  },
];

export default function PlatformPage() {
  return <><TitleHero slides={slides} />
  
  <DoubleBlock
  headingAs="h2"
  space="4"
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
</>;
}
