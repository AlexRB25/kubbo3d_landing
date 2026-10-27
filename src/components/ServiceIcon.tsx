import type { Service } from "@/lib/content";

const PATHS: Record<Service["id"], React.ReactNode> = {
  // A calculator with a coin.
  calculadora: (
    <>
      <rect x="22" y="12" width="44" height="64" rx="6" />
      <rect x="30" y="20" width="28" height="12" rx="2" />
      <path d="M32 44h4M44 44h4M56 44h0M32 54h4M44 54h4M32 64h4M44 64h4" />
      <circle cx="70" cy="70" r="14" />
      <path d="M70 62v16M65 66h7a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h7" strokeWidth={3} />
    </>
  ),
  // A cube cut in two with a dowel between the halves.
  herramientas: (
    <>
      <path d="M50 12l28 14v14l-28 14-28-14V26z" />
      <path d="M22 26l28 14 28-14M50 40v14" />
      <path d="M22 60l28 14 28-14v14L50 88 22 74z" />
      <path d="M50 74v14" />
      <rect x="46" y="50" width="8" height="18" rx="2" fill="currentColor" fillOpacity={0.3} />
    </>
  ),
  // A cube on a download arrow.
  modelos: (
    <>
      <path d="M50 10l26 13v26L50 62 24 49V23z" />
      <path d="M24 23l26 13 26-13M50 36v26" />
      <path d="M50 70v18M40 80l10 10 10-10" />
    </>
  ),
  // A shopping bag with a spool of filament.
  tienda: (
    <>
      <path d="M20 34h60l-6 50H26z" />
      <path d="M36 34v-6a14 14 0 0 1 28 0v6" />
      <circle cx="50" cy="60" r="12" />
      <circle cx="50" cy="60" r="4" />
    </>
  ),
};

export function ServiceIcon({ id, size = 72 }: { id: Service["id"]; size?: number }) {
  return (
    <div className="glow flex items-center justify-center rounded-2xl border border-line bg-raised text-brand" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size * 0.68} height={size * 0.68} fill="none" stroke="currentColor" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" aria-hidden>
        {PATHS[id]}
      </svg>
    </div>
  );
}
