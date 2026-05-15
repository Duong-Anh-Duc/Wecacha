import {ArrowUpRight, Flame, Leaf, ShieldCheck, Truck} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {SectionHeading} from "@/components/sections/section-heading";
import {ProductCard} from "@/components/shop/product-card";
import {Button} from "@/components/ui/button";
import {Reveal} from "@/components/motion/reveal";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {products} from "@/lib/content";

export async function FeaturedProductsSection({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "Home"});
  const common = await getTranslations({locale, namespace: "Common"});
  const featuredProducts = products.filter((product) => product.featured);

  const promises = [
    {icon: Leaf, title: t("promise1Title"), copy: t("promise1Copy")},
    {icon: Flame, title: t("promise2Title"), copy: t("promise2Copy")},
    {icon: Truck, title: t("promise3Title"), copy: t("promise3Copy")},
    {icon: ShieldCheck, title: t("promise4Title"), copy: t("promise4Copy")}
  ];

  return (
    <section className="bg-forest-900 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <SectionHeading
              light
              kicker={t("shopSectionKicker")}
              title={t("productsTitle")}
            />
          </Reveal>
          <Button asChild variant="outline">
            <Link href="/shop">
              {common("viewAll")}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} />
          ))}
        </div>
        <div className="group/promises relative mt-8 grid overflow-hidden rounded-2xl border border-white/10 bg-forest-950/48 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
          <span
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 animate-soft-sweep bg-gradient-to-r from-transparent via-parchment-50/16 to-transparent blur-sm"
            aria-hidden="true"
          />
          {promises.map(({icon: Icon, title, copy}, index) => (
            <div key={title} className="group/promise relative flex items-center gap-4 rounded-xl p-3 transition duration-300 hover:bg-white/6">
              <span
                className="pointer-events-none absolute inset-0 animate-small-sweep rounded-xl bg-gradient-to-r from-transparent via-white/8 to-transparent"
                style={{animationDelay: `${index * 0.7}s`}}
                aria-hidden="true"
              />
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-forest-800/42 text-ember transition duration-300 group-hover/promise:scale-110 group-hover/promise:bg-ember/12 group-hover/promise:shadow-[0_0_28px_rgba(243,167,52,0.22)]">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="relative">
                <span className="block text-sm font-black uppercase tracking-[0.04em] text-parchment-50">
                  {title}
                </span>
                <span className="mt-1 block text-xs font-medium text-ember/84">
                  {copy}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
