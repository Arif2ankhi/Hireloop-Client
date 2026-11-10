/**
 * Job application types — the single shared home for the applications
 * domain, used by the Apply flow, the API layers and the seeker
 * dashboard's My Applications page.
 */

/**
 * Progress of one application, as shown in the status column:
 * Applied → Review → Shortlisted → Offered (or Rejected).
 */
export type ApplicationStatus =
  | "Applied"
  | "Review"
  | "Shortlisted"
  | "Rejected"
  | "Offered";

/**
 * One job application. Job snapshot fields (title, companyName, type,
 * isRemote, salaryMin/Max, frequency) are copied from the job card at
 * apply time so the My Applications table works even if the job listing
 * is later edited or removed from the jobs collection.
 */
export type JobApplication = {
  /** MongoDB id of the application document. */
  _id?: string;
  /** MongoDB id of the applied job (the /browse-jobs/[id] route id). */
  jobId: string;

  /* Who applied — mirrors the better-auth user record. */
  applicantId: string; // better-auth user id
  applicantName: string;
  applicantEmail: string;

  /* Job snapshot (copied at apply time, not references). */
  title: string;
  companyName: string;
  type: string; // "Full-time" | "Part-time" | …
  isRemote: "on" | "off"; // checkbox-native value, consistent with jobs
  salaryMin: string;
  salaryMax: string;
  frequency: string;

  status: ApplicationStatus;
  /** false = "Active" tab, true = "Archived" tab of My Applications. */
  archived: boolean;
  /** ISO timestamp — rendered as "2 hours ago" in the table. */
  appliedAt: string;
};
