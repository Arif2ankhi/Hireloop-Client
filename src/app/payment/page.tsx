"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeftIcon, CreditCardIcon } from "lucide-react";

/**
 * Payment page the free-tier cap redirects to (/payment). Mirror of the
 * Stripe Checkout mock: plan summary + card payment method + Pay button.
 *
 * The Pay handler is a placeholder — it will start a Stripe Checkout
 * session (redirect to Stripe's hosted page) once the backend endpoint
 * exists. No card fields here; Stripe owns that form.
 *
 * Stripe appends ?canceled=true when the user backs out of checkout;
 * the notice below surfaces that back on this page.
 */

const PLAN = {
  name: "Hireloop Pro Plan",
  description: "Access to all features",
  symbol: "$",
  price: 20,
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled") === "true";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      {/* Back to homepage */}
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeftIcon className="size-4" />
        Back to homepage
      </Link>

      {/* Order canceled — returned from Stripe's ?canceled=true redirect */}
      {canceled ? (
        <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
          Order canceled — continue browsing and check out when you&apos;re
          ready.
        </p>
      ) : null}

      {/* Plan summary */}
      <section className="rounded-xl bg-[#131317] p-5 ring-1 ring-white/5">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-base font-semibold text-white">{PLAN.name}</h1>
          <p className="text-lg font-semibold text-white">
            {PLAN.symbol}
            {PLAN.price.toFixed(2)}
          </p>
        </div>
        <p className="mt-1 text-sm text-zinc-500">{PLAN.description}</p>
      </section>

      {/* Payment method */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          Payment method
        </h2>
        <div className="rounded-xl bg-[#131317] p-4 ring-1 ring-brand">
          <div className="flex items-center gap-2.5">
            <CreditCardIcon className="size-4.5 text-white" />
            <span className="text-sm font-medium text-white">Card</span>
            <span className="ml-auto size-2.5 rounded-full bg-brand ring-2 ring-brand/30" />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-zinc-400">
            You will be redirected to Stripe&apos;s secure checkout to complete
            your payment. Your card details will be stored in HireLoop for
            faster checkout next time.
          </p>
        </div>
      </section>

      {/* Pay — native form POST to the API route, which 303-redirects the
          browser to Stripe's hosted checkout (fetch would follow the
          redirect itself instead of navigating) */}
      <form action="/api/checkout_sessions" method="post">
        <button
          type="submit"
          className="h-11 w-full rounded-lg bg-[#0570de] text-sm font-semibold text-white transition-colors hover:bg-[#0a63c2]"
        >
          Pay {PLAN.symbol}
          {PLAN.price.toFixed(2)}
        </button>
      </form>

      <p className="text-center text-xs text-zinc-500">
        Checkout is handled securely by Stripe. Cancel anytime.
      </p>
    </div>
  );
}

export default function PaymentPage() {
  // useSearchParams needs a Suspense boundary on a prerendered page.
  return (
    <main className="dark min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:py-16">
      <React.Suspense>
        <PaymentContent />
      </React.Suspense>
    </main>
  );
}
