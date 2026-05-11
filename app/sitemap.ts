import type {MetadataRoute} from "next";
import {routing} from "@/i18n/routing";
import {products} from "@/lib/content";
import {siteUrl} from "@/lib/site";

const staticRoutes = ["", "/story", "/shop", "/explore", "/contact"];
type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = routing.locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: now,
      changeFrequency: (route === "" ? "weekly" : "monthly") as ChangeFrequency,
      priority: route === "" ? 1 : 0.8
    }))
  );

  const productPages = routing.locales.flatMap((locale) =>
    products.map((product) => ({
      url: `${siteUrl}/${locale}/shop/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.7
    }))
  );

  return [...pages, ...productPages];
}
