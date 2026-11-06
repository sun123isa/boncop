import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-success-bg text-success-fg ring-success-fg/20",
  warning: "bg-warning-bg text-warning-fg ring-warning-fg/20",
  danger: "bg-danger-bg text-danger-fg ring-danger-fg/20",
  info: "bg-info-bg text-info-fg ring-info-fg/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
};

/**
 * Badge de statut. L'information ne doit jamais reposer sur la couleur seule :
 * le libellé porte le sens.
 *
 * Exemple :
 * <Badge variant="success">Validé</Badge>
 */
export function Badge({
  variant = "neutral",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
