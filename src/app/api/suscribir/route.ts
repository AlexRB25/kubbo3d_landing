import { chargeCurrency, chargeFromUsd, stripe } from "@/lib/stripe";
import { adminClient, paymentsConfigured, userFromRequest } from "@/lib/server";

/**
 * Starts a monthly subscription: opens a Stripe Checkout where the user enters the card. The plan's price
 * (in dollars) is charged in the currency they chose, at today's rate. Stripe tells us when it is active
 * (webhook), and /cuenta records it as soon as they come back.
 */
export async function POST(request: Request) {
  if (!paymentsConfigured()) {
    return Response.json({ error: "Los pagos todavía no están configurados. Escríbenos para activar tu plan." }, { status: 503 });
  }
  const user = await userFromRequest(request);
  if (!user) return Response.json({ error: "Entra con tu cuenta para suscribirte." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const plan = await adminClient().from("plans").select("id, name, price_usd").eq("id", String(body?.plan ?? "")).eq("active", true).maybeSingle();
  if (plan.error) return Response.json({ error: "No se pudo leer el plan. Intenta de nuevo." }, { status: 502 });
  if (!plan.data || Number(plan.data.price_usd) <= 0) return Response.json({ error: "Ese plan no existe." }, { status: 400 });

  const currency = chargeCurrency(body?.currency);
  const metadata = { user_id: user.id, plan_id: plan.data.id, email: user.email ?? "" };
  const site = (process.env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, "");
  const response = await stripe("/checkout/sessions", {
    mode: "subscription",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: await chargeFromUsd(Number(plan.data.price_usd), currency),
          recurring: { interval: "month" },
          product_data: { name: `Kubbo3D · Plan ${plan.data.name}` },
        },
      },
    ],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata,
    subscription_data: { metadata },
    success_url: `${site}/cuenta?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/precios`,
    locale: "es",
  });
  const session = await response.json().catch(() => null);
  if (!response.ok || !session?.url) {
    console.error("Stripe no creó la suscripción", response.status, session);
    return Response.json({ error: "No pudimos abrir el pago. Intenta de nuevo en un momento." }, { status: 502 });
  }
  return Response.json({ url: session.url });
}
