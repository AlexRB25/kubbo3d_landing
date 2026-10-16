"use client";

import Link from "next/link";
import { SERVICES } from "@/lib/content";
import { useSession } from "@/lib/session";

/** Signed out: create an account or sign in. Signed in: straight to each service. */
export function HeroActions() {
  const { session, loading } = useSession();
  if (loading) return <div className="h-12" />;

  if (!session) {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/entrar?modo=registro" className="btn btn-primary px-5 py-3 text-base">
          Crear mi cuenta
        </Link>
        <Link href="/entrar" className="btn px-5 py-3 text-base">
          Ya tengo cuenta
        </Link>
      </div>
    );
  }

  const name = (session.user.user_metadata?.name as string | undefined)?.split(" ")[0];
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-muted">{name ? `Hola, ${name}. ¿A dónde vamos?` : "¿A dónde vamos?"}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {SERVICES.filter((service) => service.href).map((service, index) => (
          <a key={service.id} href={service.href} className={`btn px-5 py-3 text-base ${index === 0 ? "btn-primary" : ""}`}>
            {service.cta}
          </a>
        ))}
      </div>
    </div>
  );
}
