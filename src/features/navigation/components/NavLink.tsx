"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import { isActivePath } from "../is-active";
import type { NavLinkItem } from "../links";

export type NavLinkVariant = "desktop" | "mobile" | "footer";

export type NavLinkProps = {
  link: NavLinkItem;
  variant?: NavLinkVariant;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const variantClasses: Record<NavLinkVariant, string> = {
  desktop:
    "nav-link inline-flex min-h-11 items-center text-slate-600 transition hover:text-slate-900",
  mobile:
    "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50",
  footer:
    "inline-flex min-h-11 items-center text-slate-400 transition hover:text-white",
};

const activeClasses: Record<NavLinkVariant, string> = {
  desktop: "is-active text-slate-900",
  mobile: "bg-slate-50 font-semibold text-brand-600",
  footer: "text-white",
};

/**
 * Lien de navigation avec état actif basé sur le pathname courant.
 * Utilise `aria-current="page"` pour l'accessibilité.
 */
export function NavLink({
  link,
  variant = "desktop",
  className,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, link.href, link.match);

  return (
    <Link
      href={link.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        variantClasses[variant],
        active && activeClasses[variant],
        className,
      )}
    >
      {link.label}
    </Link>
  );
}
