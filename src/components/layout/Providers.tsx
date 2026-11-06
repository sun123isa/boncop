"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Dans src/app/layout.tsx :
//
// <html lang="fr" className={`${inter.variable} ${jetbrains.variable}`}>
//   <body>
//     <Providers>
//       <Header />
//       <main>{children}</main>
//       <Footer />
//     </Providers>
//   </body>
// </html>
