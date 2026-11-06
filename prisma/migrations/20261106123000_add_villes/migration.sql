-- Référentiel des villes du Congo
CREATE TABLE "villes" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "is_actif" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "villes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "villes_libelle_key" ON "villes"("libelle");
CREATE INDEX "villes_is_actif_idx" ON "villes"("is_actif");
