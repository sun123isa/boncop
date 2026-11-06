import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import  prisma  from "@/db/prisma"
import type { Role } from "@/generated/prisma/client";


export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase()
        const password = String(credentials?.password ?? "")
        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const passwordOk = await bcrypt.compare(password, user.password)
        if (!passwordOk) return null

        // Un compte banni ne peut jamais se connecter.
        if (user.validated === "BANNI") return null

        // Un compte en attente peut se connecter mais sera limité par le middleware.
        return {
          id: String(user.id),
          email: user.email,
          role: user.role,
          prenom: user.prenom,
          nom: user.nom,
          validated: user.validated,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
        token.validated = (user as any).validated
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role as Role
        ;(session.user as any).validated = token.validated
      }
      return session
    },
  },
})