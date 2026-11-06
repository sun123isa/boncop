"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { CongoPhoneInput } from "@/features/freelance/components/CongoPhoneInput";
import type { MetierOption } from "@/features/metiers/queries";
import type { VilleOption } from "@/features/villes/queries";
import { cn } from "@/lib/cn";
import {
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/lib/status-label";
import { updateMyProfile } from "../actions";
import type { EditableProfile } from "../queries";

type ProfileEditFormProps = {
  profile: EditableProfile;
  villes: VilleOption[];
  metiers: MetierOption[];
};

export function ProfileEditForm({
  profile,
  villes,
  metiers,
}: ProfileEditFormProps) {
  const [selectedMetierIds, setSelectedMetierIds] = useState(profile.metierIds);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function toggleMetier(id: number, checked: boolean) {
    setSelectedMetierIds((current) => {
      if (checked) {
        return current.includes(id) ? current : [...current, id];
      }
      return current.filter((value) => value !== id);
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    formData.delete("metierIds");
    for (const id of selectedMetierIds) {
      formData.append("metierIds", String(id));
    }

    startTransition(async () => {
      const result = await updateMyProfile(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess(true);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
    >
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
                Mon compte
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                Informations personnelles
              </h2>
            </div>
            <Badge variant={getStatusBadgeVariant(profile.validated)}>
              {getStatusLabel(profile.validated)}
            </Badge>
          </div>

          <p className="mb-5 text-sm text-slate-500">
            Connecté avec{" "}
            <span className="font-semibold text-slate-700">{profile.email}</span>
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prénom"
              name="prenom"
              defaultValue={profile.prenom ?? ""}
            />
            <Input label="Nom" name="nom" defaultValue={profile.nom ?? ""} />
            <CongoPhoneInput
              label="Téléphone"
              name="telephone"
              defaultValue={profile.telephone ?? ""}
            />
            <CongoPhoneInput
              label="WhatsApp"
              name="whatsapp"
              defaultValue={profile.whatsapp ?? ""}
            />
            <Select
              label="Ville"
              name="ville"
              required
              defaultValue={profile.ville ?? ""}
            >
              <option value="" disabled>
                Choisir une ville
              </option>
              {villes.map((ville) => (
                <option key={ville.id} value={ville.libelle}>
                  {ville.libelle}
                </option>
              ))}
            </Select>
            <Input
              label="Quartier"
              name="quartier"
              defaultValue={profile.quartier ?? ""}
            />
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="text-xl font-extrabold text-slate-900">Présentation</h2>
          <p className="mt-1 text-sm text-slate-500">
            Décrivez votre parcours, vos compétences et vos disponibilités.
          </p>
          <Textarea
            containerClassName="mt-4"
            label="CV / description"
            name="cvDescription"
            rows={8}
            defaultValue={profile.cvDescription ?? ""}
            hint="Visible sur votre fiche publique une fois le profil validé."
          />
        </Card>

        {error ? (
          <p className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-fg">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-xl bg-success-bg px-4 py-3 text-sm text-success-fg">
            Profil enregistré.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {profile.validated === "VALIDATE" ? (
            <Link
              href={`/profile/${profile.id}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Voir ma fiche publique
            </Link>
          ) : null}
          <Button type="submit" loading={isPending}>
            Enregistrer le profil
          </Button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24">
        <Card className="flex max-h-[calc(100vh-7rem)] flex-col p-5 sm:p-6">
          <div className="shrink-0">
            <h2 className="text-xl font-extrabold text-slate-900">Métiers</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sélectionnez jusqu&apos;à 10 métiers pour apparaître dans les
              filtres.
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {selectedMetierIds.length}/10 sélectionné
              {selectedMetierIds.length > 1 ? "s" : ""}
            </p>
          </div>

          {metiers.length === 0 ? (
            <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
              Aucun métier disponible pour le moment.
            </p>
          ) : (
            <div className="mt-4 min-h-0 space-y-2 overflow-y-auto pr-1">
              {metiers.map((metier) => {
                const checked = selectedMetierIds.includes(metier.id);
                const atLimit =
                  !checked && selectedMetierIds.length >= 10;

                return (
                  <label
                    key={metier.id}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition",
                      checked
                        ? "border-brand-300 bg-brand-50 text-brand-800"
                        : "border-slate-200 text-slate-700 hover:border-brand-200 hover:bg-slate-50",
                      atLimit && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={atLimit}
                      onChange={(event) =>
                        toggleMetier(metier.id, event.target.checked)
                      }
                      className="size-4 accent-brand-600"
                    />
                    <span className="font-medium">{metier.libelle}</span>
                  </label>
                );
              })}
            </div>
          )}
        </Card>
      </aside>
    </form>
  );
}
