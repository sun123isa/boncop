import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db/prisma", () => ({
  default: {
    user: {
      updateMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

import prisma from "@/db/prisma";
import { findFreelanceProfile, getFreelanceProfile } from "./queries";

const row = {
  id: 18,
  prenom: "Alex",
  nom: "Mabiala",
  telephone: "06 123 45 67",
  whatsapp: "+242061234567",
  ville: "Brazzaville",
  quartier: "Moungali",
  cvDescription: "Développeur web",
  profileViews: 4,
  createdAt: new Date("2024-01-15"),
  userMetiers: [
    {
      metier: {
        libelle: "Développeur web",
      },
    },
  ],
};

describe("findFreelanceProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("refuse un identifiant invalide sans interroger la base", async () => {
    await expect(findFreelanceProfile(0)).resolves.toBeNull();
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
  });

  it("retourne le profil aplati sans incrémenter les vues", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(row as never);

    await expect(findFreelanceProfile(18)).resolves.toEqual({
      id: 18,
      prenom: "Alex",
      nom: "Mabiala",
      telephone: "06 123 45 67",
      whatsapp: "+242061234567",
      ville: "Brazzaville",
      quartier: "Moungali",
      cvDescription: "Développeur web",
      profileViews: 4,
      createdAt: new Date("2024-01-15"),
      metiers: ["Développeur web"],
    });

    expect(prisma.user.updateMany).not.toHaveBeenCalled();
  });
});

describe("getFreelanceProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("refuse un identifiant invalide sans interroger la base", async () => {
    await expect(getFreelanceProfile(0)).resolves.toBeNull();
    await expect(getFreelanceProfile(Number.NaN)).resolves.toBeNull();

    expect(prisma.user.updateMany).not.toHaveBeenCalled();
  });

  it("renvoie null si le profil est absent, en attente ou banni", async () => {
    vi.mocked(prisma.user.updateMany).mockResolvedValue({ count: 0 } as never);

    await expect(getFreelanceProfile(18)).resolves.toBeNull();
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
  });

  it("compte la consultation et retourne le profil avec ses métiers", async () => {
    vi.mocked(prisma.user.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.user.findFirst).mockResolvedValue(row as never);

    await expect(getFreelanceProfile(18)).resolves.toEqual({
      id: 18,
      prenom: "Alex",
      nom: "Mabiala",
      telephone: "06 123 45 67",
      whatsapp: "+242061234567",
      ville: "Brazzaville",
      quartier: "Moungali",
      cvDescription: "Développeur web",
      profileViews: 4,
      createdAt: new Date("2024-01-15"),
      metiers: ["Développeur web"],
    });

    expect(prisma.user.updateMany).toHaveBeenCalledWith({
      where: {
        id: 18,
        role: "FREELANCE",
        validated: "VALIDATE",
      },
      data: {
        profileViews: {
          increment: 1,
        },
      },
    });
  });
});
