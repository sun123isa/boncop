import type { Status } from "@/generated/prisma/client";
import prisma from "@/db/prisma";
import { ACTIVE_METIER_RELATION_FILTER } from "@/features/metiers/active";
import { requireFreelance } from "./require-freelance";

export type EditableProfile = {
  id: number;
  email: string;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  whatsapp: string | null;
  ville: string | null;
  quartier: string | null;
  cvDescription: string | null;
  validated: Status;
  metierIds: number[];
};

/**
 * Profil du freelance connecté, pour la page d'édition.
 */
export async function getMyEditableProfile(): Promise<EditableProfile | null> {
  const freelance = await requireFreelance();
  if (!freelance) return null;

  try {
    const profile = await prisma.user.findFirst({
      where: {
        id: freelance.id,
        role: "FREELANCE",
      },
      select: {
        id: true,
        email: true,
        prenom: true,
        nom: true,
        telephone: true,
        whatsapp: true,
        ville: true,
        quartier: true,
        cvDescription: true,
        validated: true,
        userMetiers: {
          where: {
            metier: ACTIVE_METIER_RELATION_FILTER,
          },
          select: {
            metierId: true,
          },
        },
      },
    });

    if (!profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      prenom: profile.prenom,
      nom: profile.nom,
      telephone: profile.telephone,
      whatsapp: profile.whatsapp,
      ville: profile.ville,
      quartier: profile.quartier,
      cvDescription: profile.cvDescription,
      validated: profile.validated,
      metierIds: profile.userMetiers.map((row) => row.metierId),
    };
  } catch (error) {
    console.error("Impossible de charger le profil à éditer", error);
    return null;
  }
}
