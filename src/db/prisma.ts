import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import path from "node:path";

// Forcer le chargement de .env.local AVANT de créer l'adaptateur
config({ path: path.resolve(process.cwd(), ".env.local") });

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error("DATABASE_URL n'est pas définie. Vérifie ton .env.local.");
  }

  // PrismaPg / undici lèvent ERR_INVALID_URL si la chaîne est mal formée
  try {
    // new URL n'accepte pas le schéma postgresql: — on valide via un schéma http
    void new URL(connectionString.replace(/^postgres(ql)?:/i, "http:"));
  } catch {
    throw new Error(
      "DATABASE_URL est invalide. Attendu: postgresql://USER:PASSWORD@HOST:PORT/DB",
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
