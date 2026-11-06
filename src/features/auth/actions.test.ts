import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/db/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(() => Promise.resolve("hashed-password")),
    compare: vi.fn(),
  },
}))

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}))

vi.mock("@/features/villes/queries", () => ({
  isActiveVilleLibelle: vi.fn(),
}))

import { registerUser, verifySession } from "./actions"
import prisma from "@/db/prisma"
import { auth } from "@/auth"
import { isActiveVilleLibelle } from "@/features/villes/queries"

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isActiveVilleLibelle).mockResolvedValue(true)
  })

  it("rejette un email invalide", async () => {
    const result = await registerUser({
      email: "pas-un-email",
      password: "12345678",
      ville: "Brazzaville",
    })
    expect(result.success).toBe(false)
  })

  it("rejette un mot de passe trop court", async () => {
    const result = await registerUser({
      email: "a@b.com",
      password: "123",
      ville: "Brazzaville",
    })
    expect(result.success).toBe(false)
  })

  it("exige une ville", async () => {
    const result = await registerUser({
      email: "a@b.com",
      password: "12345678",
    })
    expect(result.success).toBe(false)
  })

  it("refuse une ville hors référentiel", async () => {
    vi.mocked(isActiveVilleLibelle).mockResolvedValue(false)

    const result = await registerUser({
      email: "a@b.com",
      password: "12345678",
      ville: "Paris",
    })

    expect(result.success).toBe(false)
    if (!result.success) expect(result.error).toContain("Ville invalide")
  })

  it("refuse un email déjà utilisé", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 1 } as never)

    const result = await registerUser({
      email: "a@b.com",
      password: "12345678",
      ville: "Brazzaville",
    })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error).toContain("déjà utilisé")
  })

  it("crée le freelance avec role FREELANCE et validated ATTENTE", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({ id: 42 } as never)

    const result = await registerUser({
      email: "New@B.com",
      password: "12345678",
      ville: "Brazzaville",
    })

    expect(result).toEqual({ success: true, userId: 42 })
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "new@b.com",
          role: "FREELANCE",
          validated: "ATTENTE",
          password: "hashed-password",
          ville: "Brazzaville",
        }),
      }),
    )
  })
})

describe("verifySession", () => {
  it("retourne null sans session", async () => {
    vi.mocked(auth).mockResolvedValue(null as never)
    expect(await verifySession()).toBeNull()
  })

  it("retourne la session si connecté", async () => {
    const session = { user: { email: "a@b.com" } }
    vi.mocked(auth).mockResolvedValue(session as never)
    expect(await verifySession()).toEqual(session)
  })
})
