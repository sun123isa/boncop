import prisma from "@/db/prisma";
import { ACTIVE_METIER_WHERE } from "./active";

export type MetierOption = {
  id: number;
  libelle: string;
};

export async function getActiveMetiers(): Promise<MetierOption[]> {
  try {
    return await prisma.metier.findMany({
      where: ACTIVE_METIER_WHERE,
      select: { id: true, libelle: true },
      orderBy: { libelle: "asc" },
    });
  } catch (error) {
    console.error("Impossible de récupérer les métiers", error);
    return [];
  }
}
