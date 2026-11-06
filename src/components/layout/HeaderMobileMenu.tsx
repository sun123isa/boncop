"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/search", label: "Trouver un freelance" },
  { href: "/#comment", label: "Comment ça marche" },
  { href: "/about", label: "À propos" },
] as const;

export function HeaderMobileMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-ink-700 hover:bg-surface-100 hover:text-brand-600 md:hidden"
      >
        {open ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      <div
        id="menu-mobile"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line-200 bg-surface-0 shadow-raised md:hidden"
      >
        <nav
          aria-label="Navigation mobile"
          className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-sm px-3 py-3 text-base font-semibold text-ink-700 hover:bg-surface-100 hover:text-brand-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2 border-t border-line-200 pt-4">
            <Link
              href="/login"
              onClick={closeMenu}
              className="inline-flex h-11 items-center justify-center rounded-sm px-4 text-sm font-semibold text-ink-700 hover:bg-surface-100 hover:text-brand-600"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              onClick={closeMenu}
              className="inline-flex h-11 items-center justify-center rounded-sm bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Créer mon CV
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
