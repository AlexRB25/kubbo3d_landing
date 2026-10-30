import { stripe } from "@/lib/stripe";
import { adminClient, paymentsConfigured, syncSubscription, userFromRequest } from "@/lib/server";

/**
 * The signed-in user's subscription:
 * { action: "sync", session } after coming back from Stripe (activates the plan without waiting for the webhook);
 * { action: "cancel" } stops the charges; the plan stays until the end of the month already paid.
 */
export async function POST(request: Request) {
  if (!paymentsConfigured()) return Response.json({ error: "Los pagos todavía no están configurados." }, { status: 503 });
  const user = await userFromRequest(request);
  if (!user) return Response.json({ error: "Entra con tu cuenta." }, { status: 401 });
  const body = await request.json().catch(() => null);

  if (body?.action === "sync") {
    const sessionId = String(body.session ?? "");
    if (!/^cs_\w{10,200}$/.test(sessionId)) return Response.json({ ok: false });
    const response = await stripe(`/checkout/sessions/${sessionId}`);
    if (!response.ok) return Response.json({ ok: false }, { status: response.status === 404 ? 200 : 502 });
    const session = await response.json();
    // Only the user who paid can record it.
    if (session.client_reference_id !== user.id || !session.subscription) return Response.json({ ok: false });
    const result = await syncSubscription(String(session.subscription));
    return Response.json({ ok: result === "ok" }, { status: result === "retry" ? 502 : 200 });
  }

  if (body?.action === "cancel") {
    const active = await adminClient()
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", user.id)
      // Plans given from the admin panel are not in Stripe: only the panel ends them.
      .eq("source", "stripe")
      .in("status", ["authorized", "paused", "pending"]);
    if (active.error) return Response.json({ error: "No se pudo leer tu suscripción." }, { status: 502 });
    for (const { stripe_subscription_id: id } of active.data) {
      if (!id) continue;
      // Stops at the end of the month already paid: the plan lasts until then.
      const cancel = await stripe(`/subscriptions/${id}`, { cancel_at_period_end: true });
      if (!cancel.ok) return Response.json({ error: "Stripe no respondió. Intenta de nuevo en un momento." }, { status: 502 });
      await syncSubscription(id);
    }
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Acción desconocida." }, { status: 400 });
}
