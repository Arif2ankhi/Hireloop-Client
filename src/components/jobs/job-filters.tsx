"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { formatCompact } from "@/lib/jobs/display";
import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/types/job-form-data";

type CountedOption = { value: string; label: string; count?: number };

/**
 * Small hook shared by every filter control: rewrites one ?name=… param and
 * navigates, letting the server re-render fresh results. Any filter change
 * also drops ?page, so a narrowed result set can never leave you stranded
 * on an out-of-range page.
 */
function useRefine() {
  const router = useRouter();

  return (name: string, value: string) => {
    // Read the URL fresh — other controls may have changed since mount.
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.delete("page");
    const query = params.toString();
    router.push(`/browse-jobs${query ? `?${query}` : ""}`, { scroll: false });
  };
}

/**
 * One titled filter group — single-select radios. Picking an option sets
 * that group's ?name=… param, picking the All/Any option ("") clears it,
 * and the server page renders accordingly. Checked state mirrors the URL.
 */
function FilterGroup({
  title,
  name,
  value,
  options,
}: {
  title: string;
  /** The query param this group maps to, e.g. "type". */
  name: string;
  /** Currently active value, mirrored from the URL ("" = All/Any). */
  value: string;
  options: ReadonlyArray<CountedOption>;
}) {
  const refine = useRefine();

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <div
        role="radiogroup"
        aria-label={title}
        className="flex flex-col gap-2.5"
      >
        {options.map((option) => (
          <label
            key={`${name}-${option.value}`}
            className="flex cursor-pointer items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2.5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={option.value === value}
                onChange={() => refine(name, option.value)}
                className="size-4 accent-brand"
              />
              <span className="text-sm text-zinc-300">{option.label}</span>
            </span>
            {option.count !== undefined ? (
              <span className="text-xs text-zinc-500">
                {formatCompact(option.count)}
              </span>
            ) : null}
          </label>
        ))}
      </div>
    </section>
  );
}

/** Salary buckets → ?salary=min-max (applied per page-side filter). */
const SALARY_RANGES: ReadonlyArray<CountedOption> = [
  { value: "", label: "Any salary" },
  { value: "0-50000", label: "Up to 50k" },
  { value: "50000-100000", label: "50k – 100k" },
  { value: "100000-200000", label: "100k – 200k" },
  { value: "200000-", label: "200k +" },
];

/** Currently selected filter values, mirrored from the URL server-side. */
export type JobFiltersState = {
  type: string;
  category: string;
  isRemote: string;
  salary: string;
  location: string;
};

/**
 * Left sidebar of /browse-jobs. Counts are computed server-side from the
 * fetched jobs and passed in; every control itself navigates with the
 * updated URL params on change, so results stay server-rendered.
 */
export function JobFiltersPanel({
  typeCounts,
  categoryCounts,
  remoteCount,
  onsiteCount,
  totalJobs,
  initial,
}: {
  typeCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  remoteCount: number;
  onsiteCount: number;
  totalJobs: number;
  initial?: Partial<JobFiltersState>;
}) {
  // Location is free text, not a radio: local typing state, committed on
  // blur/Enter. `key` re-seeds it whenever the URL value changes.
  const [locationValue, setLocationValue] = React.useState(
    initial?.location ?? ""
  );
  const refine = useRefine();
  const commitLocation = () => refine("location", locationValue.trim());

  return (
    <aside className="flex flex-col gap-5 rounded-xl bg-[#131317] p-5 ring-1 ring-white/5">
      <h2 className="text-base font-semibold text-white">Filters</h2>

      {/* Single-select: exactly one job type at a time */}
      <FilterGroup
        title="Job Type"
        name="type"
        value={initial?.type ?? ""}
        options={[
          { value: "", label: "All types", count: totalJobs },
          ...JOB_TYPES.map((type) => ({
            value: type,
            label: type,
            count: typeCounts[type],
          })),
        ]}
      />

      {/* Single-select: exactly one category at a time */}
      <FilterGroup
        title="Category"
        name="category"
        value={initial?.category ?? ""}
        options={[
          { value: "", label: "All categories", count: totalJobs },
          ...JOB_CATEGORIES.map((category) => ({
            value: category,
            label: category,
            count: categoryCounts[category],
          })),
        ]}
      />

      {/* Single-select: Any / Remote only / On-site only */}
      <FilterGroup
        title="Remote Work"
        name="isRemote"
        value={initial?.isRemote ?? ""}
        options={[
          { value: "", label: "Any", count: totalJobs },
          { value: "on", label: "Remote only", count: remoteCount },
          { value: "off", label: "On-site only", count: onsiteCount },
        ]}
      />

      {/* Single-select: salary buckets */}
      <FilterGroup
        title="Salary Range"
        name="salary"
        value={initial?.salary ?? ""}
        options={SALARY_RANGES}
      />

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-white">Location</h3>
        <Input
          key={initial?.location ?? ""}
          type="search"
          name="location"
          value={locationValue}
          placeholder="e.g. Dhaka"
          onChange={(event) => setLocationValue(event.target.value)}
          onBlur={commitLocation}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitLocation();
          }}
          className="h-9 border-white/10 bg-[#1a1a20] text-white placeholder:text-zinc-500"
        />
      </section>
    </aside>
  );
}

/**
 * "Sort by" dropdown next to the results heading; changing it navigates
 * with ?sort=… and the server re-sorts ("" never occurs: "recent" is kept
 * in the URL for a stable reset value).
 */
export function JobSortSelect({ value }: { value: string }) {
  const refine = useRefine();

  return (
    <label className="flex items-center gap-2 text-xs text-zinc-500">
      Sort by:
      <select
        value={value}
        onChange={(event) => refine("sort", event.target.value)}
        className="h-9 rounded-lg border border-white/10 bg-[#1a1a20] px-3 text-xs text-zinc-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="recent">Most Recent</option>
        <option value="salary">Highest Salary</option>
        <option value="relevance">Relevance</option>
      </select>
    </label>
  );
}
