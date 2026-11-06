import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_NAME = "BonCop";
const SITE_DESCRIPTION =
  "BonCop met en relation recruteurs, entreprises et particuliers avec des freelances congolais qualifiés. Consultez des CV en ligne et contactez-les par appel ou WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "BonCop : trouvez un freelance qualifié au Congo",
    template: "%s | BonCop",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: "BonCop : trouvez un freelance qualifié au Congo",
    description: SITE_DESCRIPTION,
    url: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B5136",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${jetbrains.variable} h-full`}
    >
      <body className="flex min-h-dvh flex-col bg-surface-0 font-sans text-ink-900 antialiased">
        <Providers>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-surface-0 focus:px-4 focus:py-2 focus:font-semibold focus:text-ink-900"
          >
            Aller au contenu
          </a>
          <Header />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
