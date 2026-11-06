import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { decideAuthRedirect } from "@/lib/auth-guards"

export default auth((req) => {
  const target = decideAuthRedirect({
    path: req.nextUrl.pathname,
    isLogged: !!req.auth,
    role: (req.auth?.user as any)?.role,
    validated: (req.auth?.user as any)?.validated,
  })

  if (target) {
    return NextResponse.redirect(new URL(target, req.url))
  }
  return NextResponse.next()
})

// FORCE NEXT.JS A UTILISER LE RUNTIME NODE.JS COMPLET PLUTÔT QUE L'EDGE
export const runtime = "nodejs";

export const config = {
  matcher: ["/admin/:path*", "/profile/edit"],
}