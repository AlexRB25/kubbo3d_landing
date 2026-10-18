import Image from "next/image";
import Link from "next/link";
import { HeroActions } from "@/components/HeroActions";
import { Pricing } from "@/components/Pricing";
import { ServiceIcon } from "@/components/ServiceIcon";
import { ServiceLink } from "@/components/ServiceLink";
import { SiteHeader } from "@/components/SiteHeader";
import { ABOUT, CONTACT, SERVICES } from "@/lib/content";
import { loadPlans } from "@/lib/plans";
import { chargeCurrency, usdRate } from "@/lib/server";

// Plans are edited in Supabase: the page is rebuilt every few minutes to show the changes.
export const revalidate = 300;

export default async function LandingPage() {
  const plans = await loadPlans();
  const contact = [
    CONTACT.email && { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
    CONTACT.whatsapp && { label: "WhatsApp", href: `https://wa.me/${CONTACT.whatsapp}` },
    CONTACT.instagram && { label: "Instagram", href: CONTACT.instagram },
    CONTACT.tiktok && { label: "TikTok", href: CONTACT.tiktok },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="glow pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
            <Image src="/brand/logo.png" alt="Kubbo3D" width={120} height={120} priority className="rounded-3xl bg-[#101315] p-2" />
            <h1 className="text-4xl leading-tight md:text-6xl">
              Todo para tu taller de <span className="text-brand">impresión 3D</span>
            </h1>
            <p className="max-w-xl text-lg text-muted">
              Calcula cuánto te cuesta y cuánto te deja cada pieza, prepara tus archivos con herramientas 3D y consigue
              filamento e impresoras. Todo con una sola cuenta.
            </p>
            <HeroActions />
          </div>
        </section>

        <section id="servicios" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <h2 className="text-center text-3xl font-bold">Nuestros servicios</h2>
          <p className="mt-2 text-center text-muted">Úsalos juntos o por separado.</p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <article key={service.id} className="card flex flex-col gap-4">
                <ServiceIcon id={service.id} />
                <div>
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <p className="text-sm font-medium uppercase tracking-widest text-brand">{service.tagline}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted">{service.description}</p>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-brand" aria-hidden>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-2">
                  <ServiceLink service={service} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-line bg-panel">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold">Una cuenta, todo Kubbo3D</h2>
              <p className="text-muted">
                Crea tu cuenta una vez y entra a la calculadora en la web o en la app, a las herramientas 3D y a la tienda.
                Lo que registras en el teléfono aparece en la computadora.
              </p>
            </div>
            <ol className="flex flex-col gap-3">
              {["Crea tu cuenta aquí mismo.", "Elige el servicio que necesitas.", "Vuelve cuando quieras: todo queda guardado en tu cuenta."].map(
                (step, index) => (
                  <li key={step} className="flex items-center gap-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-on-brand">{index + 1}</span>
                    {step}
                  </li>
                ),
              )}
            </ol>
          </div>
        </section>

        <section id="precios" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <h2 className="text-center text-3xl font-bold">Precios</h2>
          <p className="mt-2 text-center text-muted">Empieza gratis y sube de plan cuando tu taller crezca.</p>
          <div className="mt-10">
            <Pricing plans={plans} rate={usdRate()} currency={chargeCurrency()} />
          </div>
          <p className="mt-6 text-center text-sm">
            <Link href="/precios" className="text-brand hover:underline">
              Preguntas frecuentes sobre los planes
            </Link>
          </p>
        </section>

        <section id="nosotros" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold">{ABOUT.title}</h2>
              {ABOUT.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
              {ABOUT.values.map((value) => (
                <div key={value.title} className="card">
                  <h3 className="font-semibold text-brand">{value.title}</h3>
                  <p className="mt-1 text-sm text-muted">{value.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-muted">
          <span>© {new Date().getFullYear()} Kubbo3D</span>
          <nav className="flex flex-wrap gap-5">
            {SERVICES.filter((service) => service.href).map((service) => (
              <a key={service.id} href={service.href} className="hover:text-fg">
                {service.name}
              </a>
            ))}
            {contact.map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="hover:text-fg">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
