import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
};

/**
 * Bloc de chargement. Toujours `aria-hidden` : l'annonce est portée par
 * `SkeletonRegion`, une seule fois pour tout l'écran.
 *
 * Exemple :
 * <Skeleton className="h-4 w-32" />
 */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn("skeleton", className)}
    />
  );
}

export type SkeletonRegionProps = {
  label?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Conteneur de squelettes : annonce un unique message aux lecteurs d'écran.
 *
 * Exemple :
 * <SkeletonRegion label="Chargement des profils">
 *   <ProfileCardSkeleton />
 * </SkeletonRegion>
 */
export function SkeletonRegion({
  label = "Chargement en cours",
  className,
  children,
}: SkeletonRegionProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={className}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
