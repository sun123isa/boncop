import type { Status } from "@/generated/prisma/client";
import type { BadgeVariant } from "@/components/ui/Badge";

export function getStatusLabel(status: Status): string {
  switch (status) {
    case "ATTENTE":
      return "En attente";
    case "VALIDATE":
      return "Validé";
    case "BANNI":
      return "Banni";
    default:
      return status;
  }
}

export function getStatusBadgeVariant(status: Status): BadgeVariant {
  switch (status) {
    case "ATTENTE":
      return "warning";
    case "VALIDATE":
      return "success";
    case "BANNI":
      return "danger";
    default:
      return "neutral";
  }
}

export function getAccountDisplayName(account: {
  prenom: string | null;
  nom: string | null;
  email: string;
}): string {
  const fullName = [account.prenom, account.nom].filter(Boolean).join(" ");
  return fullName || account.email;
}
