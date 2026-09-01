import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Firm" },
  { href: "/platform", label: "Platform" },
  { href: "/", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  return (
    <header className="col-span-12 " >
      <nav 
        className="bg-s2-white flex w-full items-center justify-between px-5 py-3.5 max-w-[600px] mx-auto mt-[44px] fixed left-0 right-0 "
        aria-label="Principal"
      >
        <Link
          href="/"
          className="relative h-[27px] w-[140px] shrink-0 overflow-clip"
        >
          <Image
            src="/logo.png"
            alt="Square2"
            width={140}
            height={27}
            priority
            className="size-full object-contain object-left"
          />
        </Link>
        <ul className="flex h-[18px] items-center gap-5">
          {NAV_ITEMS.map((item, index) => (
            <Fragment key={item.label}>
              {index > 0 ? (
                <li
                  className="size-1 shrink-0 bg-s2-orange"
                  aria-hidden
                />
              ) : null}
              <li className="shrink-0">
                <Link
                  href={item.href}
                  className="text-navigation whitespace-nowrap text-s2-black"
                >
                  {item.label}
                </Link>
              </li>
            </Fragment>
          ))}
        </ul>
      </nav>
    </header>
  );
}
