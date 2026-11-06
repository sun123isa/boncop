import { auth } from "@/auth";

export type FreelanceSessionUser = {
  id: number;
  validated?: string;
};

/**
 * Session freelance autorisée à éditer son profil.
 * Miroir de `requireAdmin` : à appeler en tête des queries / actions profil.
 */
export async function requireFreelance(): Promise<FreelanceSessionUser | null> {
  const session = await auth();
  const user = session?.user as
    | { id?: string; role?: string; validated?: string }
    | undefined;
  const userId = Number(user?.id);

  if (
    !session ||
    user?.role !== "FREELANCE" ||
    !Number.isSafeInteger(userId) ||
    user.validated === "BANNI"
  ) {
    return null;
  }

  return {
    id: userId,
    validated: user.validated,
  };
}
