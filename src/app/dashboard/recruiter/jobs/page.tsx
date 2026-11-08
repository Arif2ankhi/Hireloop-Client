import type { LucideIcon } from "lucide-react";
import {
  BadgeCheckIcon,
  Code2Icon,
  MegaphoneIcon,
  PenToolIcon,
  PinIcon,
  PlusIcon,
  ServerCogIcon,
  EllipsisVerticalIcon,
  Trash2Icon,
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
import type { JobInput } from "@/lib/actions/jobs";

/**
 * Posts shown in the manage-jobs table. The base fields mirror exactly what
 * the New Job form collects (JobInput = FormData → plain record); the extra
 * fields (applicants, status, postedAt) are display-only for now.
 */
type JobPostRow = JobInput & {
  id: string;
  /** kept as string on purpose — FormData only yields strings */
  applicants: string;
  status: "Active" | "Expired";
  /** Human representation already stored per row for the mock. */
  postedAt: string;
};

const DEPT_ICONS: Record<string, LucideIcon> = {
  "Engineering & Tech": Code2Icon,
  Design: PenToolIcon,
  "Infrastructure & Tech": ServerCogIcon,
  Marketing: MegaphoneIcon,
  Quality: BadgeCheckIcon,
};

// Dummy data so the table is viewable while the real API has no GET route
// yet — field names match what the New Job form submits.
const DUMMY_JOB_POSTS: JobPostRow[] = [
  {
    id: "1",
    title: "Frontend Developer",
    companyName: "HirePulse Network",
    category: "Engineering & Tech",
    type: "Full-time",
    currency: "EUR",
    salaryMin: "25",
    salaryMax: "40",
    frequency: "per hour",
    location: "New York, USA",
    isRemote: "on",
    deadline: "2025-05-30",
    applicants: "34",
    status: "Active",
    postedAt: "Posted 4d ago",
  },
  {
    id: "2",
    title: "Senior Product Designer",
    companyName: "HirePulse Labs",
    category: "Design",
    type: "Full-time",
    currency: "GBP",
    salaryMin: "90",
    salaryMax: "115",
    frequency: "per hour",
    location: "London, UK",
    isRemote: "on",
    deadline: "2025-06-14",
    applicants: "19",
    status: "Active",
    postedAt: "Posted 1w ago",
  },
  {
    id: "3",
    title: "DevOps Specialist",
    companyName: "HirePulse Platform",
    category: "Infrastructure & Tech",
    type: "Full-time",
    currency: "EUR",
    salaryMin: "95",
    salaryMax: "120",
    frequency: "per hour",
    location: "Berlin, Germany",
    isRemote: "",
    deadline: "2025-06-30",
    applicants: "12",
    status: "Active",
    postedAt: "Posted 1w ago",
  },
  {
    id: "4",
    title: "Product Marketing Lead",
    companyName: "HirePulse Network",
    category: "Marketing",
    type: "Full-time",
    currency: "EUR",
    salaryMin: "80",
    salaryMax: "105",
    frequency: "per hour",
    location: "Remote (EU/US)",
    isRemote: "on",
    deadline: "2025-07-15",
    applicants: "27",
    status: "Active",
    postedAt: "Posted 5d ago",
  },
  {
    id: "5",
    title: "QA Automation Engineer",
    companyName: "HirePulse Platform",
    category: "Quality",
    type: "Part-time",
    currency: "EUR",
    salaryMin: "35",
    salaryMax: "55",
    frequency: "per hour",
    location: "Dublin, Ireland",
    isRemote: "on",
    deadline: "2025-05-01",
    applicants: "8",
    status: "Expired",
    postedAt: "Closed",
  },
];

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

export default function ManageJobsPage() {
  const jobPosts = DUMMY_JOB_POSTS;

  return (
    <div className="dark min-h-screen bg-[#0b0b0f] p-6 text-white">
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
              {jobPosts.map((post) => {
                const DeptIcon = DEPT_ICONS[post.category] ?? Code2Icon;
                const symbol = CURRENCY_SYMBOLS[post.currency] ?? post.currency;

                return (
                  <TableRow
                    key={post.id}
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
                            {post.title}
                          </p>
                          <p className="text-xs text-brand-soft/90">
                            {post.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Company & location */}
                    <TableCell>
                      <p className="text-sm text-white">{post.companyName}</p>
                      <p className="flex items-center gap-1 text-xs text-zinc-500">
                        <PinIcon className="size-3" />
                        {post.location}
                      </p>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <span className="inline-flex rounded-md bg-[#1a1a20] px-2.5 py-1 text-xs text-zinc-300">
                        {post.type}
                      </span>
                    </TableCell>

                    {/* Compensation */}
                    <TableCell className="text-sm text-zinc-300">
                      {symbol} {post.salaryMin} – {symbol} {post.salaryMax}
                      {formatFrequency(post.frequency)}
                    </TableCell>

                    {/* Applicants */}
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm text-brand-soft/90">
                        {Number(post.applicants) === 1 ? (
                          <UserRoundIcon className="size-4" />
                        ) : (
                          <UsersRoundIcon className="size-4" />
                        )}
                        {post.applicants} Candidates
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          post.status === "Active"
                            ? "rounded-full border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 [&>span]:bg-emerald-300"
                            : "rounded-full border-zinc-500/30 bg-zinc-500/10 px-3 py-1 text-xs font-medium text-zinc-400 [&>span]:bg-zinc-400"
                        }
                      >
                        {/* dot indicator */}
                        <span className="size-1.5 rounded-full" />
                        {post.status}
                      </Badge>
                    </TableCell>

                    {/* Deadline */}
                    <TableCell>
                      <p className="text-sm text-white">
                        {formatDeadline(post.deadline)}
                      </p>
                      <p className="text-xs text-zinc-500">{post.postedAt}</p>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg border-brand/40 bg-brand/15 px-3 text-xs text-white hover:bg-brand/25"
                        >
                          <PencilIcon className="size-3.5" />
                          Update
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={`Delete "${post.title}"`}
                          className="size-8 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-red-400"
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="More actions"
                          className="size-8 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white"
                        >
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
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
