"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { MainNav } from "@/features/navigation";
import { cn } from "@/lib/cn";

type SessionUserWithRole = {
  role?: string;
};

/**
 * Client Component volontairement : lire la session côté serveur (auth())
 * dans le layout rendrait TOUTES les pages dynamiques et casserait
 * l'ISR de / et le SSG de /about. La session est donc lue côté client.
 */
export function Header() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  
  const role = (session?.user as SessionUserWithRole | undefined)?.role;
  const isAdmin = status === "authenticated" && role === "ADMIN";

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  async function handleSignOut() {
    closeMobileMenu();
    await signOut({ callbackUrl: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="BonCop, accueil"
          className="group flex min-h-11 items-center gap-2.5"
          onClick={closeMobileMenu}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-sm font-extrabold text-white transition group-hover:scale-105">
            B
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            BonCop
          </span>
        </Link>

        {/* Utilisation du composant centralisé MainNav */}
        <MainNav variant="desktop" />

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            {status === "authenticated" ? (
              <>
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/profile/edit"}
                  className="inline-flex min-h-11 items-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-800"
                >
                  {isAdmin ? "Espace admin" : "Mon profil"}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-slate-700 transition hover:text-brand-600"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-800"
                >
                  Rejoindre
                  <span aria-hidden="true" className="text-[10px]">
                    →
                  </span>
                </Link>
              </>
            )}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            data-open={mobileOpen ? "true" : "false"}
            onClick={() => setMobileOpen((open) => !open)}
            className="menu-toggle flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg transition hover:bg-slate-100 md:hidden"
          >
            <span aria-hidden="true" className="hamburger-line" />
            <span aria-hidden="true" className="hamburger-line" />
            <span aria-hidden="true" className="hamburger-line" />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={cn(
          "mobile-menu border-t border-slate-200/60 bg-white md:hidden",
          mobileOpen && "open",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {/* Utilisation de MainNav pour la version mobile */}
          <MainNav
            variant="mobile"
            aria-label="Navigation mobile"
            onNavigate={closeMobileMenu}
          />

          <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-3">
            {status === "authenticated" ? (
              <>
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/profile/edit"}
                  onClick={closeMobileMenu}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800"
                >
                  {isAdmin ? "Espace admin" : "Mon profil"}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800"
                >
                  Rejoindre
                  <span aria-hidden="true" className="text-[10px]">
                    →
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}