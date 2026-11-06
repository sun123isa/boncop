-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FREELANCE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATTENTE', 'VALIDATE', 'BANNI');

-- CreateTable
CREATE TABLE "metiers" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "nom" TEXT,
    "prenom" TEXT,
    "telephone" TEXT,
    "whatsapp" TEXT,
    "ville" TEXT,
    "quartier" TEXT,
    "cv_description" TEXT,
    "profile_views" INTEGER NOT NULL DEFAULT 0,
    "validated" "Status" NOT NULL DEFAULT 'ATTENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_metier" (
    "user_id" INTEGER NOT NULL,
    "metier_id" INTEGER NOT NULL,

    CONSTRAINT "user_metier_pkey" PRIMARY KEY ("user_id","metier_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "metiers_libelle_key" ON "metiers"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "user_metier" ADD CONSTRAINT "user_metier_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_metier" ADD CONSTRAINT "user_metier_metier_id_fkey" FOREIGN KEY ("metier_id") REFERENCES "metiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
