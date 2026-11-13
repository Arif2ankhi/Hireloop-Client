import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    // Require a signed-in user so the payment can be tied to the account
    // (the success page reads userId from the session metadata to set
    // premium on the right user).
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be signed in to upgrade.' },
        { status: 401 },
      )
    }

    const headersList = await headers()
    const origin = headersList.get('origin') ?? 'http://localhost:3000'

    // Create Checkout Sessions from body params.
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1UbKriGy2486750hM4e30gr9',
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: session.user.email,
      metadata: { userId: session.user.id },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'hireloop-pro-plan',
    });

    // session.url is typed string | null — guarded per the SDK contract;
    // with hosted Checkout it is always set.
    if (!checkoutSession.url) {
      return NextResponse.json({ error: 'Checkout session has no URL' }, { status: 500 });
    }
    return NextResponse.redirect(checkoutSession.url, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}