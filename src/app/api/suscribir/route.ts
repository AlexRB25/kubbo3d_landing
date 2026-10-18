import { adminClient, chargeAmount, chargeCurrency, mercadoPago, paymentsConfigured, usdRate, userFromRequest } from "@/lib/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Starts a monthly subscription: creates it in Mercado Pago (pending) and answers with the page
 * where the user enters the card. Mercado Pago tells us when it is authorized (webhook).
 */
export async function POST(request: Request) {
  if (!paymentsConfigured() || !usdRate()) {
    return Response.json({ error: "Los pagos todavía no están configurados. Escríbenos para activar tu plan." }, { status: 503 });
  }
  const user = await userFromRequest(request);
  if (!user) return Response.json({ error: "Entra con tu cuenta para suscribirte." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? user.email ?? "").trim();
  if (!EMAIL.test(email)) return Response.json({ error: "Escribe el correo de tu cuenta de Mercado Pago." }, { status: 400 });

  const plan = await adminClient().from("plans").select("id, name, price_usd").eq("id", String(body?.plan ?? "")).eq("active", true).maybeSingle();
  if (plan.error) return Response.json({ error: "No se pudo leer el plan. Intenta de nuevo." }, { status: 502 });
  if (!plan.data || Number(plan.data.price_usd) <= 0) return Response.json({ error: "Ese plan no existe." }, { status: 400 });

  const site = (process.env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, "");
  const response = await mercadoPago("/preapproval", {
    method: "POST",
    body: JSON.stringify({
      reason: `Kubbo3D · Plan ${plan.data.name}`,
      external_reference: `${user.id}:${plan.data.id}`,
      payer_email: email,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: chargeAmount(Number(plan.data.price_usd)),
        currency_id: chargeCurrency(),
      },
      back_url: `${site}/cuenta`,
      status: "pending",
    }),
  });
  const preapproval = await response.json().catch(() => null);
  if (!response.ok || !preapproval?.init_point) {
    console.error("Mercado Pago no creó la suscripción", response.status, preapproval);
    return Response.json(
      { error: `Mercado Pago no aceptó la suscripción${preapproval?.message ? `: ${preapproval.message}` : "."} Revisa el correo de tu cuenta de Mercado Pago.` },
      { status: 502 },
    );
  }
  return Response.json({ url: preapproval.init_point });
}
