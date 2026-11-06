import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db/prisma", () => ({
  default: {
    user: {
      count: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}));

import prisma from "@/db/prisma";
import { getPlatformStats } from "./queries";

function aggregateResult(profileViews: number | null) {
  return {
    _count: undefined,
    _avg: undefined,
    _sum: { id: null, profileViews },
    _min: undefined,
    _max: undefined,
  };
}

describe("getPlatformStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("compte et cumule uniquement les freelances validés", async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(12);
    vi.mocked(prisma.user.aggregate).mockResolvedValue(
      aggregateResult(3456),
    );

    await expect(getPlatformStats()).resolves.toEqual({
      totalFreelances: 12,
      totalViews: 3456,
    });

    expect(prisma.user.count).toHaveBeenCalledWith({
      where: {
        role: "FREELANCE",
        validated: "VALIDATE",
      },
    });
    expect(prisma.user.aggregate).toHaveBeenCalledWith({
      where: {
        role: "FREELANCE",
        validated: "VALIDATE",
      },
      _sum: {
        profileViews: true,
      },
    });
  });

  it("renvoie 0 vue quand la somme est null", async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(0);
    vi.mocked(prisma.user.aggregate).mockResolvedValue(aggregateResult(null));

    await expect(getPlatformStats()).resolves.toEqual({
      totalFreelances: 0,
      totalViews: 0,
    });
  });

  it("renvoie des valeurs de repli si la base échoue", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(prisma.user.count).mockRejectedValue(new Error("DB indisponible"));
    vi.mocked(prisma.user.aggregate).mockRejectedValue(
      new Error("DB indisponible"),
    );

    await expect(getPlatformStats()).resolves.toEqual({
      totalFreelances: 0,
      totalViews: 0,
    });
    expect(consoleError).toHaveBeenCalled();
  });
});
