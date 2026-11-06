import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";
import { Icon, type AboutIconName } from "@/features/about/icons";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez la mission, la communauté, la vision et l'engagement de BonCop, la plateforme qui connecte les talents congolais aux opportunités.",
};

type Value = {
  title: string;
  description: string;
  icon: AboutIconName;
  tone: string;
};

const VALUES: readonly Value[] = [
  {
    title: "Notre mission",
    description:
      "Centraliser et valoriser les talents locaux à travers une plateforme simple et accessible.",
    icon: "target",
    tone: "bg-brand-50 text-brand-600",
  },
  {
    title: "Notre communauté",
    description:
      "Des développeurs, graphistes, rédacteurs, photographes et bien d'autres professionnels.",
    icon: "users",
    tone: "bg-brand-50 text-brand-700",
  },
  {
    title: "Notre vision",
    description:
      "Faire du numérique un levier d'opportunités pour la jeunesse congolaise.",
    icon: "rocket",
    tone: "bg-accent/10 text-accent",
  },
  {
    title: "Notre engagement",
    description:
      "Des profils vérifiés, une modération active et un contact direct.",
    icon: "shield",
    tone: "bg-emerald-50 text-emerald-600",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mesh-bg relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-bg opacity-40"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="info" className="mb-6 gap-2">
              <Icon name="sparkles" className="h-3.5 w-3.5" />
              Notre histoire
            </Badge>

            <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              BonCop connecte les talents congolais aux{" "}
              <span className="text-gradient">opportunités</span>.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Notre mission est de créer un pont entre les freelances locaux et
              les recruteurs, en valorisant les compétences du Congo.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/register" size="lg">
                Rejoindre BonCop
                <Icon name="arrow-right" className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/search" variant="secondary" size="lg">
                Explorer les talents
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="values-title"
        className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8"
      >
        <h2 id="values-title" className="sr-only">
          Nos valeurs
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <Card key={value.title} className="h-full">
              <div
                aria-hidden="true"
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${value.tone}`}
              >
                <Icon name={value.icon} className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-bold text-slate-900">{value.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {value.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
