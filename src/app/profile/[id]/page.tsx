import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";
import {
  formatCongoPhone,
  getPhoneHref,
  getWhatsAppHref,
} from "@/features/freelance/contact";
import {
  findFreelanceProfile,
  getFreelanceProfile,
} from "@/features/freelance/queries";
import { Icon } from "@/features/home/icons";
import {
  getProfileInitials,
  getProfileLocation,
  getProfileName,
  getProfileTone,
} from "@/features/home/ProfileCard";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const profileId = Number(id);

  if (!Number.isSafeInteger(profileId) || profileId < 1) {
    return { title: "Profil introuvable" };
  }

  // Lecture seule : ne pas incrémenter les vues depuis les métadonnées
  const profile = await findFreelanceProfile(profileId);

  if (!profile) {
    return { title: "Profil introuvable" };
  }

  const name = getProfileName(profile);

  return {
    title: name,
    description: `Consultez le profil de ${name} sur BonCop et contactez ce freelance congolais directement.`,
  };
}

export default async function FreelanceProfilePage({
  params,
}: ProfilePageProps) {
  const { id } = await params;
  const profileId = Number(id);

  if (!Number.isSafeInteger(profileId) || profileId < 1) {
    notFound();
  }

  const profile = await getFreelanceProfile(profileId);

  if (!profile) {
    notFound();
  }

  const fullName = getProfileName(profile);
  const location = getProfileLocation(profile);
  const metiers =
    profile.metiers.length > 0 ? profile.metiers : ["Freelance"];
  const phoneRaw = profile.telephone?.trim();
  const whatsappRaw = profile.whatsapp?.trim();
  const phone = phoneRaw ? formatCongoPhone(phoneRaw) : "";
  const whatsapp = whatsappRaw ? formatCongoPhone(whatsappRaw) : "";
  const whatsappHref = whatsappRaw ? getWhatsAppHref(whatsappRaw) : null;
  const memberSince = profile.createdAt.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <section className="mesh-bg relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-bg opacity-40"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <nav className="mb-8 text-sm text-slate-500" aria-label="Fil d'Ariane">
            <Link
              href="/search"
              className="font-semibold text-brand-600 transition hover:underline"
            >
              Explorer
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-slate-700">{fullName}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span
              aria-hidden="true"
              className={cn(
                "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-2xl font-bold text-white shadow-soft",
                getProfileTone(profile),
              )}
            >
              {getProfileInitials(profile)}
            </span>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="success">Profil vérifié</Badge>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Icon name="eye" className="h-3.5 w-3.5" />
                  {profile.profileViews.toLocaleString("fr-FR")} consultation
                  {profile.profileViews > 1 ? "s" : ""}
                </span>
              </div>

              <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {fullName}
              </h1>

              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                <Icon name="map-pin" className="h-4 w-4 shrink-0" />
                <span>{location}</span>
              </p>

              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Métiers">
                {metiers.map((metier) => (
                  <li
                    key={metier}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                  >
                    {metier}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Card>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-600">
              Présentation
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Parcours et compétences
            </h2>
            {profile.cvDescription?.trim() ? (
              <div className="mt-5 whitespace-pre-wrap break-words text-base leading-relaxed text-slate-700">
                {profile.cvDescription}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-slate-500">
                Ce freelance n&apos;a pas encore ajouté de présentation à son
                profil.
              </p>
            )}
            <p className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-500">
              Membre depuis {memberSince}
            </p>
          </Card>

          <aside className="space-y-4">
            <Card>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon name="shield" className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Contacter</h2>
              <p className="mt-1 text-sm text-slate-500">
                Contact direct, sans intermédiaire.
              </p>

              <div className="mt-5 space-y-4">
                {phoneRaw ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Téléphone
                    </p>
                    <a
                      href={getPhoneHref(phoneRaw)}
                      className="mt-1 block break-all text-sm font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                      {phone}
                    </a>
                  </div>
                ) : null}

                {whatsapp ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      WhatsApp
                    </p>
                    {whatsappHref ? (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block break-all text-sm font-semibold text-brand-600 underline-offset-4 hover:underline"
                      >
                        {whatsapp}
                      </a>
                    ) : (
                      <p className="mt-1 break-all text-sm text-slate-700">
                        {whatsapp}
                      </p>
                    )}
                  </div>
                ) : null}

                {!phoneRaw && !whatsappRaw ? (
                  <p className="text-sm leading-relaxed text-slate-500">
                    Aucune information de contact n&apos;est disponible pour le
                    moment.
                  </p>
                ) : null}
              </div>

              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-800"
                >
                  Écrire sur WhatsApp
                </a>
              ) : phoneRaw ? (
                <a
                  href={getPhoneHref(phoneRaw)}
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-800"
                >
                  Appeler
                </a>
              ) : null}
            </Card>

            <LinkButton href="/search" variant="secondary" className="w-full">
              Voir d&apos;autres profils
            </LinkButton>
          </aside>
        </div>
      </section>
    </>
  );
}
