/**
 * Filtre métier actif (soft delete).
 * Sur une relation to-one Prisma 7, utiliser `is: ACTIVE_METIER_WHERE`.
 */
export const ACTIVE_METIER_WHERE = {
  isActif: true,
  deletedAt: null,
} as const;

export const ACTIVE_METIER_RELATION_FILTER = {
  is: ACTIVE_METIER_WHERE,
} as const;
