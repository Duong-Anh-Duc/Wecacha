import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content";
import {formatCurrency, localized} from "@/lib/content";
import {siteConfig, siteUrl} from "@/lib/site";

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
