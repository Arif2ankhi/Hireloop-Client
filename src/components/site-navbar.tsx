"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { Logo } from "@/components/layout/logo"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useSession, signOut } from "@/lib/auth-client"

// Public links are static — they don't depend on the session. The Dashboard
// link is added per-user inside SiteNavbar, where `useSession()` has loaded
// (referencing `session` here at module scope throws "session is not defined").
type NavLink = { label: string; href: string }

const PUBLIC_LINKS: NavLink[] = [
  { label: "Browse Jobs", href: "/browse-jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
]

export { Logo }

function NavLinks({ links, className }: { links: NavLink[]; className?: string }) {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium text-zinc-200 transition-colors hover:text-white",
            className
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  )
}

// Figma proportions: the bar spans ~94% of the viewport, so it uses small
// near-full-bleed side margins instead of the shared content Container.
export function SiteNavbar() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  // Session-aware link list: signed-in users get a Dashboard link that
  // points at their role's dashboard (seeker | recruiter | admin).
  const links: NavLink[] = user
    ? [
        ...PUBLIC_LINKS,
        {
          label: "Dashboard",
          href: `/dashboard/${user.role || "seeker"}`,
        },
      ]
    : PUBLIC_LINKS

  const handleSignOut = async () => {
    await signOut()
    // Re-fetch server components / refresh the page so the navbar resets.
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 xl:px-10">
      <div>
        <nav
          aria-label="Main"
          className="flex h-14 w-full items-center justify-between rounded-2xl bg-[#1b1b1f] pr-2 pl-4 sm:h-16 sm:pl-6"
        >
        <Link href="/" aria-label="HireLoop home">
          <Logo />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-5 md:flex">
          {user ? (
              <>
                <div className="flex items-center gap-5">
                  <NavLinks links={links} />
                  <span className="h-5 w-px bg-white/15" aria-hidden="true" />
                  <span className="text-[#EDEEEF]">Welcome, {user.name}</span>
                </div>
                <Button
                  onClick={handleSignOut}
                  nativeButton={false}
                  className="h-11 rounded-lg bg-brand px-6 text-sm font-medium text-white hover:bg-brand/90"
                >
                  Sign Out
                </Button>
              </>
          ) : (
              <>
              <div className="flex items-center gap-6">
                <NavLinks links={links} />
                <span className="h-5 w-px bg-white/15" aria-hidden="true" />
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-brand-soft transition-[color] hover:text-brand-soft/80"
                >
                  Sign In
                </Link>
              </div>
              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                className="h-11 rounded-lg bg-brand px-6 text-sm font-medium text-white hover:bg-brand/90"
              >
                Get Started
              </Button>
              </>
          )}
        </div>

        {/* Mobile */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white md:hidden"
              />
            }
          >
            <MenuIcon />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 max-w-[85vw] border-white/10 bg-[#141418] text-white"
          >
            <SheetHeader>
              <SheetTitle className="sr-only">HireLoop menu</SheetTitle>
              <Logo />
            </SheetHeader>
            <nav
              aria-label="Mobile"
              className="flex flex-col gap-1 px-4 pb-4 text-base"
            >
              {links.map((link) => (
                <SheetClose
                  key={link.href}
                  render={<Link href={link.href} />}
                  className="rounded-lg px-2 py-2.5 font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </SheetClose>
              ))}
              {user ? (
                <SheetClose
                  onClick={handleSignOut}
                  className="rounded-lg px-2 py-2.5 text-left font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Sign Out
                </SheetClose>
              ) : (
                <SheetClose
                  render={<Link href="/sign-in" />}
                  className="rounded-lg px-2 py-2.5 font-medium text-brand-soft transition-colors hover:bg-white/10"
                >
                  Sign In
                </SheetClose>
              )}
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t border-white/10 p-4">
              {!user && (
                <SheetClose
                  render={
                    <Button className="h-10 w-full rounded-xl bg-brand text-sm font-medium text-white hover:bg-brand/90" />
                  }
                >
                  Get Started
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
        </nav>
      </div>
    </header>
  )
}
