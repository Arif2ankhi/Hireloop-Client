import { createAuthClient } from "better-auth/react"
import { auth } from "./auth"
import {inferAdditionalFields} from "better-auth/client/plugins"

/* falls back to same-origin http://localhost:3000/api/auth — correct for dev. */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins:[inferAdditionalFields<typeof auth>()]
})


export const { signIn, signUp,signOut, useSession } = authClient



if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  ;(window as unknown as Record<string, unknown>).authClient = authClient
}
