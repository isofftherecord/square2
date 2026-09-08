export type TeamMember = {
  _key: string;
  name: string;
  title: string;
};

export type FirmTeamDoc = {
  members?: {
    _key: string;
    name?: string;
    title?: string;
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
      })) ?? []
  );
}

type TeamProps = {
  members: TeamMember[];
};

export function Team({ members }: TeamProps) {
  if (members.length === 0) return null;

  return (
    <section className="s2-subgrid pt-20">
      <div className="col-span-12 lg:col-span-10 lg:col-start-2">
        <h2 className="text-h2">Team.</h2>
        {/* 30px bajo el H2, igual que Figma */}
        <hr className="mt-[30px] border-t border-s2-black" />

        <ul>
          {members.map((member) => (
            <li key={member._key}>
              <div className="flex items-baseline justify-between gap-5 pt-[22px] pb-[14px] lg:grid lg:grid-cols-10 lg:gap-x-5">
                <p className="text-h5 min-w-0 lg:col-span-7">{member.name}</p>
                <p className="text-body text-right lg:col-span-3 lg:text-left">
                  {member.title}
                </p>
              </div>
              <hr className="border-t border-s2-black" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
