"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { type ProjectSummary } from "@/components/project-index";
import { ProjectLedger } from "@/components/project-ledger";

type RoleFilter = "all" | "Owned" | "Managed";

const FILTERS: { id: RoleFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Owned", label: "Owned" },
  { id: "Managed", label: "Managed" },
];

export function PortfolioView({
  projects,
  sanityConfigured,
}: {
  projects: ProjectSummary[];
  sanityConfigured: boolean;
}) {
  const [filter, setFilter] = useState<RoleFilter>("all");

  const visible = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.role === filter);
  }, [filter, projects]);

  return (
    <>
      {/* The record — hero con filtros encajados */}
      <section className="bg-s2-orange col-span-12 ml-[calc(50%-50vw)] h-[640px] w-screen max-w-[100vw] text-s2-white">
        <div className="s2-page h-full grid-rows-1 pt-64">
          <div className="col-span-5 col-start-2 self-start">
            <h2 className="text-h1">The record.</h2>
            <p className="text-body mt-6">
              Every asset Square2 has owned, co-sponsored, or operated. All in
              the same table, because the standard does not change with the
              deed.
            </p>
          </div>

          {/* La muesca: se alinea al fondo de la fila, al ras del borde naranja */}
          <div
            className="col-span-3 col-start-10 flex justify-center gap-x-2 self-end bg-background py-6 text-foreground"
            role="group"
            aria-label="Filter projects by role"
          >
            {FILTERS.map(({ id, label }) => {
              const pressed = filter === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setFilter(id)}
                  className={
                    pressed
                      ? "text-tags bg-s2-black px-3 py-1 text-s2-white cursor-pointer"
                      : "text-tags px-3 py-1 text-s2-black cursor-pointer"
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="s2-subgrid">
        <div className="s2-subgrid col-span-12 pt-10">
          {!sanityConfigured ? (
            <section className="col-span-12 rounded-xl border border-s2-orange/40 bg-s2-orange/10 p-6 lg:col-span-10 lg:col-start-2">
              <h2 className="text-h5 text-s2-orange">Sanity is not connected</h2>
              <p className="text-body mt-2 text-s2-slate">
                Create a project on{" "}
                <a
                  href="https://sanity.io/manage"
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  sanity.io/manage
                </a>{" "}
                and copy your Project ID into <code>.env.local</code>. Then open{" "}
                <code>/studio</code> to add projects.
              </p>
            </section>
          ) : projects.length === 0 ? (
            <p className="text-body col-span-12 text-s2-slate lg:col-span-10 lg:col-start-2">
              No published projects yet. Add the first one from{" "}
              <Link href="/studio" className="underline">
                the content studio
              </Link>
              .
            </p>
          ) : visible.length === 0 ? (
            <p className="text-body col-span-12 text-s2-slate lg:col-span-10 lg:col-start-2">
              No {filter.toLowerCase()} projects in the record.
            </p>
          ) : (
            <ProjectLedger projects={visible} />
          )}
        </div>
      </main>
    </>
  );
}
