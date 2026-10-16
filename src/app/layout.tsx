import type { Metadata } from "next";
import { SessionProvider } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  // Social previews need absolute image URLs.
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: { default: "Kubbo3D · Todo para tu taller de impresión 3D", template: "%s · Kubbo3D" },
  description:
    "Calculadora de costos y precios para impresión 3D, herramientas para tus archivos STL y tienda de filamento e impresoras. Una sola cuenta.",
  openGraph: { images: ["/brand/og.jpg"] },
};

// Applies the saved theme before the first paint, so a light-mode visitor never sees a dark flash.
const themeScript = `try{var t=localStorage.getItem("kubbo-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme is set by the script above before React hydrates.
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
