import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { PRIVACY_EMAIL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Términos y condiciones · Kubbo3D",
  description: "Las reglas para usar Kubbo3D: tu cuenta, los planes y pagos, la tienda, el marketplace de modelos y los anuncios.",
};

const UPDATED = "24 de noviembre de 2026";

const SECTIONS: { title: string; body: (string | string[])[] }[] = [
  {
    title: "Aceptación",
    body: [
      "Estos términos aplican a todos los servicios de Kubbo3D: la calculadora de costos (web y app para Android e iOS), las herramientas 3D, el escáner 3D, la tienda en línea de cada taller, la Tienda Kubbo, el marketplace de modelos y los anuncios de equipos y servicio técnico. Al crear una cuenta o usar cualquiera de ellos aceptas estos términos y el Aviso de privacidad. Si no estás de acuerdo, no uses Kubbo3D.",
      "Debes ser mayor de 18 años y tener capacidad para contratar. Si usas Kubbo3D a nombre de un negocio, aceptas estos términos también a su nombre.",
    ],
  },
  {
    title: "Tu cuenta",
    body: [
      [
        "Da datos verdaderos y mantenlos al día. Cuida tu contraseña: lo que se haga con tu cuenta es tu responsabilidad.",
        "Si invitas colaboradores a tu taller, tú decides qué rol tienen y respondes por lo que hagan dentro de él.",
        "Puedes eliminar tu cuenta cuando quieras desde la app, la web o kubbo3d.com/eliminar-cuenta.",
      ],
    ],
  },
  {
    title: "Planes y pagos",
    body: [
      [
        "Hay un plan Gratis con límites y planes de pago con más funciones. Lo que incluye cada plan y su precio están en kubbo3d.com/precios.",
        "Los planes de pago se cobran por adelantado cada mes a tu tarjeta, por medio de Stripe, hasta que canceles. El cargo puede verse en tu moneda al tipo de cambio del día.",
        "Cancelas cuando quieras desde Mi plan: ya no se te cobra, conservas tu plan hasta que termina el mes que pagaste y después pasas a Gratis. No hacemos reembolsos por meses usados a medias, salvo cuando la ley lo exija.",
        "Si un cobro falla, podemos pasar tu cuenta a Gratis hasta que se pague. Tus datos no se borran por eso.",
        "Los paquetes de escaneos 3D y otras compras únicas se pagan una vez y no son reembolsables una vez usados.",
        "Si cambiamos un precio te avisamos antes de tu siguiente cobro. Si no estás de acuerdo, puedes cancelar.",
      ],
    ],
  },
  {
    title: "Cómo se usa la calculadora",
    body: [
      "Los costos, precios, comisiones e impuestos que calcula Kubbo3D son estimados que se basan en los datos que tú capturas y en valores de arranque (por ejemplo, comisiones de las plataformas de venta). Revísalos con los valores reales de tus cuentas. Las decisiones de precio, impuestos y contabilidad de tu negocio son tuyas; Kubbo3D no es asesor fiscal ni contable.",
    ],
  },
  {
    title: "Tus archivos y tu contenido",
    body: [
      [
        "Lo que subes (fotos, archivos STL, 3MF o G-code, modelos, descripciones, anuncios) sigue siendo tuyo. Nos das permiso de guardarlo, procesarlo y mostrarlo solo para darte el servicio; por ejemplo, para que tu tienda o tu modelo se vean en línea.",
        "Solo sube lo que tienes derecho a usar. No subas contenido ilegal, ofensivo, que engañe o que infrinja derechos de otras personas, como diseños o marcas registradas sin permiso.",
        "Las herramientas 3D procesan tu archivo en tu navegador. Revisa siempre el resultado antes de imprimirlo: no garantizamos que una pieza, molde o corte salga perfecto en tu impresora.",
        "El escáner 3D envía tus fotos a KIRI Engine para formar el modelo. La calidad depende de las fotos que tomes.",
      ],
    ],
  },
  {
    title: "La tienda de tu taller",
    body: [
      "Si abres una tienda en Kubbo3D, tú eres el vendedor: fijas los precios, entregas los pedidos y atiendes cambios, garantías y devoluciones conforme a la ley. Kubbo3D solo da la herramienta y procesa el cobro por medio de Stripe; no es parte de la venta entre tú y tu cliente.",
    ],
  },
  {
    title: "Tienda Kubbo",
    body: [
      "En la Tienda Kubbo nosotros vendemos. El precio, la disponibilidad y el tiempo de entrega se muestran antes de pagar. Si tu pedido llega dañado, incompleto o no es lo que compraste, escríbenos dentro de los 7 días siguientes a recibirlo y lo resolvemos con un cambio o un reembolso. Esto no limita los derechos que te da la Ley Federal de Protección al Consumidor.",
    ],
  },
  {
    title: "Marketplace de modelos",
    body: [
      [
        "Quien compra o descarga un modelo recibe la licencia que indica su ficha (personal o comercial), no la propiedad del diseño. No puedes revender ni compartir el archivo, salvo que la licencia lo permita.",
        "Como son archivos digitales que se entregan al momento, las compras no son reembolsables una vez descargado el modelo, salvo que el archivo esté dañado o no corresponda a lo anunciado.",
        "Quien vende declara que el diseño es suyo o que tiene permiso para venderlo. Kubbo3D cobra la comisión que se muestra en tu panel de vendedor y te paga el resto al método que registres cuando llegues al monto mínimo de retiro. Tú eres responsable de los impuestos de tus ventas.",
        "Si crees que un modelo infringe tus derechos de autor, envíanos un reclamo desde la ficha del modelo. Podemos retirar el modelo mientras lo revisamos y cerrar la cuenta de quien infrinja derechos varias veces.",
      ],
    ],
  },
  {
    title: "Equipos y servicio técnico",
    body: [
      "Los anuncios de equipos usados y de técnicos los publican otros usuarios. El trato, el pago y la entrega se arreglan directamente entre ustedes (por ejemplo, por WhatsApp); Kubbo3D no es parte de esas operaciones ni garantiza los equipos ni los servicios. Revisa bien antes de pagar y no envíes dinero por adelantado a quien no conoces.",
    ],
  },
  {
    title: "Uso prohibido",
    body: [
      [
        "Usar Kubbo3D para fraudes, estafas o cualquier actividad ilegal.",
        "Intentar entrar a cuentas o datos que no son tuyos, saturar el servicio o copiarlo con programas automáticos.",
        "Revender o sublicenciar el acceso a Kubbo3D sin nuestro permiso.",
        "Fabricar o vender con Kubbo3D armas o piezas de armas, o cualquier producto cuya venta prohíba la ley.",
      ],
      "Si alguien rompe estos términos podemos quitar su contenido, limitar o cerrar su cuenta. Si es posible, avisamos antes y explicamos por qué.",
    ],
  },
  {
    title: "Disponibilidad y cambios",
    body: [
      "Trabajamos para que Kubbo3D funcione siempre, pero puede haber fallas o pausas de mantenimiento. Podemos agregar, cambiar o quitar funciones. Si quitamos algo importante de un plan de pago, te avisamos antes. Te recomendamos exportar tus datos de vez en cuando.",
    ],
  },
  {
    title: "Responsabilidad",
    body: [
      "Kubbo3D se ofrece tal como está. En la medida que la ley lo permita, no respondemos por ganancias perdidas, piezas mal impresas, material desperdiciado ni daños indirectos por usar el servicio. Si llegáramos a ser responsables, el máximo será lo que nos pagaste en los últimos 3 meses. Nada de esto limita los derechos que la ley te da como consumidor.",
    ],
  },
  {
    title: "Cambios a estos términos",
    body: [
      "Si cambiamos algo importante te avisamos por correo o dentro de la app antes de que aplique. Si sigues usando Kubbo3D después de esa fecha, aceptas los nuevos términos. La fecha de arriba indica la última actualización.",
    ],
  },
  {
    title: "Ley aplicable",
    body: [
      "Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Antes de cualquier trámite, escríbenos para intentar resolverlo. Como consumidor también puedes acudir a la Procuraduría Federal del Consumidor (PROFECO).",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-14">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Términos y condiciones</h1>
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
            Para dudas sobre estos términos escríbenos a{" "}
            <a className="font-semibold text-brand" href={`mailto:${PRIVACY_EMAIL}`}>
              {PRIVACY_EMAIL}
            </a>
            . Consulta también nuestro{" "}
            <a className="font-semibold text-brand" href="/privacidad">
              Aviso de privacidad
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
}
