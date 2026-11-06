import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type LinkButtonVariant = "primary" | "secondary" | "ghost";
export type LinkButtonSize = "md" | "lg";

export type LinkButtonProps = {
  href: string;
  variant?: LinkButtonVariant;
  size?: LinkButtonSize;
  className?: string;
  children: ReactNode;
};

const variants: Record<LinkButtonVariant, string> = {
  primary:
    "bg-brand-700 text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-800 active:translate-y-0",
  secondary:
    "border border-slate-200 bg-white text-slate-700 shadow-soft hover:-translate-y-0.5 hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100",
};

const sizes: Record<LinkButtonSize, string> = {
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-[52px] px-6 text-base",
};

/**
 * Lien stylé comme un bouton, à réserver à la navigation.
 * Pour une action (soumission, mutation, ouverture de modale), utiliser `Button`.
 *
 * Exemple :
 * <LinkButton href="/search" variant="primary" size="lg">
 *   Trouver un freelance
 * </LinkButton>
 */
export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
