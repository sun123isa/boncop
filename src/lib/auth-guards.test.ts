import { describe, it, expect } from "vitest"
import {
  decideAuthRedirect,
  resolvePostLoginRedirect,
  safeCallbackUrl,
} from "./auth-guards"

describe("decideAuthRedirect — routes /admin", () => {
  it("redirige un visiteur non connecté vers /login avec callbackUrl", () => {
    const result = decideAuthRedirect({ path: "/admin/dashboard", isLogged: false })
    expect(result).toBe("/login?callbackUrl=%2Fadmin%2Fdashboard")
  })

  it("redirige un FREELANCE connecté vers /", () => {
    const result = decideAuthRedirect({ path: "/admin", isLogged: true, role: "FREELANCE" })
    expect(result).toBe("/")
  })

  it("laisse passer un ADMIN connecté", () => {
    const result = decideAuthRedirect({ path: "/admin", isLogged: true, role: "ADMIN" })
    expect(result).toBeNull()
  })
})

describe("decideAuthRedirect — routes /profile/edit", () => {
  it("redirige un visiteur non connecté vers /login avec callbackUrl", () => {
    const result = decideAuthRedirect({ path: "/profile/edit", isLogged: false })
    expect(result).toBe("/login?callbackUrl=%2Fprofile%2Fedit")
  })

  it("redirige un ADMIN vers /", () => {
    const result = decideAuthRedirect({ path: "/profile/edit", isLogged: true, role: "ADMIN" })
    expect(result).toBe("/")
  })

  it("redirige un FREELANCE BANNI vers /", () => {
    const result = decideAuthRedirect({
      path: "/profile/edit", isLogged: true, role: "FREELANCE", validated: "BANNI"
    })
    expect(result).toBe("/")
  })

  it("laisse passer un FREELANCE VALIDATE", () => {
    const result = decideAuthRedirect({
      path: "/profile/edit", isLogged: true, role: "FREELANCE", validated: "VALIDATE"
    })
    expect(result).toBeNull()
  })

  it("laisse passer un FREELANCE ATTENTE", () => {
    const result = decideAuthRedirect({
      path: "/profile/edit", isLogged: true, role: "FREELANCE", validated: "ATTENTE"
    })
    expect(result).toBeNull()
  })
})

describe("decideAuthRedirect — routes publiques", () => {
  it("ne redirige pas une route publique", () => {
    const result = decideAuthRedirect({ path: "/", isLogged: false })
    expect(result).toBeNull()
  })
})

describe("resolvePostLoginRedirect", () => {
  it("envoie un ADMIN vers le dashboard par défaut", () => {
    expect(resolvePostLoginRedirect({ role: "ADMIN" })).toBe("/admin/dashboard")
  })

  it("respecte un callback admin pour un ADMIN", () => {
    expect(
      resolvePostLoginRedirect({
        role: "ADMIN",
        callbackUrl: "/admin/dashboard",
      }),
    ).toBe("/admin/dashboard")
  })

  it("ignore un callback non-admin pour un ADMIN", () => {
    expect(
      resolvePostLoginRedirect({
        role: "ADMIN",
        callbackUrl: "/profile/edit",
      }),
    ).toBe("/admin/dashboard")
  })

  it("envoie un freelance vers le callback sûr ou /", () => {
    expect(resolvePostLoginRedirect({ role: "FREELANCE" })).toBe("/")
    expect(
      resolvePostLoginRedirect({
        role: "FREELANCE",
        callbackUrl: "/profile/edit",
      }),
    ).toBe("/profile/edit")
  })

  it("rejette les callbackUrl externes", () => {
    expect(safeCallbackUrl("//evil.com")).toBeNull()
    expect(safeCallbackUrl("https://evil.com")).toBeNull()
  })
})
