import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";
import { cn } from "@/lib/cn";
import { getPlatformStats } from "@/features/stats/queries";
import { Icon } from "@/features/home/icons";
import { getTopFreelances } from "@/features/home/queries";
import {
  getProfileHref,
  getProfileInitials,
  getProfileLocation,
  getProfileName,
  getProfileTone,
  ProfileCard,
} from "@/features/home/ProfileCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Les talents du Congo à portée de clic",
  description:
    "Découvrez les freelances congolais vérifiés, consultez leur CV en ligne et contactez-les directement par téléphone ou WhatsApp.",
};

function formatNumber(value: number): string {
  return value.toLocaleString("fr-FR");
}

export default async function HomePage() {
  const [stats, topProfiles] = await Promise.all([
    getPlatformStats(),
    getTopFreelances(5),
  ]);

  const heroProfile = topProfiles[0] ?? null;
  const heroMetiers =
    heroProfile && heroProfile.metiers.length > 0
      ? heroProfile.metiers.slice(0, 3)
      : ["Freelance"];
  const heroCities = Array.from(
    new Set(
      topProfiles
        .map((profile) => profile.ville?.trim())
        .filter((city): city is string => Boolean(city)),
    ),
  ).slice(0, 3);

  return (
    <>
      <section className="mesh-bg relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-bg opacity-40"
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div className="text-center lg:text-left">
              <Badge variant="success" className="mb-6 gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-soft"
                />
                {stats.totalFreelances > 0
                  ? `${formatNumber(stats.totalFreelances)} talents vérifiés`
                  : "Talents congolais vérifiés"}{" "}
                · Congo
                <Icon name="arrow-right" className="h-3 w-3" />
              </Badge>

              <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Les meilleurs freelances du{" "}
                <span className="text-gradient">Congo</span>, à portée de clic.
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
                BonCop connecte recruteurs et particuliers aux talents locaux.
                Un CV en ligne, un contact direct, zéro intermédiaire.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <LinkButton href="/search" size="lg">
                  Explorer les talents
                  <Icon name="arrow-right" className="h-4 w-4" />
                </LinkButton>
                <LinkButton
                  href="/register"
                  variant="secondary"
                  size="lg"
                >
                  Créer mon profil
                </LinkButton>
              </div>

              {topProfiles.length > 0 ? (
                <div className="mt-10 flex items-center justify-center gap-4 lg:justify-start">
                  <div className="flex -space-x-2" aria-hidden="true">
                    {topProfiles.slice(0, 3).map((profile) => (
                      <span
                        key={profile.id}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-linear-to-br text-xs font-bold text-white shadow-soft",
                          getProfileTone(profile),
                        )}
                      >
                        {getProfileInitials(profile)}
                      </span>
                    ))}
                    {stats.totalFreelances > 3 ? (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-600">
                        +{formatNumber(stats.totalFreelances - 3)}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">
                      Rejoints par des talents
                    </p>
                    <p className="text-xs text-slate-500">
                      {heroCities.length > 0
                        ? heroCities.join(" · ")
                        : "Brazzaville · Pointe-Noire · Dolisie"}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="h-72 w-72 rounded-full bg-linear-to-br from-brand-400/35 to-accent/25 blur-3xl" />
              </div>

              {heroProfile ? (
                <div className="relative w-full max-w-sm animate-float">
                  <div className="border-gradient rounded-2xl p-6 shadow-lift">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <Badge variant="success">Profil vérifié</Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Icon name="eye" className="h-3.5 w-3.5" />
                        {formatNumber(heroProfile.profileViews)} vues
                      </span>
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-lg font-bold text-white shadow-soft",
                          getProfileTone(heroProfile),
                        )}
                      >
                        {getProfileInitials(heroProfile)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">
                          {getProfileName(heroProfile)}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {getProfileLocation(heroProfile)}
                        </p>
                      </div>
                    </div>

                    <ul className="mb-5 flex flex-wrap gap-1.5">
                      {heroMetiers.map((metier) => (
                        <li
                          key={metier}
                          className="rounded-md bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700"
                        >
                          {metier}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={getProfileHref(heroProfile)}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Voir le profil
                      <Icon name="arrow-right" className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="absolute -right-3 -top-3 hidden items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-lift sm:flex">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint/10 text-mint">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-900">
                        Profil vérifié
                      </p>
                      <p className="text-[9px] text-slate-500">100% fiable</p>
                    </div>
                  </div>

                  <div className="absolute -bottom-3 -left-3 hidden items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-lift sm:flex">
                    <div className="flex -space-x-1.5" aria-hidden="true">
                      <span className="h-5 w-5 rounded-full border border-white bg-brand-500" />
                      <span className="h-5 w-5 rounded-full border border-white bg-accent" />
                      <span className="h-5 w-5 rounded-full border border-white bg-brand-800" />
                    </div>
                    <p className="text-[10px] font-semibold text-slate-900">
                      +{formatNumber(stats.totalFreelances)} talents
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-gradient relative w-full max-w-sm rounded-2xl p-6 shadow-lift">
                  <div
                    aria-hidden="true"
                    className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-700 text-lg font-extrabold text-white shadow-soft"
                  >
                    B
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-widest text-brand-600">
                    BonCop
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-900">
                    Votre talent mérite d&apos;être vu.
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Créez votre CV en ligne en quelques minutes et soyez
                    découvert par des recruteurs.
                  </p>
                  <LinkButton href="/register" className="mt-5 w-full">
                    Créer mon profil
                  </LinkButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="stats-title"
        className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <h2 id="stats-title" className="sr-only">
          BonCop en chiffres
        </h2>
        <Card className="grid grid-cols-2 divide-x divide-slate-200 text-center sm:p-8">
          <div className="px-4">
            <p className="text-3xl font-extrabold tracking-tight text-gradient sm:text-4xl">
              {formatNumber(stats.totalFreelances)}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Freelances validés
            </p>
          </div>
          <div className="px-4">
            <p className="text-3xl font-extrabold tracking-tight text-gradient sm:text-4xl">
              {formatNumber(stats.totalViews)}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Vues de profils
            </p>
          </div>
        </Card>
      </section>

      <section
        id="freelances"
        aria-labelledby="top-title"
        className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-600">
              Sélection
            </p>
            <h2
              id="top-title"
              className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
            >
              Les profils les plus consultés
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Découvrez les freelances que les recruteurs consultent le plus en
              ce moment.
            </p>
          </div>

          <LinkButton href="/search" variant="ghost">
            Voir tous
            <Icon name="arrow-right" className="h-4 w-4" />
          </LinkButton>
        </div>

        {topProfiles.length === 0 ? (
          <Card className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name="sparkles" className="h-5 w-5" />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-900">
              Aucun profil n&apos;est encore publié.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Soyez le premier à rejoindre BonCop et à présenter votre talent.
            </p>
            <LinkButton href="/register" className="mt-5">
              Créer mon profil
            </LinkButton>
          </Card>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
