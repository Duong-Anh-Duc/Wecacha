import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content";
import {formatCurrency, localized} from "@/lib/content";
import {siteConfig, siteUrl} from "@/lib/site";

export function webSiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Sơn La Coffee",
    url: siteUrl,
    inLanguage: ["vi", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/${locale}/shop?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function breadcrumbJsonLd(items: {name: string; url: string}[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "CoffeeOrTeaShop",
    "@id": `${siteUrl}/#organization`,
    name: "Sơn La Coffee",
    url: siteUrl,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    priceRange: "₫₫",
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/wecacha-mark.svg`
    },
    image: `${siteUrl}/image.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address[locale],
      addressRegion: "Sơn La",
      addressCountry: "VN"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.coordinates.lat,
      longitude: siteConfig.coordinates.lng
    },
    sameAs: [siteConfig.facebook]
  };
}

export function newsArticleJsonLd({
  title,
  description,
  datePublished,
  image,
  url,
  locale
}: {
  title: string;
  description: string;
  datePublished: string;
  image: string;
  url: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    image: image.startsWith("http") ? image : `${siteUrl}${image}`,
    datePublished,
    dateModified: datePublished,
    inLanguage: locale === "vi" ? "vi-VN" : "en-US",
    author: {
      "@type": "Organization",
      name: "Sơn La Coffee",
      url: siteUrl
    },
    publisher: {
      "@type": "Organization",
      name: "Sơn La Coffee",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/wecacha-mark.svg`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    }
  };
}

export function productJsonLd(product: Product, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: localized(product.name, locale),
    image: product.images,
    description: localized(product.description, locale),
    brand: {
      "@type": "Brand",
      name: "Sơn La Coffee",
      url: siteUrl
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/${locale}/shop/${product.slug}`
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: locale === "vi" ? "Độ cao" : "Altitude",
        value: product.altitude
      },
      {
        "@type": "PropertyValue",
        name: locale === "vi" ? "Giá hiển thị" : "Display price",
        value: formatCurrency(product.price, locale)
      }
    ]
  };
}
