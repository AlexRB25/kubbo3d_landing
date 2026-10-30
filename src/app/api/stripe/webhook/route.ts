import { paymentsConfigured, syncSubscription } from "@/lib/server";
import { validStripeSignature } from "@/lib/stripe";

/** The subscription an event is about: the object itself, its checkout, or the invoice of a monthly charge. */
function subscriptionOf(object: Record<string, unknown> & { parent?: { subscription_details?: { subscription?: string } } }) {
  if (object.object === "subscription") return String(object.id ?? "");
  if (object.object === "checkout.session" || object.object === "invoice") {
    return String(object.subscription ?? object.parent?.subscription_details?.subscription ?? "");
  }
  return "";
}

/**
 * Stripe calls this when a subscription starts, renews, fails to charge or ends. Events to send it:
 * checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.paid
 * and invoice.payment_failed. Any answer other than 2xx makes Stripe retry, so only temporary failures
 * answer with an error. The subscription is read again from the API before saving anything.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!paymentsConfigured() || !secret) return new Response(null, { status: 503 });

  const payload = await request.text();
  if (!validStripeSignature(payload, request.headers.get("stripe-signature"), secret)) return new Response(null, { status: 401 });
  const event = JSON.parse(payload);
  const id = subscriptionOf(event.data?.object ?? {});
  if (!id) return new Response(null, { status: 200 });
  const result = await syncSubscription(id);
  return new Response(null, { status: result === "retry" ? 502 : 200 });
}
