"use client";

import { useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id?: string;
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

/**
 * Liste déroulante avec label visible et gestion d'erreur accessible.
 *
 * Exemple :
 * <Select label="Ville" name="ville" defaultValue="">
 *   <option value="">Toutes les villes</option>
 *   <option>Brazzaville</option>
 * </Select>
 */
export function Select({
  id,
  label,
  hint,
  error,
  className,
  containerClassName,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <label htmlFor={selectId} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <select
        {...props}
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-9 text-sm text-slate-900 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100/70 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
          error &&
            "border-danger-fg focus:border-danger-fg focus:ring-danger-bg",
          className,
        )}
      >
        {children}
      </select>
      {hint ? (
        <p id={hintId} className="text-sm text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="flex items-center gap-1 text-sm text-danger-fg"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
          >
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 3a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm0 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}
