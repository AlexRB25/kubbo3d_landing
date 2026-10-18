import type { Metadata } from "next";
import { PRICING_FAQ, Pricing } from "@/components/Pricing";
import { SiteHeader } from "@/components/SiteHeader";
import { loadPlans } from "@/lib/plans";
import { chargeCurrency, usdRate } from "@/lib/server";

export const metadata: Metadata = {
  title: "Precios · Kubbo3D",
  description: "Planes de Kubbo3D: empieza gratis y crece con tu taller de impresión 3D.",
};

// Plans are edited in Supabase: the page is rebuilt every few minutes to show the changes.
export const revalidate = 300;

export default async function PricingPage() {
  const plans = await loadPlans();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-14">
        <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Planes para cada taller</h1>
          <p className="text-lg text-muted">Empieza gratis. Cuando tu taller crezca, sube de plan; cancelas cuando quieras.</p>
        </div>
        <Pricing plans={plans} rate={usdRate()} currency={chargeCurrency()} />
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
          {PRICING_FAQ.map((item) => (
            <details key={item.q} className="card">
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}
