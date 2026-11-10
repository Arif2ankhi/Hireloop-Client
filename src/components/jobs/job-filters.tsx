"use client";

import { Input } from "@/components/ui/input";
import { formatCompact } from "@/lib/jobs/display";
import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/types/job-form-data";

type CountedOption = { value: string; label: string; count?: number };

/**
 * One titled filter group, rendered as native radio controls with
 * per-option counts. Every group is single-select ("only one at a time")
 * and starts with an "All/Any" option, so a choice can always be undone by
 * picking it again.
 */
function FilterGroup({
  title,
  name,
  options,
  defaultValue = "",
}: {
  title: string;
  /** The query param this group maps to, e.g. "type". */
  name: string;
  options: ReadonlyArray<CountedOption>;
  /** Currently active value ("" = the All/Any option). */
  defaultValue?: string;
}) {
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
                defaultChecked={option.value === defaultValue}
                onChange={() => {
                  // TODO: set the ?name=… search param (and reset ?page=1),
                  // then let the server re-render. Stub on purpose —
                  // changing a filter must not update the query yet.
                }}
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

/** Salary buckets → `salary` param (backend decides how to interpret it). */
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
 * fetched jobs and passed in, so the controls stay purely presentational —
 * picking a value does not change the query yet.
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
  return (
    <aside className="flex flex-col gap-5 rounded-xl bg-[#131317] p-5 ring-1 ring-white/5">
      <h2 className="text-base font-semibold text-white">Filters</h2>

      {/* Single-select: exactly one job type at a time */}
      <FilterGroup
        title="Job Type"
        name="type"
        defaultValue={initial?.type}
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
        defaultValue={initial?.category}
        options={[
          { value: "", label: "All categories", count: totalJobs },
          ...JOB_CATEGORIES.map((category) => ({
            value: category,
            label: category,
            count: categoryCounts[category],
          })),
        ]}
      />

      {/* Single-select: All / Remote only / On-site only */}
      <FilterGroup
        title="Remote Work"
        name="isRemote"
        defaultValue={initial?.isRemote}
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
        defaultValue={initial?.salary}
        options={SALARY_RANGES}
      />

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-white">Location</h3>
        <Input
          type="search"
          name="location"
          defaultValue={initial?.location ?? ""}
          placeholder="e.g. Dhaka"
          onChange={() => {
            // TODO: debounce and update the ?location=… search param
            // (reset ?page=1).
          }}
          className="h-9 border-white/10 bg-[#1a1a20] text-white placeholder:text-zinc-500"
        />
      </section>
    </aside>
  );
}

/**
 * "Sort by" dropdown next to the results heading. Changing it does nothing
 * yet — wire the handler to the ?sort=… param when the backend supports it.
 */
export function JobSortSelect() {
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-500">
      Sort by:
      <select
        defaultValue="recent"
        onChange={() => {
          // TODO: update the ?sort=… search param and re-fetch.
        }}
        className="h-9 rounded-lg border border-white/10 bg-[#1a1a20] px-3 text-xs text-zinc-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="recent">Most Recent</option>
        <option value="salary">Highest Salary</option>
        <option value="relevance">Relevance</option>
      </select>
    </label>
  );
}
