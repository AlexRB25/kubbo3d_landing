import { planLimits, type Plan } from "@/lib/plans";
import { PlanButton } from "./PlanButton";

const money = (value: number) => value.toLocaleString("es-MX", { maximumFractionDigits: 0 });

/** The plan cards. `rate` = pesos per dollar charged (0 when not configured). */
export function Pricing({ plans, rate, currency }: { plans: Plan[]; rate: number; currency: string }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => (
        <article
          key={plan.id}
          className={`card relative flex flex-col gap-4 ${plan.highlighted ? "border-brand shadow-lg ring-1 ring-brand" : ""}`}
        >
          {plan.highlighted && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-0.5 text-xs font-bold text-on-brand">
              El más elegido
            </span>
          )}
          <div>
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-sm text-muted">{plan.tagline}</p>
          </div>
          <div>
            {plan.price_usd > 0 ? (
              <>
                <p className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-muted">USD</span>
                  <span className="text-4xl font-black">{money(plan.price_usd)}</span>
                  <span className="text-sm text-muted">/ mes</span>
                </p>
                <p className="text-xs text-muted">
                  {rate > 0 ? `Se cobra en pesos: $${money(Math.round(plan.price_usd * rate))} ${currency} al mes` : "Se cobra en pesos al tipo de cambio"}
                </p>
              </>
            ) : (
              <>
                <p className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-muted">USD</span>
                  <span className="text-4xl font-black">0</span>
                  <span className="text-sm text-muted">/ mes</span>
                </p>
                <p className="text-xs text-muted">Sin tarjeta, para siempre</p>
              </>
            )}
          </div>
          <ul className="flex flex-col gap-1.5 text-sm">
            {[...plan.features, ...planLimits(plan)].map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-brand" aria-hidden>
                  ✓
                </span>
                {line}
              </li>
            ))}
            {!plan.color_export && (
              <li className="flex gap-2 text-muted">
                <span aria-hidden>–</span>
                Sin descargas con colores
              </li>
            )}
          </ul>
          <div className="mt-auto pt-2">
            <PlanButton plan={plan} />
          </div>
        </article>
      ))}
    </div>
  );
}

export const PRICING_FAQ = [
  {
    q: "¿En qué moneda me cobran?",
    a: "Los precios están en dólares y Mercado Pago cobra en pesos mexicanos cada mes, con el monto que ves en cada plan. Puedes pagar con tarjeta de crédito, débito o con tu saldo de Mercado Pago.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Cancelas desde Mi plan y ya no se te cobra; sigues con tu plan hasta que termina el mes que pagaste y después pasas a Gratis sin perder nada de lo que guardaste.",
  },
  {
    q: "¿Qué pasa si llego al límite de mi plan?",
    a: "Todo lo que ya tienes sigue ahí. Solo no puedes agregar más productos, impresoras o archivos, o usar más veces las herramientas ese mes, hasta que mejores tu plan (o empiece el mes siguiente, en el caso de las herramientas).",
  },
  {
    q: "¿Cómo cambio de plan?",
    a: "Elige el nuevo plan aquí mismo. En cuanto Mercado Pago lo activa, el anterior se cancela solo para que no pagues dos.",
  },
  {
    q: "¿Una suscripción sirve para todo Kubbo3D?",
    a: "Sí: es la misma cuenta en la calculadora (web y app) y en las herramientas 3D.",
  },
];
