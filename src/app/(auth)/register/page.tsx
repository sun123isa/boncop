import { RegisterForm } from "@/features/auth/components/RegisterForm"
import { getActiveVilles } from "@/features/villes/queries"

export const metadata = { title: "Inscription | BonCop" }

export default async function RegisterPage() {
  const villes = await getActiveVilles()

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-2xl font-bold">Créer un compte freelance</h1>
      <RegisterForm villes={villes} />
    </main>
  )
}
