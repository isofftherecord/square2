import type { Metadata } from "next";


import type { TitleHeroSlide } from "@/components/second-hero";

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
  return "hello";
}
