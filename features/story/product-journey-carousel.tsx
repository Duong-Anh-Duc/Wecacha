"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Coffee,
  Leaf,
  Play
} from "lucide-react";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {exploreCards, imageLibrary, localized, products} from "@/lib/content";

const storyCopy = {
  vi: {
    kicker: "Câu chuyện",
    title: "Về Wecacha: Hành trình từ nương mây đến tách cà phê",
    body:
      "Khám phá nguồn gốc, triết lý rang và những con người đứng sau từng hạt cà phê Sơn La đặc sản. Câu chuyện về sự kiên định và đam mê.",
    video: "Xem hành trình của hạt cà phê",
    discover: "Khám phá",
    news: "Tin tức",
    read: "Đọc thêm",
    cards: [
      {
        title: "Vùng trồng nguyên liệu",
        body: "Từ độ cao, sương núi và đất đỏ làm nên vị ngọt sâu.",
        href: "/explore/farm"
      },
      {
        title: "Phương pháp sơ chế",
        body: "Khắt khe trong từng mẻ phơi, đảo và ghi chép mùa vụ.",
        href: "/explore/processing"
      },
      {
        title: "Văn hóa bản địa",
        body: "Cà phê không tách khỏi bản làng, bếp lửa và thổ cẩm.",
        href: "/explore/culture"
      }
    ],
    newsCards: [
      {
        title: "Văn hóa cà phê",
        body: "Khám phá chiều sâu của hạt cà phê qua lăng kính lịch sử và nhịp sống hiện đại.",
        icon: "coffee",
        href: "/news"
      },
      {
        title: "Sự kiện & Hoạt động",
        body: "Đồng hành cùng Wecacha trong các sự kiện ra mắt, workshop và hành trình về bản.",
        icon: "calendar",
        href: "/news"
      },
      {
        title: "Công thức pha chế",
        body: "Bí quyết để tự tay pha một tách cà phê thơm ngon, chuẩn vị chuyên gia.",
        icon: "coffee",
        href: "/news"
      }
    ]
  },
  en: {
    kicker: "Story",
    title: "About Wecacha: From cloud farms to the coffee cup",
    body:
      "Explore the origin, roast philosophy and people behind every bag of specialty coffee from Son La.",
    video: "Watch the coffee bean journey",
    discover: "Explore",
    news: "News",
    read: "Read more",
    cards: [
      {
        title: "Growing regions",
        body: "Altitude, mountain mist and red soil create deep sweetness.",
        href: "/explore/farm"
      },
      {
        title: "Processing methods",
        body: "Precise drying, turning and harvest notes shape every batch.",
        href: "/explore/processing"
      },
      {
        title: "Local culture",
        body: "Coffee stays close to village life, firelight and brocade.",
        href: "/explore/culture"
      }
    ],
    newsCards: [
      {
        title: "Coffee culture",
        body: "Discover coffee through history, place and modern daily rituals.",
        icon: "coffee",
        href: "/news"
      },
      {
        title: "Events & Activities",
        body: "Join Wecacha launches, workshops and journeys back to the village.",
        icon: "calendar",
        href: "/news"
      },
      {
        title: "Brew recipes",
        body: "Practical recipes for a fragrant, balanced cup at home.",
        icon: "coffee",
        href: "/news"
      }
    ]
  }
};

const cardImages = [
  products[0]?.images[0] ?? "/sp1.jpeg",
  imageLibrary.cup,
  imageLibrary.village
];

