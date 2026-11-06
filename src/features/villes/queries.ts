import prisma from "@/db/prisma";

export type VilleOption = {
  id: number;
  libelle: string;
};

/** Villes actives pour les formulaires (inscription, filtres). */
export async function getActiveVilles(): Promise<VilleOption[]> {
  try {
    return await prisma.ville.findMany({
      where: {
        isActif: true,
        deletedAt: null,
      },
      select: {
        id: true,
        libelle: true,
      },
      orderBy: { libelle: "asc" },
    });
  } catch (error) {
    console.error("Impossible de récupérer les villes", error);
    return [];
  }
}

/** Vérifie qu'une ville existe et est active (par libellé). */
export async function isActiveVilleLibelle(
  libelle: string,
): Promise<boolean> {
  const normalized = libelle.trim();
  if (!normalized) return false;

  try {
    const ville = await prisma.ville.findFirst({
      where: {
        libelle: {
          equals: normalized,
          mode: "insensitive",
        },
        isActif: true,
        deletedAt: null,
      },
      select: { id: true },
    });
    return Boolean(ville);
  } catch (error) {
    console.error("Impossible de valider la ville", error);
    return false;
  }
}
