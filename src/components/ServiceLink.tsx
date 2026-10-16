"use client";

import Link from "next/link";
import type { Service } from "@/lib/content";
import { useSession } from "@/lib/session";

/** A service's button: services that need an account send signed-out visitors to sign in first. */
export function ServiceLink({ service }: { service: Service }) {
  const { session } = useSession();
  if (!service.href) return <span className="btn cursor-default opacity-60">Muy pronto</span>;
  if (service.needsAccount && !session) {
    return (
      <Link href="/entrar" className="btn btn-primary">
        Entra para usarla
      </Link>
    );
  }
  return (
    <a href={service.href} className="btn btn-primary">
      {service.cta}
    </a>
  );
}
