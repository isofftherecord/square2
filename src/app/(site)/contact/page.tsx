import type { Metadata } from "next";


import type { TitleHeroSlide } from "@/components/second-hero";

export const metadata: Metadata = {
  title: "Contact — Square2",
};

// Slides del hero: se editan aquí, no vienen del CMS.
const slides: TitleHeroSlide[] = [
  {
    title: "Contact",
    src: "/heroes/contact-01.jpg",
    alt: "Square2 offices",
  },
];

export default function ContactPage() {
  return "<TitlePage slides={slides} />";
}
