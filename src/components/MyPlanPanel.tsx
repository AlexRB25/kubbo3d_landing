"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMyPlan } from "@/lib/my-plan";
import { useSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

const date = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) : "";

async function manage(body: object) {
  const token = (await supabase().auth.getSession()).data.session?.access_token;
  const response = await fetch("/api/suscripcion", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  }).catch(() => null);
  const answer = await response?.json().catch(() => null);
  return { ok: Boolean(response?.ok), error: answer?.error as string | undefined };
}

function Meter({ label, used, limit, unit = "" }: { label: string; used: number; limit: number | null; unit?: string }) {
  const share = limit ? Math.min(1, used / limit) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted">
          {used.toLocaleString("es-MX")}
          {unit} {limit === null ? "· sin límite" : `de ${limit.toLocaleString("es-MX")}${unit}`}
        </span>
      </div>
      {limit !== null && (
        <div className="h-2 overflow-hidden rounded-full bg-line" role="presentation">
          <div className={`h-full rounded-full ${share >= 1 ? "bg-red-500" : "bg-brand"}`} style={{ width: `${share * 100}%` }} />
        </div>
      )}
    </div>
  );
}

/** Current plan, usage against its limits, and the subscription (cancel, change). */
export function MyPlanPanel() {
  const { session, loading } = useSession();
  const params = useSearchParams();
  const returning = params.get("preapproval_id");
  const [version, setVersion] = useState(0);
  const [synced, setSynced] = useState(!returning);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const { myPlan, error } = useMyPlan(version);

  // Back from Mercado Pago: record the new subscription now instead of waiting for the webhook.
  useEffect(() => {
    if (!returning || !session || synced) return;
    manage({ action: "sync", id: returning }).then(() => {
      setSynced(true);
      setVersion((value) => value + 1);
    });
  }, [returning, session, synced]);

  if (loading) return <p className="text-muted">Cargando…</p>;
  if (!session) {
    return (
      <div className="card flex flex-col items-start gap-3">
        <p>Entra con tu cuenta para ver tu plan.</p>
        <Link href="/entrar?next=/cuenta" className="btn btn-primary">
          Entrar
        </Link>
      </div>
    );
  }
  if (error) return <p className="text-red-500">No se pudo leer tu plan: {error}</p>;
  if (!myPlan || !synced) return <p className="text-muted">{synced ? "Cargando tu plan…" : "Activando tu suscripción…"}</p>;

  const { plan, subscription, usage } = myPlan;
  // Given from the admin panel: no charges, it ends on its date (or never).
  const given = subscription?.source === "admin";
  const active = subscription?.status === "authorized" && !given;
  const cancelledButPaid = subscription?.status === "cancelled" && subscription.paid_until && new Date(subscription.paid_until) > new Date();

  async function cancel() {
    if (!window.confirm(`¿Cancelar tu plan ${plan.name}? Ya no se te cobrará y lo conservas hasta que termine el mes que pagaste.`)) return;
    setBusy(true);
    const result = await manage({ action: "cancel" });
    setBusy(false);
    setMessage(result.ok ? "Listo: tu suscripción quedó cancelada." : (result.error ?? "No se pudo cancelar. Intenta de nuevo."));
    setVersion((value) => value + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      {returning && active && <p className="card border-brand text-brand">¡Gracias! Tu plan {plan.name} ya está activo.</p>}
      <section className="card flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-bold">
            Plan <span className="text-brand">{plan.name}</span>
          </h2>
          {plan.price_usd > 0 && <span className="text-muted">USD {plan.price_usd} / mes</span>}
        </div>
        {active && subscription && (
          <p className="text-sm text-muted">
            Próximo cobro: {date(subscription.next_payment_date)} · ${subscription.amount.toLocaleString("es-MX")} {subscription.currency} a{" "}
            {subscription.payer_email}
          </p>
        )}
        {given && subscription && plan.id === subscription.plan_id && (
          <p className="text-sm text-muted">
            Plan asignado por Kubbo3D, sin cobro: {subscription.lifetime ? "es de por vida." : `vence el ${date(subscription.paid_until)}.`}
          </p>
        )}
        {!given && cancelledButPaid && subscription && (
          <p className="text-sm text-muted">Cancelaste tu suscripción: sigues con este plan hasta el {date(subscription.paid_until)} y después pasas a Gratis.</p>
        )}
        {!given && subscription?.status === "paused" && (
          <p className="text-sm text-red-500">Mercado Pago no pudo cobrar tu plan. Revisa tu tarjeta en Mercado Pago para no perderlo.</p>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href="/precios" className="btn btn-primary">
            {plan.price_usd > 0 ? "Cambiar de plan" : "Mejorar mi plan"}
          </Link>
          {(active || (!given && subscription?.status === "paused")) && (
            <button type="button" className="btn" onClick={cancel} disabled={busy}>
              {busy ? "Cancelando…" : "Cancelar suscripción"}
            </button>
          )}
        </div>
        {message && <p role="status" className="text-sm">{message}</p>}
      </section>

      <section className="card flex flex-col gap-4">
        <h2 className="text-lg font-bold">Lo que llevas usado</h2>
        <Meter label="Productos" used={usage.products} limit={plan.max_products} />
        <Meter label="Impresoras" used={usage.printers} limit={plan.max_printers} />
        <Meter label="Descargas de herramientas 3D este mes" used={usage.tool_downloads_month ?? 0} limit={plan.tool_runs_month} />
        <Meter label="Mis archivos" used={usage.storage_mb} limit={plan.storage_mb} unit=" MB" />
      </section>
    </div>
  );
}
