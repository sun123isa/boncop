import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/db/prisma", () => ({
  default: {
    metier: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { auth } from "@/auth";
import prisma from "@/db/prisma";
import {
  getAdminAccountCounts,
  getAdminFreelanceAccounts,
  getAdminMetiers,
} from "./queries";

describe("admin queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({
      user: { role: "ADMIN" },
    } as never);
  });

  it("pagine les métiers", async () => {
    vi.mocked(prisma.metier.count).mockResolvedValue(12);
    vi.mocked(prisma.metier.findMany).mockResolvedValue([
      {
        id: 1,
        libelle: "Graphiste",
        isActif: true,
        deletedAt: null,
        createdAt: new Date("2024-01-01"),
        _count: { userMetiers: 2 },
      },
    ] as never);

    const result = await getAdminMetiers(2);

    expect(result).toMatchObject({
      total: 12,
      page: 2,
      pageSize: 8,
      totalPages: 2,
      items: [
        {
          id: 1,
          libelle: "Graphiste",
          isActif: true,
          freelancesCount: 2,
        },
      ],
    });
    expect(prisma.metier.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 8,
        take: 8,
      }),
    );
  });

  it("pagine les freelances filtrés par statut", async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(20);
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      {
        id: 8,
        email: "awa@mail.com",
        prenom: "Awa",
        nom: null,
        ville: "Brazzaville",
        validated: "ATTENTE",
        createdAt: new Date("2024-02-01"),
        userMetiers: [{ metier: { libelle: "Rédacteur" } }],
      },
    ] as never);

    const result = await getAdminFreelanceAccounts("ATTENTE", 1);

    expect(result.total).toBe(20);
    expect(result.pageSize).toBe(6);
    expect(result.items[0]?.metiers).toEqual(["Rédacteur"]);
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { role: "FREELANCE", validated: "ATTENTE" },
        skip: 0,
        take: 6,
      }),
    );
  });

  it("compte les comptes par statut", async () => {
    vi.mocked(prisma.user.count)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);

    await expect(getAdminAccountCounts()).resolves.toEqual({
      ALL: 5,
      ATTENTE: 2,
      VALIDATE: 2,
      BANNI: 1,
    });
  });
});
