import { createElement } from "react";
import { UsersRoundIcon } from "lucide-react";

import { StatusDropdown } from "@/components/jobs/status-dropdown";
import { STATUS_TEXT } from "@/components/jobs/status-badge";
import { DarkPage, PageHeader } from "@/components/layout/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getJobApplications } from "@/lib/actions/applications";
import { getJobById } from "@/lib/api/jobs";
import {
  formatLocationWithCountry,
  formatTimeAgo,
  getCategoryColor,
  getDeptIcon,
} from "@/lib/jobs/display";
import type { JobApplication } from "@/types/applications";

/**
 * Recruiter view of one job's applicants (dashboard › jobs › row link).
 * Server component: fetches the job (for header context) and its
 * applications in parallel. Status updates are display-only for now —
 * the DB wiring is a follow-up (see the TODO in the action column).
 */

/** One overview tile above the table. */
function StatTile({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: number;
  valueClass: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-[#131317] p-4 ring-1 ring-white/5">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`text-2xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

/** First letter of the applicant name, for the initials avatar. */
const initialOf = (name: string) =>
  name.trim().charAt(0).toUpperCase() || "?";

export default async function JobApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Independent fetches — run them together.
  const [job, applications] = await Promise.all([
    getJobById(id),
    getJobApplications(id),
  ]);

  const statusCount = (status: JobApplication["status"]) =>
    applications.filter((app) => app.status === status).length;

  const stats = [
    { label: "Total Applicants", value: applications.length, valueClass: "text-white" },
    { label: "In Review", value: statusCount("Review"), valueClass: "text-amber-400" },
    { label: "Shortlisted", value: statusCount("Shortlisted"), valueClass: "text-blue-400" },
    { label: "Offered", value: statusCount("Offered"), valueClass: "text-emerald-400" },
  ];

  return (
    <DarkPage>
      <div className="flex flex-col gap-6">
        {/* Breadcrumb + heading */}
        <PageHeader
          items={[
            { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
            { label: job?.title?.trim() || "Job" },
            { label: "Applications" },
          ]}
          title="Job Applications"
          description={
            job
              ? `Applicants for “${job.title.trim()}” at ${job.companyName} — ${formatLocationWithCountry(job.location)}.`
              : "Review applicants and track their hiring progress."
          }
        />

        {/* Overview tiles */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatTile
              key={stat.label}
              label={stat.label}
              value={stat.value}
              valueClass={stat.valueClass}
            />
          ))}
        </div>

        {/* Applicants table — horizontally scrollable on small screens */}
        <div className="overflow-x-auto rounded-xl bg-[#131317]">
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow className="border-b border-white/5 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-zinc-500">
                  APPLICANT
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  APPLIED FOR
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  APPLIED
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  STATUS
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  UPDATE STATUS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center">
                    <UsersRoundIcon className="mx-auto size-8 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">
                      No applications yet for this job
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow
                    key={app._id}
                    className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
                  >
                    {/* Applicant: initials avatar + name • email */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-medium text-brand">
                          {initialOf(app.applicantName)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {app.applicantName}
                          </p>
                          <p className="truncate text-xs text-zinc-500">
                            {app.applicantEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Job snapshot: category chip + type • work mode */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${getCategoryColor(app.category)}`}
                        >
                          {createElement(getDeptIcon(app.category ?? ""), {
                            className: "size-4.5",
                          })}
                        </span>
                        <p className="text-sm text-zinc-300">
                          {app.type} •{" "}
                          {app.isRemote === "on" ? "Remote" : "On-site"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-zinc-400">
                      {formatTimeAgo(app.appliedAt)}
                    </TableCell>

                    {/* Current status as colored plain text (per the mock) */}
                    <TableCell
                      className={`text-sm font-medium ${STATUS_TEXT[app.status]}`}
                    >
                      {app.status}
                    </TableCell>

                    <TableCell>
                      <StatusDropdown
                        applicationId={app._id ?? ""}
                        status={app.status}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DarkPage>
  );
}
