import prisma from "@/db/prisma";

export type PlatformStats = {
  totalFreelances: number;
  totalViews: number;
};

const VALIDATED_FREELANCE_FILTER = {
  role: "FREELANCE",
  validated: "VALIDATE",
} as const;


export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const [totalFreelances, views] = await Promise.all([
      prisma.user.count({
        where: VALIDATED_FREELANCE_FILTER,
      }),
      prisma.user.aggregate({
        where: VALIDATED_FREELANCE_FILTER,
        _sum: {
          profileViews: true,
        },
      }),
    ]);

    return {
      totalFreelances,
      totalViews: views._sum?.profileViews ?? 0,
    };
  } catch (error) {
    console.error(
      "Impossible de récupérer les statistiques de la plateforme",
      error,
    );

    return {
      totalFreelances: 0,
      totalViews: 0,
    };
  }
}
