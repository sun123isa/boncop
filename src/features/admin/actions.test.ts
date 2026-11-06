import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/db/prisma", () => ({
  default: {
    metier: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { auth } from "@/auth";
import prisma from "@/db/prisma";
import {
  createMetier,
  deleteMetier,
  restoreMetier,
  updateFreelanceStatus,
} from "./actions";

describe("admin actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("refuse createMetier sans session admin", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);

    await expect(createMetier("Graphiste")).resolves.toEqual({
      success: false,
      error: "Accès réservé aux administrateurs.",
    });
  });

  it("crée un métier quand l'admin est authentifié", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { role: "ADMIN" },
    } as never);
    vi.mocked(prisma.metier.findUnique).mockResolvedValue(null as never);
    vi.mocked(prisma.metier.create).mockResolvedValue({
      id: 1,
      libelle: "Graphiste",
    } as never);

    await expect(createMetier("  Graphiste  ")).resolves.toEqual({
      success: true,
    });
    expect(prisma.metier.create).toHaveBeenCalledWith({
      data: {
        libelle: "Graphiste",
        isActif: true,
        deletedAt: null,
      },
    });
  });

  it("réactive un métier soft-deleted à la création", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { role: "ADMIN" },
    } as never);
    vi.mocked(prisma.metier.findUnique).mockResolvedValue({
      id: 4,
      isActif: false,
      deletedAt: new Date(),
    } as never);
    vi.mocked(prisma.metier.update).mockResolvedValue({} as never);

    await expect(createMetier("Graphiste")).resolves.toEqual({
      success: true,
    });
    expect(prisma.metier.update).toHaveBeenCalledWith({
      where: { id: 4 },
      data: { isActif: true, deletedAt: null },
    });
  });

  it("soft-delete un métier", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { role: "ADMIN" },
    } as never);
    vi.mocked(prisma.metier.findUnique).mockResolvedValue({
      id: 3,
      isActif: true,
    } as never);
    vi.mocked(prisma.metier.update).mockResolvedValue({} as never);

    await expect(deleteMetier(3)).resolves.toEqual({ success: true });
    expect(prisma.metier.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: {
        isActif: false,
        deletedAt: expect.any(Date),
      },
    });
    expect(prisma.metier.delete).not.toHaveBeenCalled();
  });

  it("restaure un métier", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { role: "ADMIN" },
    } as never);
    vi.mocked(prisma.metier.findUnique).mockResolvedValue({
      id: 3,
      isActif: false,
    } as never);
    vi.mocked(prisma.metier.update).mockResolvedValue({} as never);

    await expect(restoreMetier(3)).resolves.toEqual({ success: true });
  });

  it("valide un compte freelance", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { role: "ADMIN" },
    } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 12,
      role: "FREELANCE",
    } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({} as never);

    await expect(updateFreelanceStatus(12, "VALIDATE")).resolves.toEqual({
      success: true,
    });
  });

  it("refuse de modifier un compte ADMIN", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { role: "ADMIN" },
    } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 1,
      role: "ADMIN",
    } as never);

    await expect(updateFreelanceStatus(1, "BANNI")).resolves.toEqual({
      success: false,
      error: "Seuls les comptes freelances peuvent être modérés.",
    });
  });
});
