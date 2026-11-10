/**
 * Single source of truth for the Express backend origin, shared by every
 * fetch wrapper (`lib/api/*`, `lib/actions/*`).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
