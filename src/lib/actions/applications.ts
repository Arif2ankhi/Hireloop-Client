import { API_BASE_URL } from "@/lib/api/config";
import type { JobApplication } from "@/types/applications";

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
  applicantId: string,
): Promise<JobApplication[]> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/applications?applicantId=${encodeURIComponent(applicantId)}`,
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
