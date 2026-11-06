import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { Icon } from "./icons";
import type { TopFreelance } from "./queries";

const TONE_CLASSES = [
  "from-brand-500 to-brand-800",
  "from-accent to-[#9A4418]",
  "from-[#3D6B5A] to-[#1B5136]",
  "from-[#C48A26] to-[#8A5A12]",
  "from-[#4A6356] to-[#24352C]",
] as const;

export function getProfileName(profile: TopFreelance): string {
  return (
    [profile.prenom, profile.nom].filter(Boolean).join(" ") ||
    "Freelance BonCop"
  );
}

export function getProfileInitials(profile: TopFreelance): string {
  const first = profile.prenom?.trim().charAt(0) ?? "";
  const last = profile.nom?.trim().charAt(0) ?? "";

  return `${first}${last}`.toUpperCase() || "BC";
}

export function getProfileLocation(profile: TopFreelance): string {
  return (
    [profile.ville, profile.quartier].filter(Boolean).join(", ") || "Congo"
  );
}

export function getProfileTone(profile: TopFreelance): string {
  return TONE_CLASSES[Math.abs(profile.id) % TONE_CLASSES.length];
}

export function getProfileHref(profile: TopFreelance): string {
  return `/profile/${profile.id}`;
}

export function ProfileCard({ profile }: { profile: TopFreelance }) {
  const fullName = getProfileName(profile);
  const metiers =
    profile.metiers.length > 0 ? profile.metiers.slice(0, 3) : ["Freelance"];

  return (
    <li className="h-full">
      <Link
        href={getProfileHref(profile)}
        aria-label={`Voir le profil de ${fullName}`}
        className="group block h-full"
      >
        <Card interactive className="flex h-full flex-col">
          <div className="mb-4 flex items-start justify-between gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-lg font-bold text-white shadow-soft",
                getProfileTone(profile),
              )}
            >
              {getProfileInitials(profile)}
            </span>
            <Badge variant="success" className="shrink-0">
              Vérifié
            </Badge>
          </div>

          <h3 className="truncate text-lg font-bold text-slate-900">
            {fullName}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Icon name="map-pin" className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{getProfileLocation(profile)}</span>
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {metiers.map((metier) => (
              <li
                key={metier}
                className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700"
              >
                {metier}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="eye" className="h-3.5 w-3.5" />
              {profile.profileViews.toLocaleString("fr-FR")} vues
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-brand-600 transition-all group-hover:gap-2">
              Profil
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </span>
          </div>
        </Card>
      </Link>
    </li>
  );
}
