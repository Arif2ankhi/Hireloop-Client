"use client";

import * as React from "react";
import { createElement } from "react";
import {
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DownloadIcon,
  FileCheck2Icon,
  SearchIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

import { DarkPage } from "@/components/layout/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApplicationStatus, JobApplication } from "@/types/applications";
import { formatTimeAgo } from "@/lib/jobs/display";
import { getApplications } from "@/lib/actions/applications";
import { useSession } from "@/lib/auth-client";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

const APPLICATION_PAGE_SIZE = 5;

/* ------------------------------------------------------------------ */
/* Status pill colors (same treatment as the manage-table badges).      */
/* ------------------------------------------------------------------ */

const STATUS_BADGE: Record<ApplicationStatus, string> = {
  Applied:
    "border-zinc-500/30 bg-zinc-500/10 text-zinc-400 [&>span]:bg-zinc-400",
  Review:
    "border-orange-400/30 bg-orange-400/10 text-orange-300 [&>span]:bg-orange-300",
  Shortlisted:
    "border-blue-400/30 bg-blue-400/10 text-blue-300 [&>span]:bg-blue-300",
  Rejected: "border-red-400/30 bg-red-400/10 text-red-300 [&>span]:bg-red-300",
  Offered:
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 [&>span]:bg-emerald-300",
};

export default  function MyApplicationsPage() {

    // const session = await auth.api.getSession({
    //     headers: await headers()
    // })



  const [tab, setTab] = React.useState<"Active" | "Archived">("Active");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [applications, setApplications] = React.useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Signed-in seeker whose applications we load.
  const { data: session } = useSession();
  const applicantId = session?.user?.id;

  React.useEffect(() => {
    if (!applicantId) return;

    let cancelled = false;
    getApplications(applicantId).then((list) => {
      if (!cancelled) {
        setApplications(list);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [applicantId]);

  const visible = applications.filter(
    (app) =>
      app.archived === (tab === "Archived") &&
      `${app.title} ${app.companyName}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(visible.length / APPLICATION_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * APPLICATION_PAGE_SIZE;
  const pageItems = visible.slice(pageStart, pageStart + APPLICATION_PAGE_SIZE);

  // Switching tabs or searching always resets to the first page.
  const handleTabChange = (next: "Active" | "Archived") => {
    setTab(next);
    setPage(1);
  };
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // Stat tiles — computed from the ACTIVE applications only.
  const active = applications.filter((app) => !app.archived);
  const shortlisted = active.filter((app) => app.status === "Shortlisted").length;
  const interviews = active.filter((app) => app.status === "Review").length;
  const offers = active.filter((app) => app.status === "Offered").length;
  const successRate =
    active.length > 0
      ? Math.round(((shortlisted + interviews + offers) / active.length) * 100)
      : 0;

  const stats = [
    { label: "Total Applied", value: String(active.length), icon: UsersIcon },
    { label: "Shortlisted", value: String(shortlisted), icon: FileCheck2Icon },
    { label: "Interviews", value: String(interviews), icon: ClockIcon },
    { label: "Success Rate", value: `${successRate}%`, icon: TrendingUpIcon },
  ];

  return (
    <DarkPage>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* Header: title + tabs/Export */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              My Applications
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Track the status of all jobs you have applied to
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Segmented Active/Archived tabs */}
            <div className="flex rounded-lg bg-[#131317] p-1 ring-1 ring-white/5">
              {(["Active", "Archived"] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleTabChange(label)}
                  className={
                    tab === label
                      ? "rounded-md bg-[#1a1a20] px-4 py-1.5 text-sm font-medium text-white"
                      : "rounded-md px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                // TODO: generate the PDF export of the visible applications.
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              <DownloadIcon className="size-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl bg-[#131317] p-4 ring-1 ring-white/5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#1a1a20] text-brand">
                {createElement(stat.icon, { className: "size-5" })}
              </span>
              <div>
                <p className="text-xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Applications table */}
        <section className="overflow-hidden rounded-xl bg-[#131317] ring-1 ring-white/5">
          <div className="flex flex-col gap-3 border-b border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-white">
              {tab} Applications
              <span className="ml-2 text-zinc-500">({visible.length})</span>
            </p>
            <label className="relative block sm:w-64">
              <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="search"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search applications…"
                className="h-9 w-full rounded-lg bg-[#1a1a20] pr-3 pl-9 text-sm text-white placeholder:text-zinc-500 focus:ring-1 focus:ring-brand/50 focus:outline-none"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-xs text-zinc-500">Job Title</TableHead>
                  <TableHead className="text-xs text-zinc-500">Company</TableHead>
                  <TableHead className="text-xs text-zinc-500">Applied</TableHead>
                  <TableHead className="text-xs text-zinc-500">Status</TableHead>
                  <TableHead className="text-right text-xs text-zinc-500">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-zinc-500">
                      Loading applications…
                    </TableCell>
                  </TableRow>
                ) : pageItems.length === 0 ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-zinc-500">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((app) => (
                  <TableRow
                    key={app._id}
                    className="border-white/5 hover:bg-white/[0.02]"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1a1a20] text-brand">
                          {/* Application snapshot has no category — generic icon */}
                          <BriefcaseIcon className="size-4.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {app.title}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {app.type} • {app.isRemote === "on" ? "Remote" : "On-site"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-300">
                      {app.companyName}
                    </TableCell>
                    <TableCell className="text-sm text-zinc-400">
                      {formatTimeAgo(app.appliedAt)}
                    </TableCell>
                    <TableCell>
                      {/* dot indicator + colored pill per status */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${STATUS_BADGE[app.status]}`}
                      >
                        <span className="size-1.5 rounded-full" />
                        {app.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          // TODO: open the application details view.
                        }}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/10 hover:text-brand-soft"
                      >
                        Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer: showing range + pagination */}
          <div className="flex flex-col items-center gap-3 border-t border-white/5 p-4 sm:flex-row sm:justify-between">
            <p className="text-xs text-zinc-500">
              {visible.length === 0
                ? "No applications found"
                : `Showing ${pageStart + 1}–${pageStart + pageItems.length} of ${visible.length} applications`}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={
                      pageNumber === currentPage
                        ? "size-8 rounded-md bg-brand text-sm font-medium text-white"
                        : "size-8 rounded-md text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                    }
                  >
                    {pageNumber}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </DarkPage>
  );
}
