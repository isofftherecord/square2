export type TeamMember = {
  _key: string;
  name: string;
  title: string;
  linkedin?: string;
};

export type FirmTeamDoc = {
  members?: {
    _key: string;
    name?: string;
    title?: string;
    linkedin?: string;
  }[];
};

export function toTeamMembers(doc: FirmTeamDoc | null): TeamMember[] | undefined {
  if (!doc) return undefined;

  return (
    doc.members
      ?.filter(
        (member): member is TeamMember =>
          Boolean(member._key && member.name && member.title),
      )
      .map((member) => ({
        _key: member._key,
        name: member.name,
        title: member.title,
        linkedin: member.linkedin?.trim() || undefined,
      })) ?? []
  );
}

type TeamProps = {
  members: TeamMember[];
};

export function Team({ members }: TeamProps) {
  if (members.length === 0) return null;

  return (
    <section className="s2-subgrid pt-40">
      <div className="col-span-12 lg:col-span-10 lg:col-start-2">
        <h2 className="text-h2">Team.</h2>
        {/* 30px bajo el H2, igual que Figma */}
        <hr className="mt-[30px] border-t border-s2-black" />

        <ul>
          {members.map((member) => (
            <li key={member._key}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3 pt-[22px] pb-[14px] lg:grid-cols-10">
                <p className="text-h5 min-w-0 lg:col-span-4">{member.name}</p>
                <p className="text-body text-right lg:col-span-3 lg:text-left">
                  {member.title}
                </p>
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 inline-flex h-5 w-fit cursor-pointer items-center gap-1.5 bg-s2-linkedin px-3 text-navigation text-s2-white lg:col-span-3"
                  >
                    <img
                      src="/icons/linkedin.svg"
                      alt=""
                      width={10}
                      height={7}
                      className="shrink-0"
                    />
                    LinkedIn
                  </a>
                ) : (
                  // Reserva la tercera columna para que el cargo no se corra.
                  <span className="hidden lg:col-span-3 lg:block" />
                )}
              </div>
              <hr className="border-t border-s2-black" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
