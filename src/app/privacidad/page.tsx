import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { PRIVACY_EMAIL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Aviso de privacidad · Kubbo3D",
  description: "Qué datos guarda Kubbo3D, para qué los usa, con quién los comparte y cómo borrarlos.",
};

const UPDATED = "7 de noviembre de 2026";

const SECTIONS: { title: string; body: (string | string[])[] }[] = [
  {
    title: "Quiénes somos",
    body: [
      "Kubbo3D es un conjunto de servicios para talleres de impresión 3D: la calculadora de costos (web y app móvil), las herramientas 3D, la tienda en línea de cada taller y el marketplace de modelos. Este aviso aplica a todos ellos, incluida la app Kubbo3D para Android e iOS.",
    ],
  },
  {
    title: "Qué datos guardamos",
    body: [
      [
        "Tu cuenta: correo, nombre y, si lo das, el nombre de tu negocio. Si entras con Google recibimos tu correo y tu nombre; nunca tu contraseña de Google.",
        "Los datos de tu taller que tú capturas: impresoras, filamentos, productos, trabajos de impresión, ventas, gastos, mantenimiento, proveedores y colaboradores.",
        "Las fotos y archivos que subes (por ejemplo, fotos de tus productos o archivos STL en Mis archivos).",
        "Si usas la tienda: los pedidos de tus clientes con su nombre, correo, teléfono y dirección de envío, para que puedas entregarlos.",
        "Si das de alta clientes o les haces cotizaciones: los datos que tú escribes de ellos (nombre, contacto, nombre fiscal, ID fiscal y los campos de facturación que agregues). Tú eres responsable de tener su permiso para guardarlos.",
        "Si vendes modelos en el marketplace: los datos para pagarte (método, cuenta y titular).",
        "Tu suscripción: plan, estado y fechas. Los datos de tu tarjeta los recibe y guarda Stripe; nosotros no los vemos.",
        "Uso básico: los días en que usas la app y cuántas veces usas las herramientas, para aplicar los límites de tu plan.",
        "Los reportes de fallas que nos envías, con la captura de pantalla que adjuntes.",
      ],
    ],
  },
  {
    title: "Permisos de la app",
    body: [
      "La app pide la cámara y tus fotos solo cuando tú eliges tomar o escoger una foto para un producto. No usa tu ubicación, tus contactos ni el micrófono, y no tiene publicidad.",
    ],
  },
  {
    title: "Para qué los usamos",
    body: [
      [
        "Darte el servicio: calcular costos y precios, guardar tu inventario y tus ventas, y mostrarlos en todos tus dispositivos.",
        "Cobrar tu suscripción y aplicar los límites de tu plan.",
        "Enviarte correos necesarios (confirmar tu cuenta, recuperar el acceso, avisos de pedidos y de tu plan).",
        "Atender tus reportes y mejorar Kubbo3D.",
      ],
      "No vendemos tus datos ni los usamos para publicidad.",
    ],
  },
  {
    title: "Con quién los compartimos",
    body: [
      "Solo con los proveedores que necesitamos para que Kubbo3D funcione, y solo lo necesario:",
      [
        "Supabase: base de datos, inicio de sesión y almacenamiento de archivos.",
        "Vercel: aloja las páginas web.",
        "Stripe: procesa los pagos de las suscripciones y de la tienda.",
        "Resend: envía los correos.",
        "Google: inicio de sesión con Google y, solo si usas la función de redibujar con IA, procesa la imagen que envías.",
      ],
      "Los colaboradores que invitas a tu taller ven los datos del taller. Los compradores de tu tienda ven lo que tú publicas en ella. Podemos entregar datos a una autoridad solo cuando la ley nos obligue.",
    ],
  },
  {
    title: "Seguridad",
    body: [
      "Toda la información viaja cifrada (HTTPS). Cada cuenta solo puede leer sus propios datos y los de los talleres a los que pertenece; lo controla la base de datos con reglas por usuario.",
    ],
  },
  {
    title: "Cuánto tiempo los guardamos",
    body: [
      "Mientras tengas tu cuenta. Si la eliminas, borramos tu cuenta y los datos de tu taller en un máximo de 30 días. Solo conservamos lo que la ley nos obliga a guardar (por ejemplo, registros de pagos), por el tiempo que la ley marque.",
    ],
  },
  {
    title: "Tus derechos",
    body: [
      "Puedes ver y corregir tus datos desde la app o la web en cualquier momento. También puedes pedirnos una copia, oponerte a algún uso o eliminar tu cuenta (derechos ARCO). Para eliminarla sigue los pasos en kubbo3d.com/eliminar-cuenta.",
    ],
  },
  {
    title: "Menores de edad",
    body: ["Kubbo3D es una herramienta de trabajo para mayores de 18 años y no está dirigida a niños."],
  },
  {
    title: "Cambios a este aviso",
    body: [
      "Si cambiamos algo importante te avisaremos por correo o dentro de la app antes de que aplique. La fecha de arriba indica la última actualización.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-14">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Aviso de privacidad</h1>
          <p className="text-sm text-muted">Última actualización: {UPDATED}</p>
        </div>
        {SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">{section.title}</h2>
            {section.body.map((part, index) =>
              typeof part === "string" ? (
                <p key={index} className="leading-relaxed text-muted">
                  {part}
                </p>
              ) : (
                <ul key={index} className="flex list-disc flex-col gap-1.5 pl-5 leading-relaxed text-muted">
                  {part.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ),
            )}
          </section>
        ))}
        <section className="card flex flex-col gap-2">
          <h2 className="text-xl font-bold">Contacto</h2>
          <p className="leading-relaxed text-muted">
            Para cualquier duda sobre tus datos escríbenos a{" "}
            <a className="font-semibold text-brand" href={`mailto:${PRIVACY_EMAIL}`}>
              {PRIVACY_EMAIL}
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
}
