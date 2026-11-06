"use client"

import { useState, useTransition } from "react"
import { getSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { resolvePostLoginRedirect } from "@/lib/auth-guards"

type SessionUserWithRole = {
  role?: string
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      })

      if (!result || result.error) {
        setError("Email ou mot de passe incorrect.")
        return
      }

      const session = await getSession()
      const role = (session?.user as SessionUserWithRole | undefined)?.role
      const destination = resolvePostLoginRedirect({ role, callbackUrl })

      router.push(destination)
      router.refresh()
    })
  }

  return (
    <form method="post" onSubmit={onSubmit} className="flex flex-col gap-5">
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
        autoComplete="current-password"
        placeholder="••••••••"
      />

      {error && (
        <p className="text-sm text-danger-fg font-medium bg-danger-bg p-3 rounded-lg">
          {error}
        </p>
      )}

      <Button type="submit" loading={isPending} className="mt-2 w-full">
        Se connecter
      </Button>
    </form>
  )
}
