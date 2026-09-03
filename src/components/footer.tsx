import Link from "next/link";

import { Button } from "@/components/button";
import { SITE_NAV } from "@/lib/site-nav";

const CONNECTIONS = [
  { href: "#", label: "LinkedIn" },
] as const;

async function subscribe(formData: FormData) {
  "use server";
  formData.get("email");
}

export function Footer() {
  return (
    <footer className="mt-auto w-full bg-s2-black">
      <div className="s2-page gap-y-15 pt-20 pb-15">
        <div className="col-span-12 col-start-1 flex flex-col gap-4 lg:col-span-2 lg:col-start-2">
          <p className="text-navigation text-s2-orange">SQUARE2 Capital, LLC</p>
          <p className="text-data text-s2-steel">
            3250 Mary Street
            <br />
            Suite 207
            <br />
            Miami, FL 33133
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="tel:+13053728828"
              className="text-data text-s2-steel hover:text-s2-white"
            >
              +1.305.372.8828
            </a>
            <a
              href="mailto:info@S2C.com"
              className="text-data text-s2-steel hover:text-s2-white"
            >
              info@S2C.com
            </a>
          </div>
        </div>

        <nav
          className="col-span-12 col-start-1 flex flex-col gap-4 lg:col-span-2 lg:col-start-4"
          aria-label="Connections"
        >
          <p className="text-navigation text-s2-orange">Connections</p>
          <ul className="flex flex-col gap-3">
            {CONNECTIONS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-data text-s2-steel hover:text-s2-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          className="col-span-12 col-start-1 flex flex-col gap-4 lg:col-span-2 lg:col-start-7"
          aria-label="Sitemap"
        >
          <p className="text-navigation text-s2-orange">Sitemap</p>
          <ul className="flex flex-col gap-3">
            {SITE_NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-data text-s2-steel hover:text-s2-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <form
          action={subscribe}
          className="col-span-12 col-start-1 flex flex-col gap-4 lg:col-span-3 lg:col-start-9"
          aria-label="Subscribe"
        >
          <label htmlFor="footer-email" className="text-navigation text-s2-orange">
            Subscribe
          </label>
          <input
            id="footer-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Your Email"
            className="text-data w-full border-b border-s2-white bg-s2-white/10 px-3.5 py-6 text-s2-steel placeholder:text-s2-steel placeholder:uppercase focus-visible:border-s2-orange focus-visible:outline-none"
          />
          <Button type="submit" className="w-full">
            Subscribe
          </Button>
        </form>

        <p className="text-navigation col-span-12 text-s2-steel lg:col-span-11 lg:col-start-2">
          ©2026 All rights reserved.
        </p>
      </div>
    </footer>
  );
}
