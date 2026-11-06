import path from "node:path"
import { config } from "dotenv"
import { defineConfig } from "prisma/config"

// On force la lecture de .env.local à la racine du projet
config({ path: path.resolve(process.cwd(), ".env.local") })

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Utilise DIRECT_URL (le port 5432 de Supabase)
    url: process.env.DIRECT_URL ?? "",
  },
})