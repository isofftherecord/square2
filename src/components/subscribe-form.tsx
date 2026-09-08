"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/button";
import { subscribe, type FormState } from "@/lib/form-actions";

const INITIAL_STATE: FormState = { status: "idle", message: "" };

export function SubscribeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(subscribe, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="col-span-12 col-start-1 flex flex-col gap-4 lg:col-span-3 lg:col-start-9"
      aria-label="Subscribe"
    >
      <label htmlFor="footer-email" className="text-navigation text-s2-orange">
        Subscribe
      </label>
      {/* Honeypot: los bots lo rellenan, las personas no lo ven. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="footer-website">Website</label>
        <input
          id="footer-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input
        id="footer-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="Your Email"
        className="text-data w-full border-b border-s2-white bg-s2-white/10 px-3.5 py-6 text-s2-steel placeholder:text-s2-steel placeholder:uppercase focus-visible:border-s2-orange focus-visible:outline-none"
      />
      <Button
        type="submit"
        disabled={pending}
        className="w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Sending" : "Subscribe"}
      </Button>
      {state.message ? (
        <p
          className={`text-data ${
            state.status === "error" ? "text-s2-orange" : "text-s2-white"
          }`}
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
