"use client";

import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * The full-width search panel on /browse-jobs: rounded input + white
 * "Search Jobs" button inside a dark card, per the Figma mock.
 *
 * Submitting navigates to /browse-jobs?search=… while keeping any other
 * filter params that are already in the URL, and resets ?page=1.
 */
export function JobSearchBar({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const currentParams = useSearchParams();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // FormData keys mirror the input's `name` attribute (name="search").
    const search = String(
      new FormData(event.currentTarget).get("search") ?? ""
    ).trim();

    // Copy the current filters, then override only the search term.
    const params = new URLSearchParams(currentParams.toString());
    params.delete("page"); // a fresh search always starts at page 1
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    const query = params.toString();
    router.push(`/browse-jobs${query ? `?${query}` : ""}`);
  };

  return (
    <section className="rounded-2xl bg-[#131317] p-3 ring-1 ring-white/5">
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
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
