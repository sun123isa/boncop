"use server";

import { revalidatePath } from "next/cache";
import type { Status } from "@/generated/prisma/client";
import prisma from "@/db/prisma";
import { requireAdmin } from "./require-admin";

export type AdminActionResult =
  | { success: true }
  | { success: false; error: string };

const ALLOWED_STATUSES: readonly Status[] = ["ATTENTE", "VALIDATE", "BANNI"];

function revalidateAdmin() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/search");
  revalidatePath("/");
}

export async function createMetier(
  libelle: string,
): Promise<AdminActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." };
  }

  const sanitizedLibelle = libelle.trim();

  if (!sanitizedLibelle) {
    return { success: false, error: "Le libellé ne peut pas être vide." };
  }

  if (sanitizedLibelle.length > 80) {
    return {
      success: false,
      error: "Le libellé ne peut pas dépasser 80 caractères.",
    };
  }

  try {
    const existing = await prisma.metier.findUnique({
      where: { libelle: sanitizedLibelle },
      select: { id: true, isActif: true, deletedAt: true },
    });

    if (existing) {
      // Réactive un métier soft-deleted au lieu de bloquer sur l'unicité
      if (!existing.isActif || existing.deletedAt) {
        await prisma.metier.update({
          where: { id: existing.id },
          data: { isActif: true, deletedAt: null },
        });
        revalidateAdmin();
        return { success: true };
      }

      return { success: false, error: "Ce métier existe déjà." };
    }

    await prisma.metier.create({
      data: {
        libelle: sanitizedLibelle,
        isActif: true,
        deletedAt: null,
      },
    });

    revalidateAdmin();
    return { success: true };
  } catch (error) {
    console.error("createMetier", error);
    return { success: false, error: "Impossible de créer le métier." };
  }
}

/** Soft delete : isActif=false + deletedAt. */
export async function deleteMetier(id: number): Promise<AdminActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." };
  }

  if (!Number.isSafeInteger(id) || id < 1) {
    return { success: false, error: "Identifiant de métier invalide." };
  }

  try {
    const metier = await prisma.metier.findUnique({
      where: { id },
      select: { id: true, isActif: true },
    });

    if (!metier) {
      return { success: false, error: "Métier introuvable." };
    }

    if (!metier.isActif) {
      return { success: false, error: "Ce métier est déjà désactivé." };
    }

    await prisma.metier.update({
      where: { id },
      data: {
        isActif: false,
        deletedAt: new Date(),
      },
    });

    revalidateAdmin();
    return { success: true };
  } catch (error) {
    console.error("deleteMetier", error);
    return {
      success: false,
      error: "Impossible de désactiver ce métier.",
    };
  }
}

/** Réactive un métier soft-deleted. */
export async function restoreMetier(id: number): Promise<AdminActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." };
  }

  if (!Number.isSafeInteger(id) || id < 1) {
    return { success: false, error: "Identifiant de métier invalide." };
  }

  try {
    const metier = await prisma.metier.findUnique({
      where: { id },
      select: { id: true, isActif: true },
    });

    if (!metier) {
      return { success: false, error: "Métier introuvable." };
    }

    if (metier.isActif) {
      return { success: false, error: "Ce métier est déjà actif." };
    }

    await prisma.metier.update({
      where: { id },
      data: {
        isActif: true,
        deletedAt: null,
      },
    });

    revalidateAdmin();
    return { success: true };
  } catch (error) {
    console.error("restoreMetier", error);
    return { success: false, error: "Impossible de réactiver ce métier." };
  }
}

/**
 * Change le statut d'un compte freelance (validation, bannissement, remise en attente).
 * Les comptes ADMIN ne peuvent pas être modifiés.
 */
export async function updateFreelanceStatus(
  userId: number,
  status: Status,
): Promise<AdminActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." };
  }

  if (!Number.isSafeInteger(userId) || userId < 1) {
    return { success: false, error: "Identifiant de compte invalide." };
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return { success: false, error: "Statut invalide." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return { success: false, error: "Compte introuvable." };
    }

    if (user.role !== "FREELANCE") {
      return {
        success: false,
        error: "Seuls les comptes freelances peuvent être modérés.",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { validated: status },
    });

    revalidateAdmin();
    return { success: true };
  } catch (error) {
    console.error("updateFreelanceStatus", error);
    return { success: false, error: "Impossible de mettre à jour le compte." };
  }
}
