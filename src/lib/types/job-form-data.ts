/**
 * Canonical shape of one job document, as stored by the Express backend and
 * produced by the New Job form (FormData → flat strings, per the doc above).
 * Reuse this type for form handlers, API wrappers and table rows.
 */

/** Checkbox-native remote flag — FormData posts exactly these strings. */
export type RemoteFlag = "on" | "off";

/** Options of the New Job form's category select. */
export type JobCategory =
  | "Engineering & Tech"
  | "Design"
  | "Marketing"
  | "Product"
  | "Data & Analytics"
  | "Other";

/** Options of the New Job form's job-type chips. */
export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

/** Options of the frequency select. */
export type PayFrequency = "per hour" | "per day" | "per month" | "per year";

/**
 * One job post exactly as the backend stores it (see e.g. the
 * "Sales Development Representative" document), except `_id` is optional so
 * the same type covers both "about to be created" and "fetched" payloads.
 */
export type JobFormData = {
  /** MongoDB ObjectId as a string; absent before the document is inserted. */
  _id?: string;

  title: string;
  companyName: string;
  recruiterId: string,
  category: JobCategory;
  /** Stored per JobType ("Part-time", …); some legacy docs may use "Full-Time" — always compare case-insensitively. */
  type: JobType;
  /** Always "on" | "off" (never boolean); docs missing this field should be backfilled to "off". */
  isRemote: RemoteFlag;

  /** "New York, USA" or "" for remote-only listings. */
  location: string;
  /** ISO date string, yyyy-mm-dd. */
  deadline: string;

  /** Kept as strings on purpose — FormData only yields strings. */
  salaryMin: string;
  salaryMax: string;
  frequency: PayFrequency;

  responsibilities: string;
  requirements: string;
};

/* ------------------------------------------------------------------ */
/* Option lists — single source for the New Job form and the browse    */
/* filters, guaranteed to satisfy the type unions above.               */
/* ------------------------------------------------------------------ */

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const satisfies ReadonlyArray<JobType>;

export const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design",
  "Marketing",
  "Product",
  "Data & Analytics",
  "Other",
] as const satisfies ReadonlyArray<JobCategory>;

export const PAY_FREQUENCIES = [
  "per hour",
  "per day",
  "per month",
  "per year",
] as const satisfies ReadonlyArray<PayFrequency>;
