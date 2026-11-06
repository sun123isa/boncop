import { auth } from "@/auth";

export type AdminSessionUser = {
  id?: string;
  role?: string;
};

/**
 * Vérifie que la session courante appartient à un ADMIN.
 * À appeler en tête de chaque server action / query admin.
 */
export async function requireAdmin(): Promise<AdminSessionUser> {
  const session = await auth();
  const user = session?.user as AdminSessionUser | undefined;

  if (!session || user?.role !== "ADMIN") {
    throw new Error("Accès réservé aux administrateurs.");
  }

  return user;
}
