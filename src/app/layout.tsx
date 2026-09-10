import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

import { isSanityConfigured } from "@/sanity/env";
import { SanityLive } from "@/sanity/lib/live";

// Serif para títulos (H1, H2, H3, Metrics)
const signifier = localFont({
  variable: "--font-signifier",
  src: [
    { path: "../fonts/TestSignifier-Extralight.otf", weight: "200", style: "normal" },
    { path: "../fonts/TestSignifier-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/TestSignifier-ExtralightItalic.otf", weight: "300", style: "italic" },
    { path: "../fonts/TestSignifier-Bold.otf", weight: "500", style: "normal" },
    { path: "../fonts/TestSignifier-Regular.otf", weight: "400", style: "normal" },
  ],
});

// Sans para textos (H4, H5, Body)
const archivo = localFont({
  variable: "--font-archivo",
  src: [
    { path: "../fonts/Archivo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Archivo-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Archivo-Bold.ttf", weight: "700", style: "normal" },
  ],
});

// Mono para etiquetas (Micro, Tags, Navigation, Data)
const fragmentMono = localFont({
  variable: "--font-mono-brand",
  src: "../fonts/FragmentMono-Regular.ttf",
});

export const metadata: Metadata = {
  title: "Square2 — Projects",
  description: "Corporate site with a project portfolio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${signifier.variable} ${archivo.variable} ${fragmentMono.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip bg-background text-foreground">
        {children}
        {isSanityConfigured ? <SanityLive /> : null}
      </body>
    </html>
  );
}
