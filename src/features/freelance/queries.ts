import prisma from "@/db/prisma";
import { ACTIVE_METIER_RELATION_FILTER } from "@/features/metiers/active";

export type FreelanceProfile = {
  id: number;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  whatsapp: string | null;
  ville: string | null;
  quartier: string | null;
  cvDescription: string | null;
  profileViews: number;
  createdAt: Date;
  metiers: string[];
};

const publicProfileWhere = (id: number) => ({
  id,
  role: "FREELANCE" as const,
  validated: "VALIDATE" as const,
});

function mapProfile(profile: {
  id: number;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  whatsapp: string | null;
  ville: string | null;
  quartier: string | null;
  cvDescription: string | null;
  profileViews: number;
  createdAt: Date;
  userMetiers: Array<{ metier: { libelle: string } }>;
}): FreelanceProfile {
  return {
    id: profile.id,
    prenom: profile.prenom,
    nom: profile.nom,
    telephone: profile.telephone,
    whatsapp: profile.whatsapp,
    ville: profile.ville,
    quartier: profile.quartier,
    cvDescription: profile.cvDescription,
    profileViews: profile.profileViews,
    createdAt: profile.createdAt,
    metiers: profile.userMetiers.map(({ metier }) => metier.libelle),
  };
}

/**
 * Lecture seule d'un profil validé (sans incrémenter les vues).
 */
export async function findFreelanceProfile(
  id: number,
): Promise<FreelanceProfile | null> {
  if (!Number.isSafeInteger(id) || id < 1) {
    return null;
  }

  try {
    const profile = await prisma.user.findFirst({
      where: publicProfileWhere(id),
      select: {
        id: true,
        prenom: true,
        nom: true,
        telephone: true,
        whatsapp: true,
        ville: true,
        quartier: true,
        cvDescription: true,
        profileViews: true,
        createdAt: true,
        userMetiers: {
          where: {
            metier: ACTIVE_METIER_RELATION_FILTER,
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
    });

    return profile ? mapProfile(profile) : null;
  } catch (error) {
    console.error("Impossible de récupérer le profil freelance", error);
    return null;
  }
}

/**
 * Charge un profil freelance validé et incrémente le compteur de vues.
 * Renvoie null si l'id est invalide, absent, en attente ou banni.
 */
export async function getFreelanceProfile(
  id: number,
): Promise<FreelanceProfile | null> {
  if (!Number.isSafeInteger(id) || id < 1) {
    return null;
  }

  const where = publicProfileWhere(id);

  try {
    const viewUpdate = await prisma.user.updateMany({
      where,
      data: {
        profileViews: {
          increment: 1,
        },
      },
    });

    if (viewUpdate.count === 0) {
      return null;
    }

    return findFreelanceProfile(id);
  } catch (error) {
    console.error("Impossible de récupérer le profil freelance", error);
    return null;
  }
}
