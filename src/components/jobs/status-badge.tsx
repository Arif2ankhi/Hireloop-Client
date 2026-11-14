import type { ApplicationStatus } from "@/types/applications";

/* Status pill colors (same treatment as the manage-table badges). */
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
