import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import {CinematicPageHero} from "@/components/sections/cinematic-page-hero";
import {Reveal} from "@/components/motion/reveal";
import {imageLibrary} from "@/lib/content";
import type {Locale} from "@/i18n/routing";
import {Link} from "@/i18n/navigation";
import Image from "next/image";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: locale === "vi" ? "Tin tức · Wecacha" : "News · Wecacha",
  };
}

export default async function NewsIndexPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const isVi = locale === "vi";

  return (
    <main className="bg-parchment-50">
      <CinematicPageHero
        kicker={isVi ? "Góc nhìn" : "Perspectives"}
        title={isVi ? "Tin Tức & Cập Nhật" : "News & Updates"}
        copy={isVi ? "Cập nhật những câu chuyện mới nhất về cà phê, sự kiện và công thức pha chế đặc biệt từ Sơn La." : "Latest stories about coffee, events, and special recipes from Son La."}
        image={imageLibrary.cup}
        imageAlt="News"
        scrollLabel={isVi ? "Khám phá ngay" : "Explore now"}
      />
      
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { slug: "coffee-culture", title: isVi ? "Văn hóa cà phê" : "Coffee Culture", img: imageLibrary.coffeePour },
              { slug: "events", title: isVi ? "Sự kiện & Hoạt động" : "Events", img: imageLibrary.farm },
              { slug: "recipes", title: isVi ? "Công thức pha chế" : "Recipes", img: imageLibrary.phin }
            ].map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 0.1}>
                <Link href={`/news/${cat.slug}`} className="group block overflow-hidden rounded-2xl bg-white shadow-warm">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={cat.img} alt={cat.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="font-serif text-2xl text-forest-950 transition-colors group-hover:text-ember">{cat.title}</h3>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-forest-950/50 group-hover:text-ember/70 transition-colors">
                      {isVi ? "Xem thêm" : "Read more"} &rarr;
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
