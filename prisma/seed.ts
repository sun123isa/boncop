import { config } from "dotenv"
import path from "node:path"

config({ path: path.resolve(process.cwd(), ".env.local") })

// Connexion directe (port 5432) pour le seed — évite le pooler transactionnel.
process.env.DATABASE_URL = process.env.DIRECT_URL

import prisma from "../src/db/prisma"
import bcrypt from "bcryptjs"
import { CONGO_VILLES } from "../src/features/villes/data"

/** Métiers de départ pour BonCop (Congo). Idempotent via upsert sur libelle. */
const METIERS = [
  "Développeur web",
  "Développeur mobile",
  "Graphiste",
  "Designer UI/UX",
  "Rédacteur web",
  "Community manager",
  "Photographe",
  "Vidéaste",
  "Monteur vidéo",
  "Traducteur",
  "Comptable",
  "Assistant administratif",
  "Commercial",
  "Formateur",
  "Infographiste",
  "Motion designer",
  "SEO / SEA",
  "Data analyst",
  "Électricien",
  "Plombier",
] as const

async function seedMetiers() {
  console.log("⏳ Seed des métiers...")

  for (const libelle of METIERS) {
    await prisma.metier.upsert({
      where: { libelle },
      update: {},
      create: { libelle },
    })
  }

  console.log(`✅ ${METIERS.length} métiers prêts`)
}

async function seedVilles() {
  console.log("⏳ Seed des villes du Congo...")

  for (const libelle of CONGO_VILLES) {
    await prisma.ville.upsert({
      where: { libelle },
      update: {},
      create: { libelle },
    })
  }

  console.log(`✅ ${CONGO_VILLES.length} villes prêtes`)
}

async function seedUsers() {
  console.log("⏳ Seed des comptes de test...")

  const freelancePassword = await bcrypt.hash("Test1234", 12)
  const adminPassword = await bcrypt.hash("Admin1234", 12)

  const freelance = await prisma.user.upsert({
    where: { email: "test@mail.com" },
    update: {},
    create: {
      email: "test@mail.com",
      password: freelancePassword,
      role: "FREELANCE",
      validated: "VALIDATE",
      prenom: "Test",
      nom: "Freelance",
      ville: "Brazzaville",
      quartier: "Poto-Poto",
      cvDescription:
        "Freelance polyvalent basé à Brazzaville. Disponible pour missions web et design.",
    },
  })
  console.log("✅ Compte Freelance prêt :", freelance.email)

  const admin = await prisma.user.upsert({
    where: { email: "admin@mail.com" },
    update: {},
    create: {
      email: "admin@mail.com",
      password: adminPassword,
      role: "ADMIN",
      validated: "VALIDATE",
      prenom: "Super",
      nom: "Admin",
    },
  })
  console.log("✅ Compte Admin prêt :", admin.email)

  const metiersDemo = await prisma.metier.findMany({
    where: { libelle: { in: ["Développeur web", "Graphiste"] } },
    select: { id: true },
  })

  for (const metier of metiersDemo) {
    await prisma.userMetier.upsert({
      where: {
        userId_metierId: {
          userId: freelance.id,
          metierId: metier.id,
        },
      },
      update: {},
      create: {
        userId: freelance.id,
        metierId: metier.id,
      },
    })
  }

  console.log("✅ Métiers associés au freelance de démo")
}

async function main() {
  if (!process.env.DIRECT_URL && !process.env.DATABASE_URL) {
    throw new Error("DIRECT_URL (ou DATABASE_URL) manquante dans .env.local")
  }

  await seedMetiers()
  await seedVilles()
  await seedUsers()
  console.log("🎉 Seed terminé")
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
