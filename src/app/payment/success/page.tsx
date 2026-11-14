import Link from "next/link";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

import { checkoutVerify } from "@/lib/actions/payments";
import { CopyButton } from "./copy-button";

/**
 * Stripe Checkout redirect target (success_url). The Express backend
 * verifies the session with Stripe, records the payment and sets premium
 * (userId rides in the Checkout session metadata, set by
 * /api/checkout_sessions) — this page renders the result as a receipt.
 */

type SearchParams = Promise<{ session_id?: string }>;

type VerifyResult = Awaited<ReturnType<typeof checkoutVerify>>;

/** One label/value line of the receipt. */
function ReceiptRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="min-w-0 text-sm text-zinc-200">{children}</span>
    </div>
  );
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id: sessionId } = await searchParams;

  let result: VerifyResult | null = null;
  let errorMessage: string | null = null;

  if (sessionId) {
    // try/catch is mandatory here: the verify call hits the network and
    // throws on a stopped backend or an unknown session id — without it
    // the route 500s.
    try {
      result = await checkoutVerify(sessionId);
    } catch (err) {
      errorMessage =
        err instanceof Error ? err.message : "Could not verify the payment.";
    }
  }

  const paid = result?.success === true;
  const hasDetails =
    paid && (result?.transactionId || result?.amount != null);

  return (
    <main className="dark min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:py-16">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        {/* Status card */}
        <div className="flex flex-col items-center gap-4 rounded-xl bg-[#131317] p-8 text-center ring-1 ring-white/5">
          <span
            className={`flex size-14 items-center justify-center rounded-full ${
              paid ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
            }`}
          >
            {paid ? (
              <CheckCircle2Icon className="size-8" />
            ) : (
              <XCircleIcon className="size-8" />
            )}
          </span>

          {paid ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Payment successful
              </h1>
              <p className="text-sm text-zinc-400">
                Hireloop Pro Plan is now active on your account — the
                application limit no longer applies to you.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {errorMessage || result?.message
                  ? "We could not verify your payment"
                  : "Payment not completed"}
              </h1>
              <p className="text-sm text-zinc-400">
                {errorMessage || result?.message
                  ? "Your card may have been charged — contact support before paying again."
                  : "No checkout session was provided, so nothing was activated."}
              </p>
            </>
          )}
        </div>

        {/* Receipt — only when the payment is verified and details exist */}
        {hasDetails ? (
          <section className="rounded-xl bg-[#131317] p-5 ring-1 ring-white/5">
            <h2 className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
              Receipt
            </h2>
            <div className="mt-2 divide-y divide-white/5">
              <ReceiptRow label="Plan">
                Hireloop Pro Plan
              </ReceiptRow>
              {result?.amount != null ? (
                <ReceiptRow label="Amount paid">
                  {(result.currency ?? "usd").toUpperCase()}{" "}
                  {result.amount.toFixed(2)}
                </ReceiptRow>
              ) : null}
              {result?.paymentDate ? (
                <ReceiptRow label="Date">
                  {new Date(result.paymentDate).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </ReceiptRow>
              ) : null}
              {result?.customerEmail ? (
                <ReceiptRow label="Billed to">
                  <span className="truncate">{result.customerEmail}</span>
                </ReceiptRow>
              ) : null}
              {result?.transactionId ? (
                <div className="flex items-center justify-between gap-4 py-2">
                  <span className="text-sm text-zinc-500">
                    Transaction ID
                  </span>
                  <span className="flex min-w-0 items-center gap-1">
                    <code className="truncate font-mono text-xs text-zinc-200">
                      {result.transactionId}
                    </code>
                    <CopyButton value={result.transactionId} />
                  </span>
                </div>
              ) : null}
            </div>
            {result?.alreadyVerified ? (
              <p className="mt-2 text-xs text-zinc-500">
                This payment was already verified — no duplicate record was
                created.
              </p>
            ) : null}
          </section>
        ) : null}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/browse-jobs"
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-white text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Back to jobs
          </Link>
          {paid ? (
            <Link
              href="/dashboard/seeker"
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#1a1a20] text-sm font-medium text-zinc-300 ring-1 ring-white/5 transition-colors hover:text-white"
            >
              Go to dashboard
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
