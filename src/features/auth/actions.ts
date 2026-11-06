"use server"

import bcrypt from "bcryptjs"
import { z } from "zod"
import prisma from "@/db/prisma"
import { auth } from "@/auth"
import { normalizeCongoPhone } from "@/features/freelance/contact"
import { isActiveVilleLibelle } from "@/features/villes/queries"

const RegisterSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  prenom: z.string().min(1).optional(),
  nom: z.string().min(1).optional(),
  telephone: z.string().optional(),
  whatsapp: z.string().optional(),
  ville: z.string().min(1, "Choisissez une ville"),
  quartier: z.string().min(1).optional(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>

export type RegisterResult =
  | { success: true; userId: number }
  | { success: false; error: string }

export async function registerUser(input: unknown): Promise<RegisterResult> {
  const parsed = RegisterSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    }
  }

  const { email, password, ville, telephone, whatsapp, ...rest } = parsed.data
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedVille = ville.trim()

  let normalizedTelephone: string | null = null
  if (telephone?.trim()) {
    normalizedTelephone = normalizeCongoPhone(telephone)
    if (!normalizedTelephone) {
      return {
        success: false,
        error: "Téléphone invalide. Format attendu : 06 123 45 67",
      }
    }
  }

  let normalizedWhatsapp: string | null = null
  if (whatsapp?.trim()) {
    normalizedWhatsapp = normalizeCongoPhone(whatsapp)
    if (!normalizedWhatsapp) {
      return {
        success: false,
        error: "WhatsApp invalide. Format attendu : 06 123 45 67",
      }
    }
  }

  const villeOk = await isActiveVilleLibelle(normalizedVille)
  if (!villeOk) {
    return { success: false, error: "Ville invalide. Choisissez une ville de la liste." }
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  })
  if (existing) {
    return { success: false, error: "Cet email est déjà utilisé" }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
      role: "FREELANCE",
      validated: "ATTENTE",
      ville: normalizedVille,
      telephone: normalizedTelephone,
      whatsapp: normalizedWhatsapp,
      ...rest,
    },
    select: { id: true },
  })

  return { success: true, userId: user.id }
}

export async function verifySession() {
  const session = await auth()
  return session ?? null
}
