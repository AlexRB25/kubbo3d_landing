import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

// Server-only helpers for the subscriptions. Nothing here may be imported from a client component.

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True when the site can charge subscriptions. */
export const paymentsConfigured = () =>
  Boolean(process.env.MP_ACCESS_TOKEN && process.env.SUPABASE_SECRET_KEY && process.env.PB_SUPABASE_URL);

/**
 * Pesos per dollar used to charge: Mercado Pago only charges in the currency of the seller's
 * country, so the dollar price of a plan becomes this many pesos. 0 when not configured.
 */
export const usdRate = () => Number(process.env.MP_USD_RATE) || 0;

/** Currency Mercado Pago charges in (the seller's country): MXN in México. */
export const chargeCurrency = () => process.env.MP_CURRENCY || "MXN";

/** What a plan costs in the charge currency, rounded to whole pesos. */
export const chargeAmount = (priceUsd: number) => Math.round(priceUsd * usdRate());

let client: SupabaseClient | undefined;

/** Bypasses RLS: only for recording what Mercado Pago says about a subscription. */
export function adminClient(): SupabaseClient {
  return (client ??= createClient(process.env.PB_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  }));
}

/** Calls the Mercado Pago API with the seller's access token. */
export function mercadoPago(path: string, init?: RequestInit) {
  return fetch(`https://api.mercadopago.com${path}`, {
    ...init,
    cache: "no-store",
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, "Content-Type": "application/json", ...init?.headers },
  });
}

/** The signed-in user who made the request ("Authorization: Bearer <access token>"), checked with Supabase. */
export async function userFromRequest(request: Request): Promise<User | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await adminClient().auth.getUser(token);
  return error ? null : data.user;
}

const STATUSES = ["pending", "authorized", "paused", "cancelled"] as const;

/**
 * Reads a subscription from Mercado Pago and saves it. Always from the API, never trusted from
 * the caller, so the webhook and the return page can both call it. When a new subscription is
 * authorized, the user's previous one is cancelled (that is how plans are changed).
 * "retry" means Mercado Pago or the database could not be reached.
 */
export async function syncPreapproval(id: string): Promise<"ok" | "ignored" | "retry"> {
  if (!/^[\w-]{6,64}$/.test(id)) return "ignored";
  const response = await mercadoPago(`/preapproval/${id}`);
  if (response.status === 404) return "ignored";
  if (!response.ok) return "retry";
  const preapproval = await response.json();
  // Our own subscriptions carry "<user id>:<plan id>".
  const [userId, planId] = String(preapproval.external_reference ?? "").split(":");
  if (!UUID.test(userId ?? "") || !planId) return "ignored";

  const db = adminClient();
  const plan = await db.from("plans").select("id").eq("id", planId).maybeSingle();
  if (plan.error) return "retry";
  if (!plan.data) return "ignored";

  const status = STATUSES.includes(preapproval.status) ? (preapproval.status as (typeof STATUSES)[number]) : "pending";
  const next = preapproval.next_payment_date ?? null;
  const saved = await db.from("subscriptions").select("paid_until").eq("mp_preapproval_id", id).maybeSingle();
  if (saved.error) return "retry";
  // While it is active it is paid until the next charge; once cancelled it keeps the date it had.
  const paidUntil = status === "authorized" && next ? next : (saved.data?.paid_until ?? null);

  const upsert = await db.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_id: planId,
      mp_preapproval_id: id,
      status,
      amount: Number(preapproval.auto_recurring?.transaction_amount) || 0,
      currency: preapproval.auto_recurring?.currency_id ?? chargeCurrency(),
      payer_email: preapproval.payer_email ?? "",
      next_payment_date: next,
      paid_until: paidUntil,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "mp_preapproval_id" },
  );
  if (upsert.error) return "retry";

  if (status === "authorized") {
    // A new plan replaces the old one right away: the old subscription stops charging.
    const others = await db
      .from("subscriptions")
      .select("mp_preapproval_id")
      .eq("source", "mercadopago")
      .eq("user_id", userId)
      .neq("mp_preapproval_id", id)
      .in("status", ["authorized", "paused"]);
    if (others.error) return "retry";
    for (const other of others.data) {
      const cancel = await mercadoPago(`/preapproval/${other.mp_preapproval_id}`, { method: "PUT", body: JSON.stringify({ status: "cancelled" }) });
      if (!cancel.ok) return "retry";
      await db
        .from("subscriptions")
        .update({ status: "cancelled", paid_until: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("mp_preapproval_id", other.mp_preapproval_id);
    }
  }
  return "ok";
}
