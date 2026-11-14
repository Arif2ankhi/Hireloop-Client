import { API_BASE_URL } from "@/lib/api/config";
import type { ApplicationStatus, JobApplication } from "@/types/applications";

/**
 * Persist one application to the backend: POST /applications.
 * The server inserts into the `applications` collection and returns the
 * saved document (including its generated _id).
 */
export const createApplication = async (
  payload: Omit<JobApplication, "_id">,
): Promise<JobApplication> => {
  const res = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`createApplication failed: ${res.status}`);
  }

  return (await res.json()) as JobApplication;
};

/** All applications of one seeker — the My Applications page data source. */
export const getApplications = async (
  query: string,
): Promise<JobApplication[]> => {
  try {
    const res = await fetch(
    //   `${API_BASE_URL}/applications?applicantId=${encodeURIComponent(applicantId)}`,
      `${API_BASE_URL}/applications?applicantId=${query}`,
      { signal: AbortSignal.timeout(3000) },
    );

    if (!res.ok) {
      throw new Error(`getApplications failed: ${res.status}`);
    }

    return (await res.json()) as JobApplication[];
  } catch (err) {
    // Backend offline → empty list instead of crashing the page.
    console.error("getApplications unavailable:", err);
    return [];
  }
};


/**
 * All applications for one job — the recruiter's per-job review page
 * (/dashboard/recruiter/jobs/[id]/applications). Requires the backend's
 * GET /applications to honor a jobId query param.
 */
export const getJobApplications = async (
  jobId: string,
): Promise<JobApplication[]> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/applications?jobId=${encodeURIComponent(jobId)}`,
      { signal: AbortSignal.timeout(3000) },
    );

    if (!res.ok) {
      throw new Error(`getJobApplications failed: ${res.status}`);
    }

    return (await res.json()) as JobApplication[];
  } catch (err) {
    // Backend offline → empty list instead of crashing the page.
    console.error("getJobApplications unavailable:", err);
    return [];
  }
};


/**
 * How many applications one seeker has submitted — used by the Apply flow's
 * free-tier cap (JobCard redirects to /payment at the limit). Hits the
 * dedicated backend route GET /applications/count?applicantId=<id>; a
 * backend error counts as 0 (fail open, same convention as getApplications).
 */
export const getApplicationsCount = async (
  applicantId: string,
): Promise<{ count: number }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/applications/count?applicantId=${applicantId}`,
      { signal: AbortSignal.timeout(3000) },
    );

    if (!res.ok) {
      throw new Error(`getApplicationsCount failed: ${res.status}`);
    }

    return (await res.json()) as { count: number };
  } catch (err) {
    console.error("getApplicationsCount unavailable:", err);
    return { count: 0 };
  }
};


/**
 * Recruiter status update for one application: PATCH /applications/:id/status
 * with { status }. Follows the write-wrapper convention — throws on failure
 * so the caller can roll back its optimistic UI change.
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
): Promise<void> => {
  const res = await fetch(
    `${API_BASE_URL}/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      signal: AbortSignal.timeout(5000),
    },
  );

  if (!res.ok) {
    throw new Error(`updateApplicationStatus failed: ${res.status}`);
  }
};


// export const getApplication = async (data)
