"use client";

import * as React from "react";
import { EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { JobPostRow } from "@/components/jobs/types";

/**
 * Eye-icon trigger + read-only dialog showing all stored details of one job
 * post. Data comes straight from the job object the table row already has,
 * so no extra fetch is needed.
 */
export function ViewJobDialog({ job }: { job: JobPostRow }) {
  const detailRows: Array<[string, string]> = [
    ["Company", job.companyName],
    ["Category", job.category],
    ["Job type", job.type],
    [
      "Compensation",
      `${job.currency ?? ""} ${job.salaryMin ?? "—"} – ${job.currency ?? ""} ${job.salaryMax ?? "—"} (${job.frequency ?? "—"})`,
    ],
    ["Location", job.location],
    ["Fully remote", job.isRemote ? "Yes" : "No"],
    ["Application deadline", job.deadline || "—"],
  ];

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            title={`View "${job.title}"`}
            className="size-8 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white"
          />
        }
      >
        <EyeIcon className="size-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{job.title}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Read-only view of this job post.
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-1 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-[130px_1fr]">
          {detailRows.map(([label, value]) => (
            <div
              key={label}
              className="contents sm:col-span-2 sm:grid sm:grid-cols-[130px_1fr] sm:items-baseline sm:gap-x-4"
            >
              <dt className="text-xs font-medium text-zinc-500">{label}</dt>
              <dd className="text-zinc-200">{value}</dd>
            </div>
          ))}
        </dl>

        {job.responsibilities ? (
          <div className="rounded-lg bg-[#1a1a20] p-3">
            <p className="text-xs font-medium text-zinc-500">
              Key Responsibilities
            </p>
            <p className="mt-1 text-xs whitespace-pre-line text-zinc-300">
              {job.responsibilities}
            </p>
          </div>
        ) : null}
        {job.requirements ? (
          <div className="rounded-lg bg-[#1a1a20] p-3">
            <p className="text-xs font-medium text-zinc-500">
              Qualifications &amp; Requirements
            </p>
            <p className="mt-1 text-xs whitespace-pre-line text-zinc-300">
              {job.requirements}
            </p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
