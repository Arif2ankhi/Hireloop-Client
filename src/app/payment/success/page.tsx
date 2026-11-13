import Link from "next/link";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

import { stripe } from "@/lib/stripe";
import { setUserPremium } from "@/lib/api/users";

/**
 * Stripe Checkout redirect target (success_url). Verifies the payment
 * server-side — never trust the browser landing here alone — and sets the
 * premium flag on the paying user (userId rides in the Checkout session
 * metadata, set by /api/checkout_sessions).
 */

type SearchParams = Promise<{ session_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id: sessionId } = await searchParams;

  let paid = false;
  let errorMessage: string | null = null;

  if (sessionId) {
    // try/catch is mandatory here: retrieve hits the Stripe API and throws
    // on an unknown/expired session id — without it the route 500s.
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";

      // userId was stored in the session metadata at checkout creation.
      const userId = session.metadata?.userId;
      if (paid && userId) {
        await setUserPremium(userId, true);
      }
    } catch (err) {
      errorMessage =
        err instanceof Error ? err.message : "Could not verify the payment.";
    }
  }

  return (
    <main className="dark min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:py-16">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 rounded-xl bg-[#131317] p-8 text-center ring-1 ring-white/5">
        {paid ? (
          <>
            <CheckCircle2Icon className="size-12 text-emerald-400" />
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Payment successful
            </h1>
            <p className="text-sm text-zinc-400">
              Hireloop Pro Plan is now active on your account — the
              application limit no longer applies to you.
            </p>
          </>
        ) : (
          <>
            <XCircleIcon className="size-12 text-red-400" />
            <h1 className="text-xl font-semibold tracking-tight text-white">
              {errorMessage ? "We could not verify your payment" : "Payment not completed"}
            </h1>
            <p className="text-sm text-zinc-400">
              {errorMessage
                ? "Your card may have been charged — contact support before paying again."
                : "No checkout session was provided, so nothing was activated."}
            </p>
          </>
        )}

        <Link
          href="/browse-jobs"
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-white text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
        >
          Back to jobs
        </Link>
      </div>
    </main>
  );
}
