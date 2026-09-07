"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { SITE_NAV } from "@/lib/site-nav";

function navLinkClass(active: boolean) {
  return `text-navigation whitespace-nowrap hover:text-s2-orange ${
    active ? "text-s2-orange" : "text-s2-black"
  }`;
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="col-span-12 z-50">
      <nav
        className="bg-s2-white fixed inset-x-5 top-4 z-50 mx-auto flex max-w-[600px] flex-col px-5 py-3.5 lg:inset-x-0 lg:top-[44px] lg:flex-row lg:items-center lg:justify-between"
        aria-label="Main"
      >
        <div className="flex w-full items-center justify-between">
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
          <ul className="hidden h-[18px] items-center gap-5 lg:flex">
            {SITE_NAV.map((item, index) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Fragment key={item.label}>
                  {index > 0 ? (
                    <li className="size-1 shrink-0 bg-s2-orange" aria-hidden />
                  ) : null}
                  <li className="shrink-0">
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={navLinkClass(isActive)}
                    >
                      {item.label}
                    </Link>
                  </li>
                </Fragment>
              );
            })}
          </ul>
          <button
            type="button"
            className="text-navigation text-s2-black lg:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {open ? (
          <ul
            id="site-menu"
            className="mt-4 flex flex-col gap-4 border-t border-s2-steel/40 pt-4 lg:hidden"
          >
            {SITE_NAV.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={navLinkClass(isActive)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </nav>
    </header>
  );
}
