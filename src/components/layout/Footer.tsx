import Link from "next/link";


import {
  FOOTER_ACCOUNT_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_NAV_LINKS,
  NavLink,
  type NavLinkItem,
} from "@/features/navigation";


function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly NavLinkItem[];
}) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
        {title}
      </h2>
      <ul className="space-y-1 text-sm">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <NavLink link={link} variant="footer" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label="BonCop, accueil"
              className="mb-4 inline-flex min-h-11 items-center gap-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-sm font-extrabold text-white">
                B
              </span>
              <span className="text-lg font-extrabold text-white">BonCop</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed">
              La plateforme qui connecte les freelances talentueux du Congo
              avec les recruteurs et particuliers.
            </p>
          </div>

          <FooterColumn title="Navigation" links={FOOTER_NAV_LINKS} />
          <FooterColumn title="Mon compte" links={FOOTER_ACCOUNT_LINKS} />
          <FooterColumn title="Légal" links={FOOTER_LEGAL_LINKS} />
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} BonCop. Tous droits réservés.</p>
          <p>
            Fait avec <span className="text-accent">❤</span> au Congo
          </p>
        </div>
      </div>
    </footer>
  );
}
