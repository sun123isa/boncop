import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db/prisma", () => ({
  default: {
    user: {
      findMany: vi.fn(),
    },
  },
}));

import prisma from "@/db/prisma";
import { getTopFreelances } from "./queries";

describe("getTopFreelances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne les freelances validés les plus consultés et aplatit leurs métiers", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      {
        id: 7,
        prenom: "Ada",
        nom: "Nkosi",
        ville: "Brazzaville",
        quartier: "Bacongo",
        profileViews: 42,
        userMetiers: [
          { metier: { libelle: "Graphiste" } },
          { metier: { libelle: "Développeuse web" } },
        ],
      },
    ] as never);

    await expect(getTopFreelances()).resolves.toEqual([
      {
        id: 7,
        prenom: "Ada",
        nom: "Nkosi",
        ville: "Brazzaville",
        quartier: "Bacongo",
        profileViews: 42,
        metiers: ["Graphiste", "Développeuse web"],
      },
    ]);

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { role: "FREELANCE", validated: "VALIDATE" },
        orderBy: [{ profileViews: "desc" }, { id: "asc" }],
        take: 5,
      }),
    );
  });

  it("borne la limite demandée à 20 profils", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValue([] as never);

    await getTopFreelances(99);

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 20 }),
    );
  });

  it("retourne une liste vide si la base est indisponible", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(prisma.user.findMany).mockRejectedValue(new Error("db down"));

    await expect(getTopFreelances()).resolves.toEqual([]);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
