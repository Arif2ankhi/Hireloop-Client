import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth as serverAuth } from "@/lib/auth"

/* falls back to same-origin http://localhost:3000/api/auth — correct for dev. */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof serverAuth>()],
})

// The single configured client — the old code created a second client here
// (createAuthClient() with no baseURL) which caused confusing mismatches.
export const { signIn, signUp,signOut, useSession } = authClient

// Dev-only: lets you inspect the session/token from the browser console, e.g.
//   (await authClient.getSession()).data.session.token
// Not exposed in production builds.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  ;(window as unknown as Record<string, unknown>).authClient = authClient
}