export function ProductJourneyCarousel({locale}: {locale: Locale}) {
  const copy = storyCopy[locale];
  const featuredExplore = copy.cards.map((card, index) => ({
    ...card,
    image: cardImages[index],
    fallback: exploreCards[index]
  }));

  return (
    <section className="relative overflow-hidden bg-[oklch(97%_0.012_92)] text-forest-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-forest-950" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(6,31,7,0.24) 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-20 hidden h-[420px] w-[420px] rounded-full border border-forest-950/10 lg:block" />

      <div className="relative mx-auto grid max-w-[1720px] gap-5 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(390px,0.68fr)] lg:px-8 lg:pb-0">
        <article className="relative min-h-[640px] overflow-hidden rounded-[28px] bg-forest-950 text-parchment-50 shadow-cinematic sm:rounded-[34px] lg:min-h-[760px]">
          <Image
            src={imageLibrary.hero}
            alt=""
            fill
            priority
            className="scale-110 object-cover"
            sizes="(min-width: 1024px) 66vw, 100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,31,7,0.88)_0%,rgba(6,31,7,0.64)_42%,rgba(6,31,7,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,31,7,0.76),transparent_48%)]" />

          <div className="relative z-10 flex min-h-[640px] max-w-5xl flex-col justify-between px-6 py-10 sm:px-12 sm:py-14 lg:min-h-[760px] lg:px-20 lg:py-20">
            <div>
              <span className="inline-flex rounded-full bg-earth-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-parchment-50 shadow-warm">
                {copy.kicker}
              </span>
              <h2 className="mt-10 max-w-4xl font-serif text-[clamp(3rem,7vw,6.9rem)] leading-[0.95] text-parchment-50">
                {copy.title}
              </h2>
              <p className="mt-7 max-w-[620px] text-base font-semibold leading-8 text-parchment-50/82 sm:text-xl">
                {copy.body}
              </p>
            </div>

            <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/explore"
                className="group inline-flex w-fit items-center gap-4 text-sm font-black text-parchment-50 sm:text-base"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-parchment-50 text-forest-950 transition duration-300 group-hover:scale-105">
                  <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                </span>
                {copy.video}
              </Link>

              <div className="relative hidden h-36 w-36 place-items-center rounded-full border border-parchment-50/22 text-parchment-50/70 lg:grid">
                <div className="absolute inset-4 rounded-full border border-parchment-50/12" />
                <Leaf className="h-12 w-12" aria-hidden="true" />
                <span className="absolute inset-0 animate-spin rounded-full [animation-duration:28s]">
                  <span className="absolute left-1/2 top-1 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.28em]">
                    Wecacha Coffee
                  </span>
                </span>
              </div>
            </div>
          </div>
        </article>

        <aside className="grid gap-5 lg:py-3">
          {featuredExplore.map((card, index) => (
            <Link
              key={card.title}
              href={card.href}
              className="group grid min-h-[190px] overflow-hidden rounded-[26px] bg-[oklch(99%_0.006_92)] p-3 shadow-[0_18px_55px_rgba(6,31,7,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(6,31,7,0.16)] sm:grid-cols-[1.12fr_0.78fr] lg:min-h-[220px]"
            >
              <div className="relative min-h-[180px] overflow-hidden rounded-[18px]">
                <Image
                  src={card.image}
                  alt={localized(card.fallback.title, locale)}
                  fill
                  className="object-cover transition duration-[1200ms] group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
              </div>
              <div className="flex min-w-0 items-center justify-between gap-4 p-5 sm:p-7">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-earth-600">
                    {copy.discover}
                  </p>
                  <h3 className="mt-3 max-w-[10rem] font-serif text-3xl leading-[1.02] text-forest-950 sm:text-4xl">
                    {card.title}
                  </h3>
                  <p className="mt-4 line-clamp-2 text-base font-semibold leading-7 text-forest-950/56">
                    {card.body}
                  </p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest-950 text-parchment-50 transition duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </aside>
      </div>

      <div className="relative -mt-6 bg-forest-950 px-4 py-24 text-forest-950 sm:px-6 lg:-mt-8 lg:px-8 lg:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src="/image3.jpeg"
            alt=""
            fill
            className="object-cover opacity-28"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-forest-950/76" />
          <Image
            src="/explore_latte.png"
            alt=""
            width={280}
            height={280}
            className="absolute -left-16 top-28 hidden opacity-95 drop-shadow-2xl lg:block"
          />
          <Image
            src="/explore_v60.png"
            alt=""
            width={380}
            height={380}
            className="absolute bottom-10 right-10 hidden opacity-82 drop-shadow-2xl lg:block"
          />
        </div>

        <div className="relative mx-auto grid max-w-[1720px] overflow-hidden rounded-[28px] bg-[oklch(98.5%_0.01_92)] shadow-cinematic sm:rounded-[34px] lg:grid-cols-3">
          {copy.newsCards.map((item, index) => {
            const Icon = item.icon === "calendar" ? CalendarDays : Coffee;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative min-h-[310px] px-8 py-12 transition duration-300 hover:bg-forest-950/[0.035] sm:px-12 lg:min-h-[430px] lg:px-20 lg:py-20"
              >
                {index > 0 ? (
                  <span className="absolute inset-y-16 left-0 hidden w-px bg-forest-950/10 lg:block" />
                ) : null}
                <span className="grid h-14 w-14 place-items-center rounded-full bg-forest-950 text-parchment-50 shadow-warm">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-9 text-xs font-black uppercase tracking-[0.18em] text-earth-600">
                  {copy.news}
                </p>
                <h3 className="mt-5 max-w-sm font-serif text-3xl leading-tight text-forest-950 sm:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-sm text-base font-semibold leading-8 text-forest-950/58">
                  {item.body}
                </p>
                <span className="absolute bottom-10 left-8 inline-flex items-center gap-4 text-base font-black text-forest-950 sm:left-12 lg:bottom-20 lg:left-20">
                  {copy.read}
                  <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
