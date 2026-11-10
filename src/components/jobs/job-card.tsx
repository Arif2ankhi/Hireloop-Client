"use client";

import * as React from "react";
import { BanknoteIcon, BookmarkIcon, BriefcaseIcon } from "lucide-react";

import type { JobFormData } from "@/lib/types/job-form-data";
import { formatCompact, formatFrequency, getDeptIcon } from "@/lib/jobs/display";

/** Small dark pill used for the salary / job-type chips. */
function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#1a1a20] px-2.5 py-1 text-xs text-zinc-300">
      {icon}
      {children}
    </span>
  );
}

/**
 * One job listing card for the /browse-jobs grid: title, company • location
 * "(Remote)" line, salary & job-type chips and a save-bookmark button.
 *
 * The bookmark click is an intentional no-op stub for now — wire it to your
 * save-job logic (or update the URL) when ready.
 */
export function JobCard({ job }: { job: JobFormData }) {
  const isRemote = job.isRemote === "on";

  return (
    <article className="relative flex flex-col gap-4 rounded-xl bg-[#131317] p-5 ring-1 ring-white/5 transition-colors select-none hover:ring-brand/40">
      <button
        type="button"
        aria-label={`Save "${job.title}"`}
        title="Save job"
        onClick={() => {
          // TODO: save/bookmark this job for the signed-in user.
        }}
        className="absolute top-4 right-4 text-zinc-500 transition-colors hover:text-white"
      >
        <BookmarkIcon className="size-4.5" />
      </button>

      <div className="flex items-center gap-4 pr-8">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#1a1a20] text-brand">
          {React.createElement(getDeptIcon(job.category), {
            className: "size-6",
          })}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">
            {job.title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-zinc-400">
            {job.companyName} • {job.location}
            {isRemote ? " (Remote)" : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip icon={<BanknoteIcon className="size-3.5" />}>
          {formatCompact(job.salaryMin)} – {formatCompact(job.salaryMax)}
          {formatFrequency(job.frequency)}
        </Chip>
        <Chip icon={<BriefcaseIcon className="size-3.5" />}>{job.type}</Chip>
      </div>
    </article>
  );
}
