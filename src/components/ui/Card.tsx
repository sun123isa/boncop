import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardProps = {
  interactive?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Carte générique. `interactive` ajoute une légère élévation au survol,
 * pour une carte cliquable ou un lien.
 *
 * Exemple :
 * <Card interactive><ProfileSummary /></Card>
 */
export function Card({
  interactive = false,
  className,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft",
        interactive &&
          "transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}
