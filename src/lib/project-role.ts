export const OWNED_AND_MANAGED_ROLE = "Owned & Managed";

export function roleBadgeClass(role?: string) {
  if (role === "Managed") return "bg-s2-black";
  if (role === OWNED_AND_MANAGED_ROLE) return "bg-s2-steel";
  return "bg-s2-orange";
}

export function matchesRoleFilter(
  role: string | undefined,
  filter: "all" | "Owned" | "Managed",
) {
  if (filter === "all") return true;
  if (role === filter) return true;
  // Owned & Managed cuenta en los dos filtros de rol
  return role === OWNED_AND_MANAGED_ROLE;
}

// En Managed, las solo Managed van primero y Owned & Managed al final.
// El orden relativo del Studio se conserva dentro de cada grupo.
export function managedListRank(role?: string) {
  return role === OWNED_AND_MANAGED_ROLE ? 1 : 0;
}
