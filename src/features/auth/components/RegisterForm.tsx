"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/features/auth/actions"
import { CongoPhoneInput } from "@/features/freelance/components/CongoPhoneInput"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import type { VilleOption } from "@/features/villes/queries"

type RegisterFormProps = {
  villes: VilleOption[]
}

export function RegisterForm({ villes }: RegisterFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await registerUser({
        email: formData.get("email"),
        password: formData.get("password"),
        prenom: formData.get("prenom") || undefined,
        nom: formData.get("nom") || undefined,
        telephone: formData.get("telephone") || undefined,
        whatsapp: formData.get("whatsapp") || undefined,
        ville: formData.get("ville") || undefined,
        quartier: formData.get("quartier") || undefined,
      })

      if (!result.success) {
        setError(result.error)
        return
      }
      router.push("/login?registered=1")
    })
  }

  return (
    <form method="post" onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="vous@exemple.com"
      />

      <Input
        label="Mot de passe"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        hint="Au moins 8 caractères."
      />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Prénom" name="prenom" />
        <Input label="Nom" name="nom" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CongoPhoneInput label="Téléphone" name="telephone" />
        <CongoPhoneInput label="WhatsApp" name="whatsapp" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Ville"
          name="ville"
          required
          defaultValue=""
          disabled={villes.length === 0}
          hint={
            villes.length === 0
              ? "Aucune ville disponible. Relancez le seed."
              : undefined
          }
        >
          <option value="" disabled>
            Choisir une ville
          </option>
          {villes.map((ville) => (
            <option key={ville.id} value={ville.libelle}>
              {ville.libelle}
            </option>
          ))}
        </Select>
        <Input label="Quartier" name="quartier" />
      </div>

      {error && (
        <p className="text-sm text-danger-fg font-medium bg-danger-bg p-3 rounded-lg">
          {error}
        </p>
      )}

      <Button type="submit" loading={isPending} className="mt-2 w-full">
        Créer mon compte
      </Button>
    </form>
  )
}
