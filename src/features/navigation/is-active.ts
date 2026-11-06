import type { NavMatch } from "./links";

/**
 * Détermine si un lien de navigation est actif pour le pathname courant.
 *
 * - `exact` : égalité stricte (utilisé pour `/`, `/about`, etc.)
 * - `prefix` : le pathname commence par le href (ex. `/admin` actif sur `/admin/dashboard`)
 * - sans `match` : `exact` pour `/`, sinon `prefix`
 */
export function isActivePath(
  pathname: string,
  href: string,
  match?: NavMatch,
): boolean {
  const rawHref = href.trim();

  // Placeholders légaux (`#`) ou ancres seules : jamais actifs.
  if (!rawHref || rawHref === "#") {
    return false;
  }

  const path = normalizePath(pathname);
  const pathOnly = rawHref.split("#")[0] ?? rawHref;

  if (!pathOnly) {
    return false;
  }

  const target = normalizePath(pathOnly);

  const strategy = match ?? (target === "/" ? "exact" : "prefix");

  if (strategy === "exact") {
    return path === target;
  }

  if (target === "/") {
    return path === "/";
  }

  return path === target || path.startsWith(`${target}/`);
}

function normalizePath(value: string): string {
  if (!value) {
    return "/";
  }

  const trimmed = value.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}
