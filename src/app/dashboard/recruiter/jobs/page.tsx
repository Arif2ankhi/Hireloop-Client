import type { LucideIcon } from "lucide-react";
import {
  BadgeCheckIcon,
  Code2Icon,
  MegaphoneIcon,
  PenToolIcon,
  PinIcon,
  PlusIcon,
  ServerCogIcon,
  UserRoundIcon,
  UsersRoundIcon,
  PencilIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteJobDialog } from "@/components/jobs/delete-job-dialog";
import { ViewJobDialog } from "@/components/jobs/view-job-dialog";
import type { JobPostRow } from "@/components/jobs/types";
import { getJobs } from "@/lib/api/jobs";

const DEPT_ICONS: Record<string, LucideIcon> = {
  "Engineering & Tech": Code2Icon,
  Design: PenToolIcon,
  "Infrastructure & Tech": ServerCogIcon,
  Marketing: MegaphoneIcon,
  Quality: BadgeCheckIcon,
};


const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  BDT: "৳",
};

function formatDeadline(iso: string) {
  // Fixed locale keeps server/client markup identical (no hydration drift).
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "per hour" → "/ hr" */
function formatFrequency(frequency: string) {
  return ` / ${frequency.replace(/^per /, "")}`;
}

export default async function RecruiterJobsPage() {
  // GET /jobs (your Express backend at localhost:5000) — returns the array of
  // stored job posts. Swap the dummy rows for this once the API is live.
  const jobs = ((await getJobs()) ?? []) as JobPostRow[];
//   console.log("Jobs data", jobs);

  return (
    <div className="dark min-h-screen bg-[#0b0b0f] p-4 text-white sm:p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-500">
              <Link
                href="/dashboard/recruiter/jobs"
                className="hover:text-zinc-300"
              >
                Manage Jobs
              </Link>
              <span className="mx-1.5">›</span>
              <span className="text-zinc-300">Job Listings &amp; Postings</span>
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Manage Job Posts
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>
          <Button
            render={<Link href="/dashboard/recruiter/jobs/new" />}
            nativeButton={false}
            className="h-10 rounded-full bg-brand px-5 text-sm font-medium text-white hover:bg-brand/90"
          >
            <PlusIcon className="size-4" />
            New Job Post
          </Button>
        </div>

        {/* Posts table — horizontally scrollable on small screens */}
        <div className="overflow-x-auto rounded-xl bg-[#131317]">
          <Table className="min-w-[960px]">
            <TableHeader>
              <TableRow className="border-b border-white/5 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-zinc-500">
                  JOB TITLE &amp; DEPT
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  COMPANY &amp; LOCATION
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  TYPE
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  COMPENSATION
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  APPLICANTS
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  STATUS
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  DEADLINE
                </TableHead>
                <TableHead className="text-right text-xs font-medium text-zinc-500">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => {
                const DeptIcon = DEPT_ICONS[job.category] ?? Code2Icon;
                const symbol = CURRENCY_SYMBOLS[job.currency] ?? job.currency;
                const status = job.status ?? "Active";
                const applicants = job.applicants ?? "0";

                return (
                  <TableRow
                    key={job._id}
                    className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
                  >
                    {/* Title & dept */}
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1a1a20] text-brand">
                          <DeptIcon className="size-4.5" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {job.title}
                          </p>
                          <p className="text-xs text-brand-soft/90">
                            {job.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Company & location */}
                    <TableCell>
                      <p className="text-sm text-white">{job.companyName}</p>
                      <p className="flex items-center gap-1 text-xs text-zinc-500">
                        <PinIcon className="size-3" />
                        {job.location}
                      </p>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <span className="inline-flex rounded-md bg-[#1a1a20] px-2.5 py-1 text-xs text-zinc-300">
                        {job.type}
                      </span>
                    </TableCell>

                    {/* Compensation */}
                    <TableCell className="text-sm text-zinc-300">
                      {symbol} {job.salaryMin} – {symbol} {job.salaryMax}
                      {formatFrequency(job.frequency)}
                    </TableCell>

                    {/* Applicants */}
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm text-brand-soft/90">
                        {Number(applicants) === 1 ? (
                          <UserRoundIcon className="size-4" />
                        ) : (
                          <UsersRoundIcon className="size-4" />
                        )}
                        {applicants} Candidates
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          status === "Active"
                            ? "rounded-full border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 [&>span]:bg-emerald-300"
                            : "rounded-full border-zinc-500/30 bg-zinc-500/10 px-3 py-1 text-xs font-medium text-zinc-400 [&>span]:bg-zinc-400"
                        }
                      >
                        {/* dot indicator */}
                        <span className="size-1.5 rounded-full" />
                        {status}
                      </Badge>
                    </TableCell>

                    {/* Deadline */}
                    <TableCell>
                      <p className="text-sm text-white">
                        {job.deadline ? formatDeadline(job.deadline) : "—"}
                      </p>
                      {job.postedAt ? (
                        <p className="text-xs text-zinc-500">{job.postedAt}</p>
                      ) : null}
                    </TableCell>

                    {/* Actions: View → Update → Delete */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <ViewJobDialog job={job} />
                        <Button
                          variant="outline"
                          size="sm"
                          render={
                            <Link
                              href={`/dashboard/recruiter/jobs/new?edit=${encodeURIComponent(
                                job._id ?? job.id ?? ""
                              )}`}
                            />
                          }
                          nativeButton={false}
                          className="h-8 rounded-lg border-brand/40 bg-brand/15 px-3 text-xs text-white hover:bg-brand/25"
                        >
                          <PencilIcon className="size-3.5" />
                          Update
                        </Button>
                        {job._id || job.id ? (
                          <DeleteJobDialog
                            jobId={(job._id ?? job.id) as string}
                            jobTitle={job.title}
                          />
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
