import type { Status } from "@/generated/prisma/client";
import prisma from "@/db/prisma";
import {
  ACTIVE_METIER_RELATION_FILTER,
  ACTIVE_METIER_WHERE,
} from "../metiers/active";
import {
  ACCOUNTS_PAGE_SIZE,
  METIERS_PAGE_SIZE,
  buildPaginatedResult,
  type PaginatedResult,
} from "./pagination";
import { requireAdmin } from "./require-admin";

export type AdminMetier = {
  id: number;
  libelle: string;
  isActif: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  freelancesCount: number;
};

export type AdminFreelanceAccount = {
  id: number;
  email: string;
  prenom: string | null;
  nom: string | null;
  ville: string | null;
  validated: Status;
  createdAt: Date;
  metiers: string[];
};

export type AccountStatusFilter = Status | "ALL";

export async function getAdminMetiers(
  page = 1,
): Promise<PaginatedResult<AdminMetier>> {
  await requireAdmin();

  const safePage = Math.max(1, page);

  try {
    const total = await prisma.metier.count();
    const pagination = buildPaginatedResult<AdminMetier>(
      [],
      total,
      safePage,
      METIERS_PAGE_SIZE,
    );

    const rows = await prisma.metier.findMany({
      select: {
        id: true,
        libelle: true,
        isActif: true,
        deletedAt: true,
        createdAt: true,
        _count: {
          select: { userMetiers: true },
        },
      },
      orderBy: [{ isActif: "desc" }, { libelle: "asc" }],
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    return {
      ...pagination,
      items: rows.map((row) => ({
        id: row.id,
        libelle: row.libelle,
        isActif: row.isActif,
        deletedAt: row.deletedAt,
        createdAt: row.createdAt,
        freelancesCount: row._count.userMetiers,
      })),
    };
  } catch (error) {
    console.error("Impossible de récupérer les métiers", error);
    return buildPaginatedResult([], 0, 1, METIERS_PAGE_SIZE);
  }
}

export async function getAdminFreelanceAccounts(
  status: AccountStatusFilter = "ALL",
  page = 1,
): Promise<PaginatedResult<AdminFreelanceAccount>> {
  await requireAdmin();

  const safePage = Math.max(1, page);
  const where = {
    role: "FREELANCE" as const,
    ...(status === "ALL" ? {} : { validated: status }),
  };

  try {
    const total = await prisma.user.count({ where });
    const pagination = buildPaginatedResult<AdminFreelanceAccount>(
      [],
      total,
      safePage,
      ACCOUNTS_PAGE_SIZE,
    );

    const rows = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        prenom: true,
        nom: true,
        ville: true,
        validated: true,
        createdAt: true,
        userMetiers: {
          where: {
            metier: ACTIVE_METIER_RELATION_FILTER,
          },
          select: {
            metier: {
              select: { libelle: true },
            },
          },
        },
      },
      orderBy: [{ validated: "asc" }, { createdAt: "desc" }],
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    return {
      ...pagination,
      items: rows.map((row) => ({
        id: row.id,
        email: row.email,
        prenom: row.prenom,
        nom: row.nom,
        ville: row.ville,
        validated: row.validated,
        createdAt: row.createdAt,
        metiers: row.userMetiers.map(({ metier }) => metier.libelle),
      })),
    };
  } catch (error) {
    console.error("Impossible de récupérer les comptes freelances", error);
    return buildPaginatedResult([], 0, 1, ACCOUNTS_PAGE_SIZE);
  }
}

export async function getAdminAccountCounts(): Promise<
  Record<Status | "ALL", number>
> {
  await requireAdmin();

  try {
    const [all, attente, validate, banni] = await Promise.all([
      prisma.user.count({ where: { role: "FREELANCE" } }),
      prisma.user.count({
        where: { role: "FREELANCE", validated: "ATTENTE" },
      }),
      prisma.user.count({
        where: { role: "FREELANCE", validated: "VALIDATE" },
      }),
      prisma.user.count({
        where: { role: "FREELANCE", validated: "BANNI" },
      }),
    ]);

    return {
      ALL: all,
      ATTENTE: attente,
      VALIDATE: validate,
      BANNI: banni,
    };
  } catch (error) {
    console.error("Impossible de compter les comptes", error);
    return { ALL: 0, ATTENTE: 0, VALIDATE: 0, BANNI: 0 };
  }
}

/** Total métiers actifs (cartes résumé). */
export async function getAdminMetiersTotal(): Promise<number> {
  await requireAdmin();

  try {
    return await prisma.metier.count({ where: ACTIVE_METIER_WHERE });
  } catch (error) {
    console.error("Impossible de compter les métiers", error);
    return 0;
  }
}
