import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/db/prisma", () => ({
  default: {
    $transaction: vi.fn(),
    metier: {
      count: vi.fn(),
    },
  },
}));

vi.mock("@/features/villes/queries", () => ({
  isActiveVilleLibelle: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { isActiveVilleLibelle } from "@/features/villes/queries";
import { updateMyProfile } from "./actions";

describe("updateMyProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isActiveVilleLibelle).mockResolvedValue(true);
  });

  it("refuse un utilisateur non freelance", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", role: "ADMIN" },
    } as never);

    const formData = new FormData();
    formData.set("ville", "Brazzaville");

    await expect(updateMyProfile(formData)).resolves.toEqual({
      success: false,
      error: "Vous devez être connecté en tant que freelance.",
    });
  });

  it("enregistre le profil et les métiers", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "7", role: "FREELANCE" },
    } as never);
    vi.mocked(prisma.metier.count).mockResolvedValue(2);
    vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
      const tx = {
        user: { update: vi.fn() },
        userMetier: {
          deleteMany: vi.fn(),
          createMany: vi.fn(),
        },
      };
      await callback(tx as never);
      return tx;
    });

    const formData = new FormData();
    formData.set("prenom", "Awa");
    formData.set("ville", "Brazzaville");
    formData.append("metierIds", "2");
    formData.append("metierIds", "4");

    await expect(updateMyProfile(formData)).resolves.toEqual({
      success: true,
    });
  });
});
