import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="s2-page flex-1 bg-background">
        <Navbar />
        {children}
      </div>
      <Footer />
    </>
  );
}
