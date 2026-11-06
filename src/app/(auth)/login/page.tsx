import { Suspense } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { LoginForm } from "@/features/auth/components/LoginForm"

export const metadata = { title: "Connexion | BonCop" }

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 sm:p-10 shadow-lift">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Bon retour !</h1>
          <p className="mt-2 text-sm text-slate-600">
            Connectez-vous pour accéder à votre espace.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-slate-500">Chargement...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-8 text-center text-sm text-slate-600">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            S'inscrire
          </Link>
        </div>
      </Card>
    </main>
  )
}