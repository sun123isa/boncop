type ClassValue = string | number | false | null | undefined;

/**
 * Fusionne des classes conditionnelles en une chaîne unique.
 *
 * Volontairement sans dépendance : la fusion est une simple concaténation
 * (pas de résolution de conflits Tailwind). Pour un composant, placer les
 * classes de base en premier et laisser `className` en dernier afin que
 * l'appelant puisse surcharger visuellement.
 *
 * Exemple :
 * cn("rounded-sm px-4", isActive && "bg-brand-600", className)
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
