import { TitleHero, type TitleHeroSlide } from "@/components/title-hero";

export function TitlePage({
  slides,
  fallbackTitle,
}: {
  slides: TitleHeroSlide[];
  fallbackTitle: string;
}) {
  return (
    <main className="s2-subgrid">
      {slides.length > 0 ? (
        <TitleHero slides={slides} />
      ) : (
        <section className="col-span-12 pt-40 pb-16">
          <h1 className="text-h1">{fallbackTitle}</h1>
        </section>
      )}
    </main>
  );
}
