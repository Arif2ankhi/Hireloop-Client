import { Hero } from "@/components/home/hero"
import { SiteNavbar } from "@/components/site-navbar"

export default function Home() {
  return (
    <main className="dark min-h-full">
      <div className="flex-1 bg-background pb-24">
        {/* The navbar is page-mounted (not in the root layout) so the area
            behind it is dark, matching the Figma mock. */}
        <SiteNavbar />
        <Hero />
      </div>
    </main>
  )
}
