"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export function AccountButton() {
  const { session, loading } = useSession();
  const pathname = usePathname();
  if (loading) return null;

  if (!session) {
    return (
      <Link href={`/entrar?next=${encodeURIComponent(pathname)}`} className="btn btn-primary">
        Entrar
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-48 truncate text-sm text-muted sm:inline">{session.user.email}</span>
      <Link href="/cuenta" className="btn">
        Mi plan
      </Link>
      <button type="button" className="btn" onClick={() => supabase().auth.signOut()}>
        Salir
      </button>
    </div>
  );
}
