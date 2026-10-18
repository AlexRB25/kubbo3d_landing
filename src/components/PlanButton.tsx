"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useMyPlan } from "@/lib/my-plan";
import type { Plan } from "@/lib/plans";
import { useSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

const CALCULATOR_URL = (process.env.PB_CALCULATOR_URL ?? "").replace(/\/+$/, "");

/** The call to action of a plan card: sign up, current plan, or subscribe through Mercado Pago. */
export function PlanButton({ plan }: { plan: Plan }) {
  const { session, loading } = useSession();
  const { myPlan } = useMyPlan();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const primary = plan.highlighted ? "btn btn-primary w-full" : "btn w-full";

  if (loading) return <span className="btn w-full opacity-50">…</span>;
  if (!session) {
    return (
      <Link href="/entrar?next=/precios" className={primary}>
        {plan.price_usd > 0 ? `Elegir ${plan.name}` : "Crear cuenta gratis"}
      </Link>
    );
  }
  if (myPlan?.plan.id === plan.id) {
    return (
      <Link href="/cuenta" className="btn w-full border-brand text-brand">
        Tu plan actual
      </Link>
    );
  }
  if (plan.price_usd <= 0) {
    return CALCULATOR_URL ? (
      <a href={CALCULATOR_URL} className={primary}>
        Ir a la calculadora
      </a>
    ) : null;
  }

  async function subscribe(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const token = (await supabase().auth.getSession()).data.session?.access_token;
    const response = await fetch("/api/suscribir", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plan: plan.id, email: email || session?.user.email }),
    }).catch(() => null);
    const body = await response?.json().catch(() => null);
    if (response?.ok && body?.url) {
      window.location.assign(body.url);
      return;
    }
    setError(body?.error ?? "No se pudo conectar. Revisa tu conexión e intenta de nuevo.");
    setBusy(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        className={primary}
        onClick={() => {
          setEmail(session.user.email ?? "");
          setOpen(true);
        }}
      >
        {myPlan && myPlan.plan.price_usd > 0 ? `Cambiar a ${plan.name}` : `Elegir ${plan.name}`}
      </button>
    );
  }
  return (
    <form onSubmit={subscribe} className="flex flex-col gap-2 text-left">
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Correo de tu cuenta de Mercado Pago
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg"
        />
      </label>
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Abriendo Mercado Pago…" : "Pagar con Mercado Pago"}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
      <p className="text-xs text-muted">
        Se cobra cada mes en pesos. Cancelas cuando quieras desde Mi plan.
        {myPlan && myPlan.plan.price_usd > 0 && " Tu plan actual se cancela al activarse el nuevo."}
      </p>
    </form>
  );
}
