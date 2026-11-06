import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ProfileEditForm } from "@/features/profile/components/ProfileEditForm";
import { getMyEditableProfile } from "@/features/profile/queries";
import { getActiveMetiers } from "@/features/metiers/queries";
import { getActiveVilles } from "@/features/villes/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon profil",
  description: "Complétez et mettez à jour votre profil freelance BonCop.",
};

export default async function ProfileEditPage() {
  const profile = await getMyEditableProfile();

  if (!profile) {
    redirect("/login?callbackUrl=%2Fprofile%2Fedit");
  }

  const [villes, metiers] = await Promise.all([
    getActiveVilles(),
    getActiveMetiers(),
  ]);

  return (
    <>
      <section className="mesh-bg relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-bg opacity-40"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Badge variant="info" className="mb-5">
            Espace freelance
          </Badge>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Mon{" "}
            <span className="text-gradient">profil</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Renseignez vos coordonnées, vos métiers et votre présentation pour
            être découvert par les recruteurs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <ProfileEditForm
          profile={profile}
          villes={villes}
          metiers={metiers}
        />
      </section>
    </>
  );
}
