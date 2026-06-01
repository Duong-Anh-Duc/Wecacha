import Image from "next/image";
import type {Metadata} from "next";
import {Facebook, Mail, MessageCircle, Phone} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {SectionHeading} from "@/components/sections/section-heading";
import {ContactForm} from "@/features/contact/contact-form";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";
import {getPageContent, localizedField, sectionByKey} from "@/lib/content/cms";
import {siteConfig} from "@/lib/site";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const content = await getPageContent("contact");
  const hero = sectionByKey(content, "hero");
  const t = await getTranslations({locale, namespace: "Contact"});
  const tNav = await getTranslations({locale, namespace: "Nav"});
  const title = localizedField(hero, "title", locale) || t("title");
  const description = localizedField(hero, "copy", locale) || t("intro");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        vi: "/vi/contact",
        en: "/en/contact",
        "x-default": "/vi/contact"
      }
    },
    openGraph: {
      title,
      description,
      images: [{url: `/og/image.png?locale=${locale}&title=${encodeURIComponent(title)}&kicker=${encodeURIComponent(tNav("contact"))}`, width: 1200, height: 630}]
    }
  };
}

export default async function ContactPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Contact"});
  const content = await getPageContent("contact");
  const hero = sectionByKey(content, "hero");
  const mediaStrip = sectionByKey(content, "media_strip");
  const map = sectionByKey(content, "map");
  const filmImages = (mediaStrip?.media?.images as string[] | undefined) ?? [
    imageLibrary.village,
    imageLibrary.farm,
    imageLibrary.brocade,
    imageLibrary.campfire,
    imageLibrary.roasted,
    imageLibrary.cup
  ];

  return (
    <main className="bg-forest-950">
      <section className="relative min-h-screen overflow-hidden px-4 pb-12 pt-24 text-white sm:px-6 sm:pt-32 lg:px-8 lg:pt-36 lg:pb-16">
        <Image
          src={hero?.media?.image ?? imageLibrary.village}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="cinematic-vignette" />
        <div className="mist-layer" />
        <div className="light-leak" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_0.75fr] lg:items-center">
          <Reveal>
            <SectionHeading
              light
              kicker={localizedField(hero, "eyebrow", locale) || t("contactKicker")}
              title={localizedField(hero, "title", locale) || t("title")}
              copy={localizedField(hero, "copy", locale) || t("intro")}
            />
            <div className="mt-9 grid gap-4 text-sm text-white/72 sm:grid-cols-2">
              <a className="flex items-center gap-3 transition hover:text-white" href={`tel:${siteConfig.phone}`}>
                <Phone className="h-5 w-5 text-ember" aria-hidden="true" />
                {siteConfig.phone}
              </a>
              <a className="flex items-center gap-3 transition hover:text-white" href={`mailto:${siteConfig.email}`}>
                <Mail className="h-5 w-5 text-ember" aria-hidden="true" />
                {siteConfig.email}
              </a>
              <a className="flex items-center gap-3 transition hover:text-white" href={siteConfig.facebook}>
                <Facebook className="h-5 w-5 text-ember" aria-hidden="true" />
                Facebook
              </a>
              <a className="flex items-center gap-3 transition hover:text-white" href={`https://zalo.me/${siteConfig.zalo.replace(/\D/g, "")}`}>
                <MessageCircle className="h-5 w-5 text-ember" aria-hidden="true" />
                Zalo
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
        <div className="film-strip relative z-10 mx-auto mt-12 grid max-w-7xl grid-cols-3 gap-2 opacity-90 sm:gap-3 lg:grid-cols-6">
          {filmImages.map(
            (image, index) => (
              <Reveal delay={index * 0.035} key={image}>
                <div className="cinematic-float-delayed relative aspect-[4/3] overflow-hidden rounded-sm border border-white/16 bg-white/8 shadow-warm">
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 16vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/58 to-transparent" />
                </div>
              </Reveal>
            )
          )}
        </div>
      </section>

      <section className="bg-parchment-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-md shadow-cinematic">
          <iframe
            title={localizedField(map, "title", locale) || t("mapIframeTitle")}
            src={(map?.settings?.src as string | undefined) ?? "https://www.google.com/maps?q=Son%20La%20Vietnam&output=embed"}
            className="h-[260px] w-full border-0 sm:h-[340px] lg:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
