import { API_BASE_URL } from "@/lib/api/config";

/**
 * Verify a Stripe Checkout session via the Express backend
 * (POST /payments/checkout-verify). The backend re-checks the session
 * with Stripe, records the payment in the `payments` collection and sets
 * premium on the user record — the frontend only renders the result.
 */
export const checkoutVerify = async (
  sessionId: string,
): Promise<{
  success: boolean;
  message?: string;
  /** Stripe payment_intent id — the transaction id shown on the receipt. */
  transactionId?: string | null;
  /** Plan amount in major units (e.g. 20 = $20.00), per the backend. */
  amount?: number;
  currency?: string;
  customerEmail?: string | null;
  paymentDate?: string;
  /** True when this session was verified before (page refresh). */
  alreadyVerified?: boolean;
}> => {
  const res = await fetch(`${API_BASE_URL}/payments/checkout-verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`checkoutVerify failed: ${res.status}`);
  }

  return res.json();
};
