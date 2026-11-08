import type { JobInput } from "@/lib/actions/jobs";

/**
 * One row of the manage-jobs table. Base fields mirror exactly what the New
 * Job form collects (JobInput = FormData → plain record); `_id` is the
 * MongoDB document id; the rest are display-only extras the backend may add.
 */
export type JobPostRow = JobInput & {
  id?: string;
  /** MongoDB documents come with `_id` (the form's local `id` is optional) */
  _id?: string;
  /** kept as string on purpose — FormData only yields strings */
  applicants?: string;
  status?: "Active" | "Expired";
  /** Human representation stored per row, e.g. "Posted 4d ago". */
  postedAt?: string;
};
