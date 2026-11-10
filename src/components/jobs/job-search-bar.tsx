"use client";

import { SearchIcon } from "lucide-react";

/**
 * The full-width search panel on /browse-jobs: rounded input + white
 * "Search Jobs" button inside a dark card, per the Figma mock.
 *
 * Submitting does nothing yet — wire the handler below to read the input
 * and update the ?search=… param (or navigate) when ready.
 */
export function JobSearchBar({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  return (
    <section className="rounded-2xl bg-[#131317] p-3 ring-1 ring-white/5">
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          // TODO: read the input value and set the ?search=… param here.
        }}
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            name="search"
            defaultValue={defaultValue}
            placeholder="Search by job title, keywords..."
            className="h-12 w-full rounded-xl border border-white/10 bg-[#1a1a20] pr-4 pl-11 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <button
          type="submit"
          className="h-12 rounded-xl bg-white px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
        >
          Search Jobs
        </button>
      </form>
    </section>
  );
}
