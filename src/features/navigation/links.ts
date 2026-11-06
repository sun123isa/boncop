export type NavMatch = "exact" | "prefix";

export type NavLinkItem = {
  href: string;
  label: string;
  /** Stratégie de matching pour l'état actif. Défaut : `prefix` (sauf `/` → `exact`). */
  match?: NavMatch;
};

/**
 * Liens de navigation principale (header desktop + mobile).
 * Source unique — ne plus dupliquer ces href/label dans le layout.
 */
export const MAIN_NAV_LINKS = [
  { href: "/", label: "Accueil", match: "exact" },
  { href: "/search", label: "Explorer" },
  { href: "/about", label: "À propos", match: "exact" },
] as const satisfies readonly NavLinkItem[];

/** Lien visible uniquement pour les comptes ADMIN. */
export const ADMIN_NAV_LINK = {
  href: "/admin/dashboard",
  label: "Admin",
} as const satisfies NavLinkItem;

/** Colonne « Navigation » du footer. */
export const FOOTER_NAV_LINKS = [
  { href: "/", label: "Accueil", match: "exact" },
  { href: "/search", label: "Explorer" },
  { href: "/about", label: "À propos", match: "exact" },
  { href: "/register", label: "S'inscrire", match: "exact" },
] as const satisfies readonly NavLinkItem[];

/** Colonne « Mon compte » du footer. */
export const FOOTER_ACCOUNT_LINKS = [
  { href: "/login", label: "Connexion", match: "exact" },
  { href: "/register", label: "Inscription", match: "exact" },
] as const satisfies readonly NavLinkItem[];

/** Colonne « Légal » du footer (placeholders pour l'instant). */
export const FOOTER_LEGAL_LINKS = [
  { href: "#", label: "Mentions légales" },
  { href: "#", label: "Confidentialité" },
  { href: "#", label: "CGU" },
] as const satisfies readonly NavLinkItem[];
