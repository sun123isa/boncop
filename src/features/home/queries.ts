import prisma from "@/db/prisma";

export type TopFreelance = {
  id: number;
  prenom: string | null;
  nom: string | null;
  ville: string | null;
  quartier: string | null;
  profileViews: number;
  metiers: string[];
};

const MAX_TOP_FREELANCES = 20;

/**
 * Retourne les freelances validés les plus consultés.
 * En cas d'indisponibilité de la base, la page reste lisible avec une liste vide.
 */
export async function getTopFreelances(limit = 5): Promise<TopFreelance[]> {
  const safeLimit = Number.isFinite(limit)
    ? Math.min(Math.max(Math.trunc(limit), 0), MAX_TOP_FREELANCES)
    : 5;

  if (safeLimit === 0) {
    return [];
  }

  try {
    const rows = await prisma.user.findMany({
      where: {
        role: "FREELANCE",
        validated: "VALIDATE",
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        ville: true,
        quartier: true,
        profileViews: true,
        userMetiers: {
          where: {
            metier: {
              is: {
                isActif: true,
                deletedAt: null,
              },
            },
          },
          select: {
            metier: {
              select: {
                libelle: true,
              },
            },
          },
        },
      },
      orderBy: [{ profileViews: "desc" }, { id: "asc" }],
      take: safeLimit,
    });

    return rows.map((row) => ({
      id: row.id,
      prenom: row.prenom,
      nom: row.nom,
      ville: row.ville,
      quartier: row.quartier,
      profileViews: row.profileViews,
      metiers: row.userMetiers.map(({ metier }) => metier.libelle),
    }));
  } catch (error) {
    console.error(
      "Impossible de récupérer les profils les plus consultés",
      error,
    );

    return [];
  }
}
