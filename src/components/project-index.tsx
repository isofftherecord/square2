import Link from "next/link";

export type ProjectImage = { alt?: string; _key?: string } & Record<
  string,
  unknown
>;

export type ProjectMetric = {
  _key?: string;
  value?: string;
  label?: string;
};

export type ProjectParagraph = {
  _key?: string;
  text?: string;
  emphasis?: boolean;
};

export type ProjectGalleryItem = ProjectImage & {
  image?: ProjectImage;
  beforeImage?: ProjectImage;
};

export type ProjectChapter = {
  _key?: string;
  heading?: string;
  paragraphs?: ProjectParagraph[];
  image?: ProjectImage;
  caption?: string;
  beforeImage?: ProjectImage;
  gallery?: ProjectGalleryItem[];
};

export type ProjectExitSide = {
  value?: string;
  line?: string;
  details?: string[];
};

export type ProjectExit = {
  heading?: string;
  acquired?: ProjectExitSide;
  sold?: ProjectExitSide;
  metrics?: ProjectMetric[];
};

export type ProjectCredit = {
  _key?: string;
  label?: string;
  detail?: string;
};

export type ProjectSummary = {
  _id: string;
  title: string;
  slug: string;
  market?: string;
  assetClass?: string;
  squareFootage?: number;
  years?: string;
  role?: string;
  mainImage?: ProjectImage;
  address?: string;
  owner?: string;
  status?: string;
  dealHeading?: string;
  dealMetrics?: ProjectMetric[];
  chapters?: ProjectChapter[];
  exit?: ProjectExit;
  credits?: ProjectCredit[];
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
    <section className="s2-subgrid py-25">
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
              <span className="text-micro col-span-12 mt-2 text-s2-steel lg:hidden">
                {[project.market, project.assetClass, project.years]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              <span className="text-metrics hidden lg:col-span-2 lg:block">
                {project.market}
              </span>
              <span className="text-metrics hidden lg:col-span-1 lg:block">
                {project.assetClass}
              </span>
              <span className="text-metrics hidden lg:col-span-1 lg:block">
                {project.squareFootage != null
                  ? formatSquareFootage(project.squareFootage)
                  : null}
              </span>
              <span className="text-metrics hidden lg:col-span-2 lg:block">
                {project.years}
              </span>
              <span className="col-span-12 mt-3 lg:col-span-1 lg:mt-0">
                {project.role ? (
                  <span
                    className={`text-navigation px-5.5 py-2 text-s2-white ${
                      project.role === "Managed"
                        ? "bg-s2-black"
                        : "bg-s2-orange"
                    }`}
                  >
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
