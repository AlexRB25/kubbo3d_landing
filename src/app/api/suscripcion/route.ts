import { adminClient, mercadoPago, paymentsConfigured, syncPreapproval, userFromRequest } from "@/lib/server";

/**
 * The signed-in user's subscription:
 * { action: "sync", id } after coming back from Mercado Pago (activates the plan without waiting for the webhook);
 * { action: "cancel" } stops the charges; the plan stays until the end of the month already paid.
 */
export async function POST(request: Request) {
  if (!paymentsConfigured()) return Response.json({ error: "Los pagos todavía no están configurados." }, { status: 503 });
  const user = await userFromRequest(request);
  if (!user) return Response.json({ error: "Entra con tu cuenta." }, { status: 401 });
  const body = await request.json().catch(() => null);

  if (body?.action === "sync") {
    const result = await syncPreapproval(String(body.id ?? ""));
    return Response.json({ ok: result === "ok" }, { status: result === "retry" ? 502 : 200 });
  }

  if (body?.action === "cancel") {
    const db = adminClient();
    const active = await db
      .from("subscriptions")
      .select("mp_preapproval_id")
      .eq("user_id", user.id)
      .in("status", ["authorized", "paused", "pending"]);
    if (active.error) return Response.json({ error: "No se pudo leer tu suscripción." }, { status: 502 });
    for (const { mp_preapproval_id: id } of active.data) {
      const cancel = await mercadoPago(`/preapproval/${id}`, { method: "PUT", body: JSON.stringify({ status: "cancelled" }) });
      if (!cancel.ok) return Response.json({ error: "Mercado Pago no respondió. Intenta de nuevo en un momento." }, { status: 502 });
      await syncPreapproval(id);
    }
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Acción desconocida." }, { status: 400 });
}
