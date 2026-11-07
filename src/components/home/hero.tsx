"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { MapPinIcon, SearchIcon } from "lucide-react"

import globeSrc from "../../../public/images/globe.png"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

const TRENDING_POSITIONS = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Globe horizon fills the bottom half of the hero. The PNG's upper
          middle is transparent (glow + stars composite over the page), so the
          image is cropped around the horizon line and masked to fade into the
          dark page background. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 flex h-[22rem] justify-center sm:h-[30rem]">
          <div className="relative h-full w-full max-w-[90rem]">
            <Image
              src={globeSrc}
              alt=""
              priority
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-[50%_50%] [mask-image:linear-gradient(to_bottom,transparent,black_32%)]"
            />
          </div>
        </div>
        {/* soft brand glow behind the headline */}
        <div className="absolute top-[-14rem] left-1/2 h-96 w-[50rem] max-w-[100vw] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Container>
          <div className="flex flex-col items-center pt-16 pb-[13rem] text-center sm:pt-24 sm:pb-[17rem]">
        {/* badge with hairline decorations on both sides */}
        <motion.div
          initial="hidden"
          animate="show"
          className="flex w-full max-w-2xl items-center justify-center gap-4"
        >
          <span
            aria-hidden="true"
            className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-white/15 sm:block"
          />
          <motion.p
            custom={0}
            variants={fadeInUp}
            className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] py-2 pr-4 pl-3 font-mono text-xs tracking-wide sm:text-[0.8rem]"
          >
            <span aria-hidden="true" className="text-sm">
              💼
            </span>
            <span className="font-semibold text-white">50,000+</span>
            <span className="tracking-[0.16em] text-zinc-400 uppercase">
              New jobs this month
            </span>
          </motion.p>
          <span
            aria-hidden="true"
            className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-white/15 sm:block"
          />
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeInUp}
          className="mt-7 max-w-3xl font-heading text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl md:text-6xl"
        >
          Find Your Dream Job Today
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeInUp}
          className="text-muted-foreground mt-5 max-w-2xl text-base text-balance sm:text-lg"
        >
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </motion.p>

        {/* Native GET form → /jobs?q=…&location=… */
        }
        <motion.form
          custom={3}
          variants={fadeInUp}
          action="/jobs"
          className="mt-9 flex w-full max-w-xl items-center gap-1 rounded-2xl border border-white/10 bg-[#1b1b1f]/95 p-1.5 pr-1.5 pl-4 text-left shadow-2xl shadow-black/50"
        >
          <SearchIcon className="size-4 shrink-0 text-zinc-400" />
          <label htmlFor="hero-q" className="sr-only">
            Job title, skill or company
          </label>
          <input
            id="hero-q"
            name="q"
            placeholder="Job title, skill or company"
            className="h-9 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />
          <span
            aria-hidden="true"
            className="mx-2 hidden h-6 w-px bg-white/10 sm:block"
          />
          <MapPinIcon
            aria-hidden="true"
            className="hidden size-4 shrink-0 text-zinc-400 sm:block"
          />
          <label htmlFor="hero-location" className="sr-only">
            Location or Remote
          </label>
          <input
            id="hero-location"
            name="location"
            placeholder="Location or Remote"
            className="hidden h-9 min-w-0 flex-[0.8] bg-transparent text-sm text-white outline-none placeholder:text-zinc-500 sm:block"
          />
          <Button
            type="submit"
            size="icon"
            className="size-10 shrink-0 rounded-lg bg-brand hover:bg-brand/90"
          >
            <SearchIcon />
            <span className="sr-only">Search jobs</span>
          </Button>
        </motion.form>

        <motion.div
          custom={4}
          variants={fadeInUp}
          className="mt-5 flex flex-wrap items-center justify-center gap-2.5"
        >
          <span className="text-sm text-zinc-400">Trending Position</span>
          {TRENDING_POSITIONS.map((title) => (
            <Link
              key={title}
              href={`/jobs?q=${encodeURIComponent(title)}`}
              className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {title}
            </Link>
          ))}
        </motion.div>
          </div>
        </Container>
      </div>

      {/* sentence sitting on the planet surface */}
      <div className="absolute inset-x-0 bottom-8 z-10 px-6 text-center sm:bottom-12">
        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          custom={4}
          className="mx-auto max-w-lg font-heading text-xl font-semibold text-balance text-white/90 sm:mx-auto sm:max-w-xl sm:text-2xl md:text-3xl"
        >
          Assisting over 15,000 job seekers find their dream positions.
        </motion.p>
      </div>
    </section>
  )
}
