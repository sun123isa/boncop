import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";
import { Icon } from "@/features/home/icons";
import { ProfileCard } from "@/features/home/ProfileCard";
import { SearchFilters } from "@/features/search/components/SearchFilters";
import {
  getSearchFreelances,
  getSearchOptions,
} from "@/features/search/queries";

type SearchParams = {
  ville?: string | string[];
  metierIds?: string | string[];
};

type SearchPageProps = {
  searchParams: Promise<SearchParams>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explorer les talents",
  description:
    "Recherchez des freelances congolais vérifiés par ville et par métier. Consultez leur CV en ligne et contactez-les directement.",
};

function getFirstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function getMetierIds(value: string | string[] | undefined): number[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return Array.from(
    new Set(
      values
        .map((item) => Number(item))
        .filter((id) => Number.isSafeInteger(id) && id > 0),
    ),
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const selectedCity = getFirstValue(params.ville);
  const selectedMetierIds = getMetierIds(params.metierIds);
  const hasFilters =
    Boolean(selectedCity) || selectedMetierIds.length > 0;

  const [options, freelances] = await Promise.all([
    getSearchOptions(),
    getSearchFreelances({
      ville: selectedCity || undefined,
      metierIds: selectedMetierIds,
    }),
  ]);

  return (
    <>
      <section className="mesh-bg relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-bg opacity-40"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Badge variant="info" className="mb-6 gap-2">
              <Icon name="sparkles" className="h-3.5 w-3.5" />
              Explorer
            </Badge>

            <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
              Trouvez le bon{" "}
              <span className="text-gradient">freelance</span> au Congo.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Filtrez par ville et métier pour découvrir les profils vérifiés.
              Un CV en ligne, un contact direct.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-6 max-w-7xl px-4 sm:-mt-8 sm:px-6 lg:px-8">
        <SearchFilters
          cities={options.cities}
          metiers={options.metiers}
          selectedCity={selectedCity}
          selectedMetierIds={selectedMetierIds}
        />
      </section>

      <section
        aria-labelledby="search-results-title"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-600">
              Résultats
            </p>
            <h2
              id="search-results-title"
              className="text-3xl font-extrabold tracking-tight text-slate-900"
            >
              Profils disponibles
            </h2>
            <p className="mt-2 text-sm text-slate-500" aria-live="polite">
              {freelances.length} profil
              {freelances.length > 1 ? "s" : ""} affiché
              {freelances.length > 1 ? "s" : ""}
              {hasFilters ? " pour votre recherche" : ""}
            </p>
          </div>

          <LinkButton href="/register" variant="ghost">
            Créer mon profil
            <Icon name="arrow-right" className="h-4 w-4" />
          </LinkButton>
        </div>

        {freelances.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {freelances.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </ul>
        ) : (
          <Card className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name="sparkles" className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {hasFilters
                ? "Aucun profil ne correspond à votre recherche"
                : "Aucun profil n'est encore publié"}
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              {hasFilters
                ? "Essayez une autre ville ou retirez un métier. Seuls les profils validés sont affichés."
                : "Soyez le premier à rejoindre BonCop et à présenter votre talent."}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {hasFilters ? (
                <LinkButton href="/search" variant="secondary">
                  Réinitialiser la recherche
                </LinkButton>
              ) : null}
              <LinkButton href="/register">Créer mon profil</LinkButton>
            </div>
          </Card>
        )}
      </section>
    </>
  );
}
