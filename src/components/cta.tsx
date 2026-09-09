import type { ReactNode } from "react";

import { Button } from "@/components/button";

type CtaProps = {
  heading?: ReactNode;
  body?: ReactNode;
  note?: ReactNode;
  href?: string;
  label?: string;
};

export function Cta({
  heading = "Square it.",
  body = "Bring us a building, a thesis, or a partnership. We'll tell you plainly what we see in it, and whether we're the right firm to hold it.",
  note = "Capital and Ownership Inquiries.",
  href = "/contact",
  label = "Get in touch",
}: CtaProps) {
  return (
    // Banda naranja a sangre completa; el contenido vuelve a la grilla 1440.
    <section className="col-span-12 ml-[calc(50%-50vw)] w-screen max-w-[100vw] bg-s2-orange">
      <div className="s2-page items-center gap-y-8 py-16 lg:py-20">
        <div className="col-span-12 lg:col-span-5 lg:col-start-2">
          <h2 className="text-h2 text-s2-white">{heading}</h2>
          <p className="text-body mt-5 text-s2-white">{body}</p>
          <p className="text-body font-bold mt-4 text-s2-black">{note}</p>
        </div>

        <Button
          href={href}
          className="col-span-12 w-fit lg:col-span-5 lg:justify-self-end"
        >
          {label}
        </Button>
      </div>
    </section>
  );
}
