import { createClient } from "@supabase/supabase-js";

/** A row of the plans table (schema.sql of the calculator). Limits: null = unlimited. */
export type Plan = {
  id: string;
  name: string;
  price_usd: number;
  tagline: string;
  sort: number;
  max_products: number | null;
  max_printers: number | null;
  tool_runs_month: number | null;
  storage_mb: number | null;
  color_export: boolean;
  features: string[];
  highlighted: boolean;
};

/** Shown when the database cannot be reached (or before the schema is loaded); same as the seed in schema.sql. */
export const FALLBACK_PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratis",
    price_usd: 0,
    tagline: "Para probar y para tu primer impresora",
    sort: 0,
    max_products: 15,
    max_printers: 2,
    tool_runs_month: 10,
    storage_mb: 500,
    color_export: false,
    features: ["Calculadora en la web y en la app", "Costos, precios por canal y ganancias", "Todas las herramientas 3D", "Soporte por correo"],
    highlighted: false,
  },
  {
    id: "maker",
    name: "Maker",
    price_usd: 25,
    tagline: "Para quien ya vende sus piezas",
    sort: 1,
    max_products: 150,
    max_printers: 5,
    tool_runs_month: 150,
    storage_mb: 5120,
    color_export: true,
    features: ["Todo lo de Gratis", "Inventario de filamento y productos", "Ventas, gastos y mantenimiento", "Descargas con colores para tu laminador"],
    highlighted: false,
  },
  {
    id: "taller",
    name: "Taller",
    price_usd: 49,
    tagline: "Para un taller con varias impresoras",
    sort: 2,
    max_products: null,
    max_printers: 15,
    tool_runs_month: 600,
    storage_mb: 20480,
    color_export: true,
    features: ["Todo lo de Maker", "Soporte prioritario"],
    highlighted: true,
  },
  {
    id: "fabrica",
    name: "Fábrica",
    price_usd: 99,
    tagline: "Para una granja de impresoras",
    sort: 3,
    max_products: null,
    max_printers: null,
    tool_runs_month: null,
    storage_mb: 102400,
    color_export: true,
    features: ["Todo lo de Taller", "Soporte por WhatsApp", "Una sesión de configuración de tu cuenta"],
    highlighted: false,
  },
];

/** The active plans, in order. Read on the server with the public key (the table is readable by anyone). */
export async function loadPlans(): Promise<Plan[]> {
  const url = process.env.PB_SUPABASE_URL;
  const key = process.env.PB_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return FALLBACK_PLANS;
  try {
    const { data, error } = await createClient(url, key, { auth: { persistSession: false } })
      .from("plans")
      .select("*")
      .eq("active", true)
      .order("sort");
    return error || !data?.length ? FALLBACK_PLANS : (data as Plan[]);
  } catch {
    return FALLBACK_PLANS;
  }
}

const count = (value: number | null, one: string, many: string, unlimited: string) =>
  value === null ? unlimited : `${value.toLocaleString("es-MX")} ${value === 1 ? one : many}`;

const storage = (mb: number | null) =>
  mb === null ? "Almacenamiento ilimitado" : mb >= 1024 ? `${Math.round(mb / 1024)} GB en Mis archivos` : `${mb} MB en Mis archivos`;

/** The limits of a plan as lines for its card. */
export function planLimits(plan: Plan): string[] {
  return [
    count(plan.max_products, "producto", "productos", "Productos ilimitados"),
    count(plan.max_printers, "impresora", "impresoras", "Impresoras ilimitadas"),
    plan.tool_runs_month === null ? "Herramientas 3D sin límite" : `${plan.tool_runs_month.toLocaleString("es-MX")} usos de herramientas 3D al mes`,
    storage(plan.storage_mb),
  ];
}
