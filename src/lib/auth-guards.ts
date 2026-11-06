export type AuthGuardInput = {
  path: string
  isLogged: boolean
  role?: string
  validated?: string
}

/**
 * Destinations sûres après login (chemins relatifs uniquement).
 */
export function safeCallbackUrl(value: string | null | undefined): string | null {
  if (!value) return null
  if (!value.startsWith("/") || value.startsWith("//")) return null
  return value
}

/**
 * Destination post-login selon le rôle et un éventuel callbackUrl.
 * - ADMIN → /admin/dashboard (sauf callback admin explicite)
 * - autres → callback sûr ou /
 */
export function resolvePostLoginRedirect(input: {
  role?: string | null
  callbackUrl?: string | null
}): string {
  const callback = safeCallbackUrl(input.callbackUrl)

  if (input.role === "ADMIN") {
    if (callback?.startsWith("/admin")) return callback
    return "/admin/dashboard"
  }

  return callback ?? "/"
}

export function decideAuthRedirect(input: AuthGuardInput): string | null {
  const { path, isLogged, role, validated } = input

  if (path.startsWith("/admin")) {
    if (!isLogged) {
      return `/login?callbackUrl=${encodeURIComponent(path)}`
    }
    if (role !== "ADMIN") return "/"
  }

  if (path.startsWith("/profile/edit")) {
    if (!isLogged) {
      return `/login?callbackUrl=${encodeURIComponent(path)}`
    }
    if (role !== "FREELANCE") return "/"
    if (validated === "BANNI") return "/"
  }

  return null
}
