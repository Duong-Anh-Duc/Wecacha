import type {MetadataRoute} from "next";
import {routing} from "@/i18n/routing";
import {exploreCards, products} from "@/lib/content";
import {siteUrl} from "@/lib/site";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const staticRoutes: {path: string; priority: number; freq: ChangeFrequency}[] = [
  {path: "",                    priority: 1.0, freq: "weekly"},
  {path: "/shop",               priority: 0.9, freq: "weekly"},
  {path: "/explore",            priority: 0.8, freq: "monthly"},
  {path: "/news",               priority: 0.8, freq: "weekly"},
  {path: "/about",              priority: 0.7, freq: "monthly"},
  {path: "/about/story",        priority: 0.6, freq: "monthly"},
  {path: "/about/farmers",      priority: 0.6, freq: "monthly"},
  {path: "/about/philosophy",   priority: 0.6, freq: "monthly"},
  {path: "/contact",            priority: 0.7, freq: "monthly"}
];

const newsCategories = ["coffee-culture", "events", "recipes"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = routing.locales.flatMap((locale) =>
    staticRoutes.map(({path, priority, freq}) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: freq,
      priority
    }))
  );

  const productPages = routing.locales.flatMap((locale) =>
    products.map((product) => ({
      url: `${siteUrl}/${locale}/shop/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.8
    }))
  );

  const explorePages = routing.locales.flatMap((locale) =>
    exploreCards.map((card) => ({
      url: `${siteUrl}/${locale}/explore/${card.id}`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6
    }))
  );

  const newsPages = routing.locales.flatMap((locale) =>
    newsCategories.map((slug) => ({
      url: `${siteUrl}/${locale}/news/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.7
    }))
  );

  return [...staticPages, ...productPages, ...explorePages, ...newsPages];
}
