// Every text and link of the landing in one place, so it can be edited without touching the layout.

const base = (value: string | undefined) => (value ?? "").replace(/\/+$/, "");

export type Service = {
  id: "calculadora" | "herramientas" | "tienda";
  name: string;
  tagline: string;
  description: string;
  features: string[];
  /** Where the service lives; empty while it is not deployed, and the card says "Muy pronto". */
  href: string;
  cta: string;
  /** Needs a Kubbo3D account. */
  needsAccount: boolean;
};

export const SERVICES: Service[] = [
  {
    id: "calculadora",
    name: "Calculadora Kubbo3D",
    tagline: "Tu taller bajo control",
    description:
      "Calcula el costo real de cada pieza y el precio para Mercado Libre, TikTok o venta directa. Lleva tu filamento, tus impresiones, ventas, gastos y el mantenimiento de tus impresoras.",
    features: [
      "Costo por pieza: filamento, luz, desgaste y embalaje",
      "Precio con envío y sin envío por canal",
      "Inventario de filamento y de piezas",
      "En la web y en la app móvil",
    ],
    href: base(process.env.PB_CALCULATOR_URL) && `${base(process.env.PB_CALCULATOR_URL)}/app`,
    cta: "Abrir la calculadora",
    needsAccount: true,
  },
  {
    id: "herramientas",
    name: "Herramientas 3D",
    tagline: "Transforma tus archivos",
    description:
      "Sube un STL, OBJ o 3MF y conviértelo en piezas que encajan, moldes, cortadores de galletas, piezas huecas, alcancías o lámparas.",
    features: [
      "Partir en piezas con espigas, macho-hembra o rosca",
      "Moldes rígidos, cajas para silicona y moldes para gomitas",
      "Llaveros, huecos para imanes, cortadores, alcancías y lámparas",
      "Tu archivo se procesa en tu navegador",
    ],
    href: base(process.env.PB_TOOLS_URL),
    cta: "Abrir las herramientas",
    needsAccount: true,
  },
  {
    id: "tienda",
    name: "Tienda Kubbo",
    tagline: "Lo que usamos en el taller",
    description: "Impresiones 3D, filamento, impresoras y refacciones. Paga con Mercado Pago y recíbelo en casa.",
    features: ["Filamento e impresoras", "Impresiones listas", "Refacciones", "Pago con Mercado Pago"],
    href: base(process.env.PB_STORE_URL),
    cta: "Ir a la tienda",
    needsAccount: false,
  },
];

// BORRADOR: reemplaza estos textos por la historia real del equipo.
export const ABOUT = {
  title: "Quiénes somos",
  paragraphs: [
    "En Kubbo3D imprimimos en 3D todos los días. Vendemos impresiones, filamento e impresoras, y con el tiempo fuimos creando las herramientas que nosotros mismos necesitábamos para llevar el taller.",
    "Ahora las compartimos: una calculadora para saber cuánto cuesta y cuánto deja cada pieza, herramientas para preparar tus archivos y una tienda con lo que usamos.",
  ],
  values: [
    { title: "Hecho por quienes imprimen", text: "Cada función nace de un problema real del taller." },
    { title: "Tus archivos son tuyos", text: "Las herramientas 3D trabajan en tu navegador; lo que guardas en Mis archivos es privado y solo lo ves tú." },
    { title: "Una sola cuenta", text: "La misma cuenta sirve en la calculadora, las herramientas y la app móvil." },
  ],
};

/** Shown in the footer only when filled in. */
export const CONTACT = {
  email: "",
  /** Digits only, with country code (52…). */
  whatsapp: "",
  instagram: "",
  tiktok: "",
};
