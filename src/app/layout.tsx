import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

// Serif para títulos (H1, H2, H3, Metrics)
const signifier = localFont({
  variable: "--font-signifier",
  src: [
    { path: "../fonts/TestSignifier-Extralight.otf", weight: "200", style: "normal" },
    { path: "../fonts/TestSignifier-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/TestSignifier-LightItalic.otf", weight: "300", style: "italic" },
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
  title: "Square2 — Proyectos",
  description: "Sitio corporativo con portafolio de proyectos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${signifier.variable} ${archivo.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
