import { createHmac, timingSafeEqual } from "node:crypto";
import { mercadoPago, paymentsConfigured, syncPreapproval } from "@/lib/server";

/**
 * Checks the x-signature header ("ts=…,v1=…"): v1 is the HMAC-SHA256, in hex, of
 * "id:<data.id>;request-id:<x-request-id>;ts:<ts>;" with the secret of the webhook.
 */
function validSignature(request: Request, dataId: string, secret: string) {
  const parts = Object.fromEntries(
    (request.headers.get("x-signature") ?? "").split(",").map((part) => part.trim().split("=") as [string, string]),
  );
  if (!parts.ts || !parts.v1) return false;
  const manifest = `id:${dataId.toLowerCase()};request-id:${request.headers.get("x-request-id") ?? ""};ts:${parts.ts};`;
  const expected = Buffer.from(createHmac("sha256", secret).update(manifest).digest("hex"));
  const received = Buffer.from(parts.v1);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

/**
 * Mercado Pago calls this when a subscription changes (authorized, paused, cancelled) and on every
 * monthly charge. Any answer other than 200/201 makes it retry later, so only temporary failures
 * answer with an error.
 */
export async function POST(request: Request) {
  if (!paymentsConfigured()) return new Response(null, { status: 503 });

  const url = new URL(request.url);
  const body = await request.json().catch(() => null);
  const type = body?.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const id = String(body?.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? "");
  if (!id || (type !== "subscription_preapproval" && type !== "subscription_authorized_payment")) {
    return new Response(null, { status: 200 });
  }

  const secret = process.env.MP_WEBHOOK_SECRET;
  if (secret && !validSignature(request, url.searchParams.get("data.id") ?? id, secret)) {
    return new Response(null, { status: 401 });
  }

  let preapprovalId = id;
  if (type === "subscription_authorized_payment") {
    // A monthly charge: what matters is the subscription it belongs to (its next charge date moves on).
    const charge = await mercadoPago(`/authorized_payments/${id}`);
    if (charge.status === 404) return new Response(null, { status: 200 });
    if (!charge.ok) return new Response(null, { status: 502 });
    preapprovalId = String((await charge.json()).preapproval_id ?? "");
  }
  const result = await syncPreapproval(preapprovalId);
  return new Response(null, { status: result === "retry" ? 502 : 200 });
}
