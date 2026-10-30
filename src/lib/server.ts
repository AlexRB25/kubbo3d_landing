import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { stripe } from "./stripe";

// Server-only helpers for the subscriptions. Nothing here may be imported from a client component.

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True when the site can charge subscriptions (Stripe). */
export const paymentsConfigured = () =>
  Boolean(process.env.STRIPE_SECRET_KEY && process.env.SUPABASE_SECRET_KEY && process.env.PB_SUPABASE_URL);

let client: SupabaseClient | undefined;

/** Bypasses RLS: only for recording what Stripe says about a subscription. */
export function adminClient(): SupabaseClient {
  return (client ??= createClient(process.env.PB_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  }));
}

/** The signed-in user who made the request ("Authorization: Bearer <access token>"), checked with Supabase. */
export async function userFromRequest(request: Request): Promise<User | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await adminClient().auth.getUser(token);
  return error ? null : data.user;
}

type Status = "pending" | "authorized" | "paused" | "cancelled";

/** Stripe's subscription status in our words: active (or trialing) is authorized, unpaid ones are paused. */
function ourStatus(subscription: { status: string; cancel_at_period_end?: boolean }): Status {
  if (subscription.status === "canceled" || subscription.status === "incomplete_expired") return "cancelled";
  if (subscription.cancel_at_period_end) return "cancelled";
  if (subscription.status === "active" || subscription.status === "trialing") return "authorized";
  if (subscription.status === "past_due" || subscription.status === "unpaid" || subscription.status === "paused") return "paused";
  return "pending";
}

const isoFromUnix = (seconds: unknown) => (Number(seconds) > 0 ? new Date(Number(seconds) * 1000).toISOString() : null);

/**
 * Reads a subscription from Stripe and saves it. Always from the API, never trusted from the caller, so
 * the webhook and the return page can both call it. While it is active it is paid until the end of the
 * current month; cancelled at the end of the month it keeps that date, so the plan lasts what was paid.
 * When a new subscription becomes active, the user's previous one is cancelled at once (that is how plans
 * are changed). "retry" means Stripe or the database could not be reached.
 */
export async function syncSubscription(id: string): Promise<"ok" | "ignored" | "retry"> {
  if (!/^sub_\w{6,200}$/.test(id)) return "ignored";
  const response = await stripe(`/subscriptions/${id}`);
  if (response.status === 404) return "ignored";
  if (!response.ok) return "retry";
  const subscription = await response.json();
  const userId = String(subscription.metadata?.user_id ?? "");
  const planId = String(subscription.metadata?.plan_id ?? "");
  if (!UUID.test(userId) || !planId) return "ignored";

  const db = adminClient();
  const plan = await db.from("plans").select("id").eq("id", planId).maybeSingle();
  if (plan.error) return "retry";
  if (!plan.data) return "ignored";

  const item = subscription.items?.data?.[0];
  const currency = String(item?.price?.currency ?? subscription.currency ?? "usd").toUpperCase();
  // The end of the month already paid (newer API versions keep it on the item).
  const periodEnd = isoFromUnix(item?.current_period_end ?? subscription.current_period_end);
  const status = ourStatus(subscription);
  const ended = subscription.status === "canceled" ? isoFromUnix(subscription.ended_at ?? subscription.canceled_at) : null;

  const upsert = await db.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_id: planId,
      source: "stripe",
      stripe_subscription_id: id,
      status,
      amount: Number(item?.price?.unit_amount ?? 0) / (["CLP", "PYG"].includes(currency) ? 1 : 100),
      currency,
      payer_email: String(subscription.metadata?.email ?? ""),
      next_payment_date: status === "authorized" ? periodEnd : null,
      paid_until: ended ?? periodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (upsert.error) return "retry";

  if (status === "authorized") {
    // A new plan replaces the old one right away: the old subscription stops charging.
    const others = await db
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("source", "stripe")
      .eq("user_id", userId)
      .neq("stripe_subscription_id", id)
      .in("status", ["authorized", "paused", "pending"]);
    if (others.error) return "retry";
    for (const other of others.data) {
      if (!other.stripe_subscription_id) continue;
      const cancel = await stripe(`/subscriptions/${other.stripe_subscription_id}`, undefined, "DELETE");
      if (!cancel.ok && cancel.status !== 404) return "retry";
      const now = new Date().toISOString();
      await db.from("subscriptions").update({ status: "cancelled", paid_until: now, updated_at: now }).eq("stripe_subscription_id", other.stripe_subscription_id);
    }
  }
  return "ok";
}
