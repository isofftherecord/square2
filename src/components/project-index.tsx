import Link from "next/link";

export type ProjectSummary = {
  _id: string;
  title: string;
  slug: string;
  market?: string;
  assetClass?: string;
  squareFootage?: number;
  years?: string;
  role?: string;
  summary?: string;
  mainImage?: { alt?: string } & Record<string, unknown>;
  featured?: boolean;
};

function formatSquareFootage(value: number) {
  return value.toLocaleString("en-US");
}

export function ProjectIndex({
  projects,
  heading,
}: {
  projects: ProjectSummary[];
  heading?: string;
}) {
  return (
    <section className="s2-subgrid py-20">
      {heading ? (
        <h2 className="text-h2 col-span-12 mb-10 lg:col-span-10 lg:col-start-2">
          {heading}
        </h2>
      ) : null}

      <div className="text-data col-span-12 hidden border-b border-s2-black pb-3 text-s2-black lg:col-span-10 lg:col-start-2 lg:grid lg:grid-cols-subgrid">
        <span className="col-span-3">Property</span>
        <span className="col-span-2">Market</span>
        <span className="col-span-1">Class</span>
        <span className="col-span-1">SF</span>
        <span className="col-span-2">Year</span>
        <span className="col-span-1">Role</span>
      </div>

      <ul className="contents">
        {projects.map((project) => (
          <li
            key={project._id}
            className="col-span-12 grid grid-cols-subgrid border-b border-s2-black py-5 lg:col-span-10 lg:col-start-2"
          >
            <Link
                href={`/projects/${project.slug}`}
                className="col-span-full grid grid-cols-subgrid"
              >
              <span className="text-metrics col-span-12 lg:col-span-3">
                {project.title}
              </span>
              <span className="text-metrics col-span-12 lg:col-span-2">
                {project.market}
              </span>
              <span className="text-metrics col-span-12 lg:col-span-1">
                {project.assetClass}
              </span>
              <span className="text-metrics col-span-12 lg:col-span-1">
                {project.squareFootage != null
                  ? formatSquareFootage(project.squareFootage)
                  : null}
              </span>
              <span className="text-metrics col-span-12 lg:col-span-2">
                {project.years}
              </span>
              <span className="col-span-12 lg:col-span-1">
                {project.role ? (
                  <span className="text-navigation bg-s2-orange px-2 py-1 text-s2-white">
                    {project.role}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
