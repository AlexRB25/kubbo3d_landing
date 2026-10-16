import Image from "next/image";
import Link from "next/link";
import { AccountButton } from "./AccountButton";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-wide">
          <Image src="/brand/logo.png" alt="" width={32} height={32} priority className="rounded-md bg-[#101315] p-0.5" />
          KUBBO<span className="text-brand">3D</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-5 text-sm font-medium text-muted md:flex">
          <Link href="/#servicios" className="hover:text-fg">
            Servicios
          </Link>
          <Link href="/#nosotros" className="hover:text-fg">
            Quiénes somos
          </Link>
        </nav>
        <div className="flex-1 md:hidden" />
        <AccountButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
