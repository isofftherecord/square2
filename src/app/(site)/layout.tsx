import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { isSanityConfigured } from "@/sanity/env";
import { SanityLive } from "@/sanity/lib/live";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="s2-page flex-1">
        <Navbar />
        {children}
      </div>
      <Footer />
      {isSanityConfigured ? <SanityLive /> : null}
    </>
  );
}
