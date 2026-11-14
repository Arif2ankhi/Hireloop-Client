import type { ApplicationStatus } from "@/types/applications";

/* Status pill colors (same treatment as the manage-table badges). */
const STATUS_BADGE: Record<ApplicationStatus, string> = {
  Applied:
    "border-zinc-500/30 bg-zinc-500/10 text-zinc-400 [&>span]:bg-zinc-400",
  Review:
    "border-yellow-400/30 bg-yellow-400/10 text-yellow-300 [&>span]:bg-yellow-300",
  Interview:
    "border-violet-400/30 bg-violet-400/10 text-violet-300 [&>span]:bg-violet-300",
  Shortlisted:
    "border-sky-400/30 bg-sky-400/10 text-sky-300 [&>span]:bg-sky-300",
  Rejected: "border-red-400/30 bg-red-400/10 text-red-300 [&>span]:bg-red-300",
  Offered:
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 [&>span]:bg-emerald-300",
};

/* Plain-text status colors (recruiter table STATUS column, per the mock). */
export const STATUS_TEXT: Record<ApplicationStatus, string> = {
  Applied: "text-zinc-400",
  Review: "text-yellow-400",
  Interview: "text-violet-400",
  Shortlisted: "text-sky-400",
  Rejected: "text-red-400",
  Offered: "text-emerald-400",
};

/**
 * Dot indicator + colored pill per application status. Shared by the
 * seeker's My Applications table and the recruiter's per-job review page —
 * add a new ApplicationStatus color here, not in the tables.
 */
export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${STATUS_BADGE[status]}`}
    >
      <span className="size-1.5 rounded-full" />
      {status}
    </span>
  );
}
