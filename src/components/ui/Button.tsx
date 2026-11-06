import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-700 text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-800 active:translate-y-0",
  secondary:
    "border border-slate-200 bg-white text-slate-700 shadow-soft hover:-translate-y-0.5 hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100",
  danger: "bg-danger-fg text-white shadow-soft hover:brightness-90",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-6 text-base",
};

/**
 * Bouton générique BonCop, style pilule vert marque.
 *
 * Exemple :
 * <Button variant="primary" size="md" onClick={save}>Enregistrer</Button>
 * <Button variant="secondary" loading>Envoi en cours</Button>
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:border-transparent disabled:bg-none disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:hover:translate-y-0",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      <span className={loading ? "opacity-0" : undefined}>{children}</span>
      {loading ? (
        <span className="absolute inset-0 grid place-items-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 animate-spin"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
              fill="currentColor"
              className="opacity-75"
            />
          </svg>
        </span>
      ) : null}
    </button>
  );
}
