"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Logo } from "@/components/layout/logo"
import { authClient } from "@/lib/auth-client"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

type AuthMode = "sign-in" | "sign-up"

const AUTH_TABS = [
  { mode: "sign-in" as AuthMode, label: "Sign In", href: "/sign-in" },
  { mode: "sign-up" as AuthMode, label: "Sign Up", href: "/sign-up" },
]

/**
 * Official Google "G" mark (four-color). lucide has no brand icons, so it's
 * an inline SVG. Colors are part of the brand — don't change them.
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4", className)}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

function FormField({
  label,
  type,
  name,
  placeholder,
  autoComplete,
  required,
  className,
}: {
  label: string
  name: string
  type: string
  placeholder: string
  autoComplete?: string
  required?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={name} className="text-sm text-zinc-300">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="h-10 rounded-lg border-white/10 bg-[#141418] text-white placeholder:text-zinc-500"
      />
    </div>
  )
}

const ROLES = [
  { value: "seeker", label: "Job Seeker" },
  { value: "recruiter", label: "Recruiter" },
  { value: "admin", label: "Admin" },
]

export function AuthCard({
  mode,
  onSubmit,
}: {
  mode: AuthMode
  /** Optional override: when provided, the card only collects the form
   * fields ({ name?, email, password, remember? }) and calls this handler;
   * the internal better-auth flow is skipped (errors are then the page's
   * responsibility). Without it, the built-in auth flow is used. */
  onSubmit?: (data: Record<string, string>) => Promise<void> | void
}) {
  const isSignIn = mode === "sign-in"
  const router = useRouter()

  const [authError, setAuthError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  /**
   * Calls the better-auth client (which posts to /api/auth against MongoDB on
   * the server) and logs the full response in the console — on success it
   * contains the user and the session token. The token is also set as an
   * httpOnly cookie (better-auth.session_token): see Devtools Application >
   * Cookies, it will never appear in a console log you don't print yourself.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError(null)
    setIsSubmitting(true)
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<
      string,
      string
    >
    try {
      if (onSubmit) {
        await onSubmit(data)
        return
      }
      const response = isSignIn
        ? await authClient.signIn.email({
            email: String(data.email),
            password: String(data.password),
          })
        : await authClient.signUp.email({
            name: String(data.name),
            email: String(data.email),
            password: String(data.password),
            role: data.role ?? "seeker",
          } as Parameters<typeof authClient.signUp.email>[0])
      console.log(`[${mode}] auth response`, response) // ← token is here
      if (response.error) {
        setAuthError(response.error.message ?? "Something went wrong")
        return
      }
      // Dev ergonomics: wait a beat before navigating so the response log stays
      // readable in the console (DevTools clears logs on navigation unless
      // "Preserve log" is enabled in the Console settings gear).
      setTimeout(() => router.push("/"), 1500)
    } catch (error) {
      console.error(`[${mode}] auth failed`, error)
      setAuthError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Placeholder Google handler. TODO (integration): better-auth's
   * authClient.signIn.social({ provider: "google" }) — the /api/auth
   * route already has the google provider configured.
   */
  function handleGoogle() {
    console.log(`[${mode}] continue with Google`)
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center pb-6">
        <Link href="/" aria-label="HireLoop home">
          <Logo />
        </Link>
      </div>

      <div className="relative">
        {/* glow behind the card for a bit of brand polish */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-brand/10 blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl border border-white/10 bg-[#1b1b1f] p-6 shadow-2xl shadow-black/50 sm:p-8"
        >
        {/* Toggle between the Sign In and Sign Up pages */}
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#141418] p-1">
          {AUTH_TABS.map((tab) => (
            <Link
              key={tab.mode}
              href={tab.href}
              aria-current={tab.mode === mode ? "page" : undefined}
              className={cn(
                "rounded-lg py-2 text-center text-sm font-medium transition-colors",
                tab.mode === mode
                  ? "bg-[#1b1b1f] text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <h1 className="font-heading mt-6 text-2xl font-semibold text-white">
          {isSignIn ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          {isSignIn
            ? "Sign in to continue your job search."
            : "Start finding jobs or hiring talent on HireLoop."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {authError && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {authError}
            </p>
          )}
          {!isSignIn && (
            <>
              {/* Role selector (native radios → included in FormData) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-zinc-300">
                  Joining HireLoop as
                </span>
                <div role="radiogroup" className="flex flex-wrap gap-2">
                  {ROLES.map((role, index) => (
                    <label key={role.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        defaultChecked={index === 0}
                        className="peer sr-only"
                      />
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-[#141418] px-3.5 py-2 text-sm text-zinc-300 transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 peer-checked:border-brand peer-checked:bg-brand/15 peer-checked:text-white hover:text-white">
                        {role.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <FormField
                label="Full name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            </>
          )}

          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete={isSignIn ? "current-password" : "new-password"}
            required
          />

          {isSignIn && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" name="remember" />
                <label htmlFor="remember" className="text-sm text-zinc-300">
                  Remember me
                </label>
              </div>
              <Link
                href="/sign-in"
                className="text-sm text-brand-soft transition-colors hover:text-brand-soft/80"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-10 w-full rounded-lg bg-brand text-sm font-medium text-white hover:bg-brand/90"
          >
            {isSignIn
              ? isSubmitting
                ? "Signing in…"
                : "Sign In"
              : isSubmitting
                ? "Creating account…"
                : "Create Account"}
          </Button>

          {/* social */}
          <div className="mt-1 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-zinc-500 text-xs">or continue with</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <Button
            type="button"
            onClick={handleGoogle}
            className="h-10 w-full rounded-lg border border-white/10 bg-white text-sm font-medium text-[#1b1b1f] hover:bg-zinc-100"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>

        <p className="text-muted-foreground mt-5 text-center text-sm">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-medium text-brand-soft transition-colors hover:text-brand-soft/80"
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
        </motion.div>
      </div>
    </div>
  )
}
