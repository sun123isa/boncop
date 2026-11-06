"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/db/prisma";
import { normalizeCongoPhone } from "@/features/freelance/contact";
import { ACTIVE_METIER_WHERE } from "@/features/metiers/active";
import { isActiveVilleLibelle } from "@/features/villes/queries";
import { requireFreelance } from "./require-freelance";

export type ProfileActionResult =
  | { success: true }
  | { success: false; error: string };

const UpdateProfileSchema = z.object({
  prenom: z.string().trim().max(80).optional(),
  nom: z.string().trim().max(80).optional(),
  telephone: z.string().trim().max(40).optional(),
  whatsapp: z.string().trim().max(40).optional(),
  ville: z.string().trim().min(1, "Choisissez une ville"),
  quartier: z.string().trim().max(120).optional(),
  cvDescription: z.string().trim().max(5000).optional(),
  metierIds: z.array(z.number().int().positive()).max(10),
});

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : undefined;
}

export async function updateMyProfile(
  formData: FormData,
): Promise<ProfileActionResult> {
  const freelance = await requireFreelance();
  if (!freelance) {
    return {
      success: false,
      error: "Vous devez être connecté en tant que freelance.",
    };
  }

  const metierIds = formData
    .getAll("metierIds")
    .map((value) => Number(value))
    .filter((id) => Number.isSafeInteger(id) && id > 0);

  const parsed = UpdateProfileSchema.safeParse({
    prenom: emptyToUndefined(formData.get("prenom")),
    nom: emptyToUndefined(formData.get("nom")),
    telephone: emptyToUndefined(formData.get("telephone")),
    whatsapp: emptyToUndefined(formData.get("whatsapp")),
    ville: String(formData.get("ville") ?? "").trim(),
    quartier: emptyToUndefined(formData.get("quartier")),
    cvDescription: emptyToUndefined(formData.get("cvDescription")),
    metierIds: Array.from(new Set(metierIds)),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }

  const data = parsed.data;

  let telephone: string | null = null;
  if (data.telephone) {
    telephone = normalizeCongoPhone(data.telephone);
    if (!telephone) {
      return {
        success: false,
        error: "Téléphone invalide. Format attendu : 06 123 45 67",
      };
    }
  }

  let whatsapp: string | null = null;
  if (data.whatsapp) {
    whatsapp = normalizeCongoPhone(data.whatsapp);
    if (!whatsapp) {
      return {
        success: false,
        error: "WhatsApp invalide. Format attendu : 06 123 45 67",
      };
    }
  }

  const villeOk = await isActiveVilleLibelle(data.ville);
  if (!villeOk) {
    return {
      success: false,
      error: "Ville invalide. Choisissez une ville de la liste.",
    };
  }

  if (data.metierIds.length > 0) {
    const validMetiers = await prisma.metier.count({
      where: {
        id: { in: data.metierIds },
        ...ACTIVE_METIER_WHERE,
      },
    });

    if (validMetiers !== data.metierIds.length) {
      return {
        success: false,
        error: "Un ou plusieurs métiers sélectionnés sont invalides.",
      };
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: freelance.id },
        data: {
          prenom: data.prenom ?? null,
          nom: data.nom ?? null,
          telephone,
          whatsapp,
          ville: data.ville,
          quartier: data.quartier ?? null,
          cvDescription: data.cvDescription ?? null,
        },
      });

      await tx.userMetier.deleteMany({ where: { userId: freelance.id } });

      if (data.metierIds.length > 0) {
        await tx.userMetier.createMany({
          data: data.metierIds.map((metierId) => ({
            userId: freelance.id,
            metierId,
          })),
        });
      }
    });

    revalidatePath("/profile/edit");
    revalidatePath(`/profile/${freelance.id}`);
    revalidatePath("/search");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("updateMyProfile", error);
    return { success: false, error: "Impossible d'enregistrer le profil." };
  }
}
