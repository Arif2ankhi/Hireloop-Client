import { API_BASE_URL } from "@/lib/api/config";

/**
 * Set or clear the premium flag on a user record — Express backend
 * POST /users/:id/premium. Called from the Stripe success page after the
 * payment has been verified server-side.
 *
 * SECURITY: the backend route currently trusts this call; before
 * production it should verify the payment itself (or verify an internal
 * shared secret).
 */
export const setUserPremium = async (userId: string, premium: boolean) => {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/premium`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ premium }),
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`setUserPremium failed: ${res.status}`);
  }

  return res.json();
};
