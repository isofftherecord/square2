import type { Metadata } from "next";

import { DoubleBlock } from "@/components/double-block";
import { OfficeMap } from "@/components/maps";
import { Button } from "@/components/button";
export const metadata: Metadata = {
  title: "Contact — Square2",
};

export default function ContactPage() {
  return (
    <>
      <OfficeMap />

      <DoubleBlock
        space="5"
        heading={<>Two conversations.</>}
        body={
          <>
            Investors and capital partners come to evaluate a sponsor: the
            thesis behind a submarket, the underwriting beneath a number, and
            the record of holding assets through a full cycle rather than a
            single favorable year. Owners come to place a building they intend
            to keep in other hands: the leasing, the accounting, and the
            governance of how a tenant experiences the property day to day.
            <br />
            <br />
            The two enquiries differ in substance. Both reach the same desk, and
            both are read by the principals rather than routed. We prefer
            specifics: the asset, the market, the timeline, and the problem you
            are trying to solve. We will tell you plainly whether it is work we
            can take on.
          </>
        }
      />

      <form className="s2-subgrid py-16">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          {/* Tipo de interés */}
          <div className="grid grid-cols-2 gap-x-5">
            <div className="flex items-center gap-x-3 border-b border-s2-black pb-4">
              <input
                type="checkbox"
                id="interest-capital"
                name="interest"
                value="capital"
                className="size-4 shrink-0 appearance-none border border-s2-black checked:border-s2-orange checked:bg-s2-orange"
              />
              <label htmlFor="interest-capital" className="text-metrics">
                Capital
              </label>
            </div>

            <div className="flex items-center gap-x-3 border-b border-s2-black pb-4">
              <input
                type="checkbox"
                id="interest-ownership"
                name="interest"
                value="ownership"
                className="size-4 shrink-0 appearance-none border border-s2-black checked:border-s2-orange checked:bg-s2-orange"
              />
              <label htmlFor="interest-ownership" className="text-metrics">
                Ownership
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5 border-b border-s2-black py-10">
            <p className="text-body">
            For limited partners, joint-venture partners, and allocators evaluating Square2 as a sponsor.
            </p>
            <p className="text-body">
              For owners considering Square2 to operate an asset they hold.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-5">
            <div className="flex items-center border-b border-s2-black py-10">
              <label htmlFor="name" className="text-micro w-20 shrink-0">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="text-body w-full bg-s2-fog outline-none"
              />
            </div>

            <div className="flex items-center border-b border-s2-black py-10">
              <label htmlFor="company" className="text-micro w-20 shrink-0">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                className="text-body w-full bg-s2-fog outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5">
            <div className="flex items-center border-b border-s2-black py-10">
              <label htmlFor="email" className="text-micro w-20 shrink-0">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="text-body w-full bg-s2-fog outline-none"
              />
            </div>

            <div className="flex items-center border-b border-s2-black py-10">
              <label htmlFor="phone" className="text-micro w-20 shrink-0">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="text-body w-full bg-s2-fog outline-none"
              />
            </div>
          </div>

          <div className="flex items-center border-b border-s2-black py-10">
            <label htmlFor="message" className="text-micro w-20 shrink-0">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="text-body w-full resize-none bg-s2-fog outline-none"
            />
          </div>

          <Button
          href="/portfolio"
          variant="black"
          className="col-span-12 w-fit  lg:justify-self-center black mt-16"
        >
          SEND
        </Button>
        </div>
      </form>
    </>
  );
}
