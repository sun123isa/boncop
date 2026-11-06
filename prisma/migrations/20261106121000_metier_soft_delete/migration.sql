-- Soft delete pour les métiers : désactivation sans suppression physique
ALTER TABLE "metiers" ADD COLUMN "is_actif" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "metiers" ADD COLUMN "deleted_at" TIMESTAMP(3);

CREATE INDEX "metiers_is_actif_idx" ON "metiers"("is_actif");
