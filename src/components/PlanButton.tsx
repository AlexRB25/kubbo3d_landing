"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CURRENCIES, fromMxn, isCurrency, loadRates, type Currency } from "@/lib/currency";
import { useMyPlan } from "@/lib/my-plan";
import type { Plan } from "@/lib/plans";
import { useSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

const CALCULATOR_URL = (process.env.PB_CALCULATOR_URL ?? "").replace(/\/+$/, "");

const formatted = (amount: number, currency: Currency) => {
  const { locale, digits } = CURRENCIES.find((item) => item.code === currency) ?? CURRENCIES[0];
  return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount);
};

/** The call to action of a plan card: sign up, current plan, or subscribe with Stripe in the user's currency. */
export function PlanButton({ plan }: { plan: Plan }) {
  const { session, loading } = useSession();
  const { myPlan } = useMyPlan();
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("MXN");
  const [rates, setRates] = useState<Record<Currency, number> | null>(null);
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
      body: JSON.stringify({ plan: plan.id, currency }),
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
        onClick={async () => {
          setOpen(true);
          // The currency of the user's workshop, if they already chose one in the calculator.
          const { data } = await supabase().from("profiles").select("currency").eq("id", session.user.id).maybeSingle();
          if (isCurrency(data?.currency) && data.currency !== "VES") setCurrency(data.currency);
          setRates(await loadRates());
        }}
      >
        {myPlan && myPlan.plan.price_usd > 0 ? `Cambiar a ${plan.name}` : `Elegir ${plan.name}`}
      </button>
    );
  }
  return (
    <form onSubmit={subscribe} className="flex flex-col gap-2 text-left">
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Pagar en
        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value as Currency)}
          className="rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg"
        >
          {CURRENCIES.filter((item) => item.code !== "VES").map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      {rates && currency !== "USD" && (
        <p className="text-sm">
          ≈ <strong>{formatted(fromMxn(plan.price_usd / rates.USD, currency, rates), currency)}</strong> {currency} al mes
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Abriendo el pago…" : "Pagar con tarjeta"}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
      <p className="text-xs text-muted">
        Se cobra cada mes con tu tarjeta, en la moneda que elijas, al tipo de cambio del día en que te suscribes. Cancelas cuando quieras desde Mi plan.
        {myPlan && myPlan.plan.price_usd > 0 && " Tu plan actual se cancela al activarse el nuevo."}
      </p>
    </form>
  );
}
