"use client"

import * as React from "react"
import Link from "next/link"
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

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/browse-jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
] as const

export { Logo }

function NavLinks({ className }: { className?: string }) {
  return (
    <>
      {NAV_LINKS.map((link) => (
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
          <div className="flex items-center gap-6">
            <NavLinks />
            <span className="h-5 w-px bg-white/15" aria-hidden="true" />
            <Link
              href="/sign-in"
              className="text-sm font-medium text-brand-soft transition-[color] hover:text-brand-soft/80"
            >
              Sign In
            </Link>
          </div>
          <Button className="h-11 rounded-lg bg-brand px-6 text-sm font-medium text-white hover:bg-brand/90">
            Get Started
          </Button>
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
              {NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  render={<Link href={link.href} />}
                  className="rounded-lg px-2 py-2.5 font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </SheetClose>
              ))}
              <SheetClose
                render={<Link href="/sign-in" />}
                className="rounded-lg px-2 py-2.5 font-medium text-brand-soft transition-colors hover:bg-white/10"
              >
                Sign In
              </SheetClose>
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t border-white/10 p-4">
              <SheetClose
                render={
                  <Button className="h-10 w-full rounded-xl bg-brand text-sm font-medium text-white hover:bg-brand/90" />
                }
              >
                Get Started
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
        </nav>
      </div>
    </header>
  )
}
