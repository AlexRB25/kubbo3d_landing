import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { PRIVACY_EMAIL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Eliminar tu cuenta · Kubbo3D",
  description: "Cómo pedir que se borre tu cuenta de Kubbo3D y qué datos se eliminan.",
};

const subject = encodeURIComponent("Eliminar mi cuenta de Kubbo3D");
const body = encodeURIComponent("Hola, quiero eliminar mi cuenta de Kubbo3D y todos sus datos.\n\nCorreo de mi cuenta: ");

export default function DeleteAccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-14">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Eliminar tu cuenta de Kubbo3D</h1>
          <p className="leading-relaxed text-muted">
            Esto aplica a la app Kubbo3D (Android e iOS) y a todos los sitios de Kubbo3D: es la misma cuenta.
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">Cómo pedirlo</h2>
          <ol className="flex list-decimal flex-col gap-1.5 pl-5 leading-relaxed text-muted">
            <li>Si tienes una suscripción, cancélala primero en Mi plan para que no se te vuelva a cobrar.</li>
            <li>
              Escríbenos a <strong className="text-fg">{PRIVACY_EMAIL}</strong> desde el mismo correo de tu cuenta, con el asunto
              «Eliminar mi cuenta de Kubbo3D».
            </li>
            <li>Te confirmamos por correo cuando esté hecho, en un máximo de 30 días.</li>
          </ol>
          <a className="btn btn-primary self-start" href={`mailto:${PRIVACY_EMAIL}?subject=${subject}&body=${body}`}>
            Pedir la eliminación por correo
          </a>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">Qué se borra</h2>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 leading-relaxed text-muted">
            <li>Tu cuenta (correo, nombre y nombre del negocio).</li>
            <li>Impresoras, filamentos, productos, trabajos de impresión, ventas, gastos y mantenimiento.</li>
            <li>Tus fotos y los archivos de Mis archivos.</li>
            <li>Tu tienda, sus pedidos y tus modelos del marketplace, con tus datos de pago.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">Qué se conserva</h2>
          <p className="leading-relaxed text-muted">
            Solo los registros de pagos que la ley nos obliga a guardar, por el tiempo que la ley marque. Los modelos que otras
            personas ya compraron siguen disponibles para ellas.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">Borrar solo algunos datos</h2>
          <p className="leading-relaxed text-muted">
            Si no quieres cerrar tu cuenta, puedes borrar productos, ventas, archivos y demás registros tú mismo desde la app o la
            web, o pedirnos que borremos algo en particular al mismo correo.
          </p>
        </section>
      </main>
    </>
  );
}
