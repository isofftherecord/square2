import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { DoubleBlock } from "@/components/double-block";
import { OfficeMap } from "@/components/maps";

export const metadata: Metadata = {
  title: "Contact — Square2",
};

export default function ContactPage() {
  return (
    <>
      <OfficeMap />

      <DoubleBlock
        space="5"
        space2="7"
        heading="Two conversations."
        body={
          <>
            Investors and capital partners come to evaluate a sponsor: the thesis behind a submarket, the underwriting beneath a number, and the record of holding assets through a full cycle rather than a single favorable year. Owners come to place a building they intend to keep in other hands: the leasing, the accounting, and the governance of how a tenant experiences the property day to day.
            <br />
            <br />
            The two inquiries differ in substance. Both reach the same desk, and both are read by the principals rather than routed. We prefer specifics: the asset, the market, the timeline, and the problem you are trying to solve. We will tell you plainly whether it is work we can take on.
          </>
        }
      />

      <ContactForm />
    </>
  );
}
