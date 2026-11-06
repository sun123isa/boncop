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
    // DIRECT_URL (Supabase :5432) en priorité, sinon DATABASE_URL (Vercel / pooler)
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
})