"use client";

import type { MouseEventHandler } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/cn";
import { ADMIN_NAV_LINK, MAIN_NAV_LINKS } from "../links";
import { NavLink, type NavLinkVariant } from "./NavLink";

export type MainNavProps = {
  /** Variante visuelle des liens (`desktop` | `mobile`). */
  variant?: Extract<NavLinkVariant, "desktop" | "mobile">;
  /** Label accessible du `<nav>`. */
  "aria-label"?: string;
  className?: string;
  /** Appelé au clic d'un lien (ex. fermer le menu mobile). */
  onNavigate?: MouseEventHandler<HTMLAnchorElement>;
};

type SessionUserWithRole = {
  role?: string;
};

/**
 * Navigation principale réutilisable (header desktop et menu mobile).
 * Les liens viennent de `MAIN_NAV_LINKS` ; le lien Admin n'apparaît que pour un ADMIN.
 */
export function MainNav({
  variant = "desktop",
  "aria-label": ariaLabel = "Navigation principale",
  className,
  onNavigate,
}: MainNavProps) {
  const { data: session, status } = useSession();
  const role = (session?.user as SessionUserWithRole | undefined)?.role;
  const isAdmin = status === "authenticated" && role === "ADMIN";

  const links = isAdmin
    ? [...MAIN_NAV_LINKS, ADMIN_NAV_LINK]
    : [...MAIN_NAV_LINKS];

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        variant === "desktop"
          ? "hidden items-center gap-8 text-sm font-medium md:flex"
          : "flex flex-col gap-1",
        className,
      )}
    >
      {links.map((link) => (
        <NavLink
          key={link.href}
          link={link}
          variant={variant}
          onClick={onNavigate}
        />
      ))}
    </nav>
  );
}
