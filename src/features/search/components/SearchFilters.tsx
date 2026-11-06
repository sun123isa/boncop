"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";

type SearchFiltersProps = {
  cities: string[];
  metiers: Array<{
    id: number;
    libelle: string;
  }>;
  selectedCity: string;
  selectedMetierIds: number[];
};

function buildSearchHref(ville: string, metierId: string): string {
  const params = new URLSearchParams();
  if (ville) params.set("ville", ville);
  if (metierId) params.set("metierIds", metierId);
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export function SearchFilters({
  cities,
  metiers,
  selectedCity,
  selectedMetierIds,
}: SearchFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const selectedMetierId =
    selectedMetierIds.length > 0 ? String(selectedMetierIds[0]) : "";

  function navigate(ville: string, metierId: string) {
    startTransition(() => {
      router.push(buildSearchHref(ville, metierId));
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ville = String(formData.get("ville") ?? "").trim();
    const metierId = String(formData.get("metierIds") ?? "").trim();
    navigate(ville, metierId);
  }

  function onVilleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    navigate(event.target.value, selectedMetierId);
  }

  function onMetierChange(event: React.ChangeEvent<HTMLSelectElement>) {
    navigate(selectedCity, event.target.value);
  }

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="ville"
            name="ville"
            label="Ville"
            value={selectedCity}
            onChange={onVilleChange}
          >
            <option value="">Toutes les villes</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>

          <Select
            id="metierIds"
            name="metierIds"
            label="Métier"
            value={selectedMetierId}
            onChange={onMetierChange}
            disabled={metiers.length === 0}
            hint={
              metiers.length === 0
                ? "Aucun métier disponible pour le moment."
                : undefined
            }
          >
            <option value="">Tous les métiers</option>
            {metiers.map((metier) => (
              <option key={metier.id} value={metier.id}>
                {metier.libelle}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isPending || (!selectedCity && !selectedMetierId)}
            onClick={() => navigate("", "")}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-soft transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Effacer les filtres
          </button>
          <Button type="submit" loading={isPending}>
            Rechercher
          </Button>
        </div>
      </form>
    </Card>
  );
}
