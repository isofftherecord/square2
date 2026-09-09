"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/button";
import { submitContact, type FormState } from "@/lib/form-actions";

const INITIAL_STATE: FormState = { status: "idle", message: "" };

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    submitContact,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="s2-subgrid py-16">
      <div className="col-span-12 lg:col-span-10 lg:col-start-2">
        {/* Honeypot: los bots lo rellenan, las personas no lo ven. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

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

        <div className="grid grid-cols-1 gap-x-5 gap-y-6 border-b border-s2-black py-10 lg:grid-cols-2">
          <p className="text-body">
          For limited partners, joint-venture partners, and allocators evaluating SQUARE2 as a sponsor.
          </p>
          <p className="text-body">
          For owners considering SQUARE2 to operate an asset they hold.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
          <div className="flex items-center border-b border-s2-black py-10">
            <label htmlFor="name" className="text-micro w-20 shrink-0">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
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

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
          <div className="flex items-center border-b border-s2-black py-10">
            <label htmlFor="email" className="text-micro w-20 shrink-0">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
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
            required
            className="text-body w-full resize-none bg-s2-fog outline-none"
          />
        </div>

        <Button
          type="submit"
          variant="black"
          disabled={pending}
          className="mt-16 w-fit disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "SENDING" : "SEND"}
        </Button>

        {state.message ? (
          <p
            className={`text-body mt-6 ${
              state.status === "error" ? "text-s2-orange" : "text-s2-slate"
            }`}
            aria-live="polite"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
