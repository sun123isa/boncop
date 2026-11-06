import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/db/prisma";
import type { TopFreelance } from "@/features/home/queries";

export type SearchFilters = {
  ville?: string;
  metierIds: number[];
};

export type SearchOptions = {
  cities: string[];
  metiers: Array<{
    id: number;
    libelle: string;
  }>;
};

export type SearchResultProfile = TopFreelance & {
  cvDescription: string | null;
};

const MAX_SEARCH_RESULTS = 30;

/**
 * Options de filtres : métiers et villes des freelances validés.
 * En cas d'indisponibilité de la base, renvoie des listes vides.
 */
export async function getSearchOptions(): Promise<SearchOptions> {
  try {
    const [metiers, villes] = await Promise.all([
      prisma.metier.findMany({
        where: {
          isActif: true,
          deletedAt: null,
        },
        select: {
          id: true,
          libelle: true,
        },
        orderBy: {
          libelle: "asc",
        },
      }),
      prisma.ville.findMany({
        where: {
          isActif: true,
          deletedAt: null,
        },
        select: {
          libelle: true,
        },
        orderBy: {
          libelle: "asc",
        },
      }),
    ]);

    return {
      cities: villes.map((ville: { libelle: string }) => ville.libelle),
      metiers,
    };
  } catch (error) {
    console.error("Impossible de récupérer les options de recherche", error);
    return { cities: [], metiers: [] };
  }
}

/**
 * Freelances validés filtrés par ville et/ou métiers.
 * En cas d'indisponibilité de la base, renvoie une liste vide.
 */
export async function getSearchFreelances(
  filters: SearchFilters,
): Promise<SearchResultProfile[]> {
  const ville = filters.ville?.trim();
  const metierIds = Array.from(
    new Set(
      filters.metierIds.filter((id) => Number.isSafeInteger(id) && id > 0),
    ),
  );

  const where: Prisma.UserWhereInput = {
    role: "FREELANCE",
    validated: "VALIDATE",
    ...(ville
      ? {
          ville: {
            equals: ville,
            mode: "insensitive",
          },
        }
      : {}),
    ...(metierIds.length > 0
      ? {
          userMetiers: {
            some: {
              metierId: {
                in: metierIds,
              },
              metier: {
                is: {
                  isActif: true,
                  deletedAt: null,
                },
              },
            },
          },
        }
      : {}),
  };

  try {
    const rows = await prisma.user.findMany({
      where,
      select: {
        id: true,
        prenom: true,
        nom: true,
        ville: true,
        quartier: true,
        cvDescription: true,
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
      take: MAX_SEARCH_RESULTS,
    });

    return rows.map((row) => ({
      id: row.id,
      prenom: row.prenom,
      nom: row.nom,
      ville: row.ville,
      quartier: row.quartier,
      profileViews: row.profileViews,
      cvDescription: row.cvDescription,
      metiers: row.userMetiers.map(({ metier }) => metier.libelle),
    }));
  } catch (error) {
    console.error("Impossible de récupérer les profils recherchés", error);
    return [];
  }
}
