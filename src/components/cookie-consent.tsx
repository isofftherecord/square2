"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

import { Button } from "@/components/button";

// Consentimiento previo (GDPR/UK): Google Analytics no se carga ni pone
// cookies hasta que el visitante acepta. La elección persiste en localStorage.
const STORAGE_KEY = "s2-cookie-consent";
const GA_ID = configured(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

type Consent = "granted" | "denied";

function configured(value?: string) {
  return value && value !== "..." ? value : undefined;
}

function storedConsent(): Consent | null {
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function CookieConsent() {
  // null = sin decidir (muestra el banner); se resuelve tras montar para
  // evitar desajustes de hidratación con localStorage.
  const [consent, setConsent] = useState<Consent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsent(storedConsent());
    setMounted(true);
  }, []);

  function decide(value: Consent) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  }

  return (
    <>
      {/* GA solo se inyecta con consentimiento explícito y un ID configurado. */}
      {consent === "granted" && GA_ID ? <GoogleAnalytics id={GA_ID} /> : null}

      {mounted && consent === null ? (
        <section
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-s2-slate bg-s2-black py-6 text-s2-white"
        >
          <div className="s2-page items-center gap-y-4">
            <p className="text-body col-span-12 lg:col-span-7">
              We use cookies to measure how this site is used. Analytics stays
              off unless you accept — essential features work either way. See
              our{" "}
              <Link href="/privacy-policy" className="underline">
                privacy policy
              </Link>
              .
            </p>
            {/* Aceptar y rechazar con la misma prominencia (requisito GDPR). */}
            <div className="col-span-12 flex gap-4 lg:col-span-5 lg:justify-self-end">
              <Button
                type="button"
                withArrow={false}
                onClick={() => decide("denied")}
              >
                Decline
              </Button>
              <Button
                type="button"
                withArrow={false}
                onClick={() => decide("granted")}
              >
                Accept
              </Button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

// Carga gtag.js con Consent Mode v2. Solo se renderiza tras el accept, así
// que ninguna cookie de Google existe antes del consentimiento.
function GoogleAnalytics({ id }: { id: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
