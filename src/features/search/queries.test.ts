import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db/prisma", () => ({
  default: {
    metier: {
      findMany: vi.fn(),
    },
    ville: {
      findMany: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
  },
}));

import prisma from "@/db/prisma";
import { getSearchFreelances, getSearchOptions } from "./queries";

describe("getSearchOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne les métiers et les villes actives du référentiel", async () => {
    vi.mocked(prisma.metier.findMany).mockResolvedValue([
      { id: 1, libelle: "Graphiste" },
    ] as never);
    vi.mocked(prisma.ville.findMany).mockResolvedValue([
      { libelle: "Brazzaville" },
      { libelle: "Pointe-Noire" },
    ] as never);

    await expect(getSearchOptions()).resolves.toEqual({
      metiers: [{ id: 1, libelle: "Graphiste" }],
      cities: ["Brazzaville", "Pointe-Noire"],
    });

    expect(prisma.ville.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          isActif: true,
          deletedAt: null,
        },
      }),
    );
  });

  it("renvoie des listes vides si la base est indisponible", async () => {
    vi.mocked(prisma.metier.findMany).mockRejectedValue(new Error("down"));

    await expect(getSearchOptions()).resolves.toEqual({
      cities: [],
      metiers: [],
    });
  });
});

describe("getSearchFreelances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("combine la ville et les métiers, sans doublons ni identifiants invalides", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValue([] as never);

    await getSearchFreelances({
      ville: " Brazzaville ",
      metierIds: [3, 3, 0, -2, 5],
    });

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          role: "FREELANCE",
          validated: "VALIDATE",
          ville: {
            equals: "Brazzaville",
            mode: "insensitive",
          },
          userMetiers: {
            some: {
              metierId: {
                in: [3, 5],
              },
              metier: {
                is: {
                  isActif: true,
                  deletedAt: null,
                },
              },
            },
          },
        },
        take: 30,
      }),
    );
  });

  it("aplatit les métiers pour les cartes profil", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      {
        id: 7,
        prenom: "Awa",
        nom: "Kouassi",
        ville: "Brazzaville",
        quartier: "Poto-Poto",
        cvDescription: "Designer UI",
        profileViews: 12,
        userMetiers: [{ metier: { libelle: "Graphiste" } }],
      },
    ] as never);

    await expect(
      getSearchFreelances({ metierIds: [] }),
    ).resolves.toEqual([
      {
        id: 7,
        prenom: "Awa",
        nom: "Kouassi",
        ville: "Brazzaville",
        quartier: "Poto-Poto",
        cvDescription: "Designer UI",
        profileViews: 12,
        metiers: ["Graphiste"],
      },
    ]);
  });
});
