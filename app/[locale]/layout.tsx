import type {Metadata, Viewport} from "next";
import {Be_Vietnam_Pro, Playfair_Display} from "next/font/google";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {FloatingContact} from "@/components/layout/floating-contact";
import {SiteFooter} from "@/components/layout/site-footer";
import {SiteHeader} from "@/components/layout/site-header";
import {SmoothScrollProvider} from "@/components/motion/smooth-scroll-provider";
import {JsonLd} from "@/components/seo/json-ld";
import {routing, type Locale} from "@/i18n/routing";
import {organizationJsonLd, webSiteJsonLd} from "@/lib/seo";
import {siteUrl} from "@/lib/site";
import "@/styles/globals.css";

const bodyFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

const serif = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"]
});

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export const viewport: Viewport = {
  themeColor: [
    {media: "(prefers-color-scheme: light)", color: "#fffaf0"},
    {media: "(prefers-color-scheme: dark)", color: "#061f07"}
  ],
  width: "device-width",
  initialScale: 1
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Metadata"});

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: `%s | Sơn La Coffee`
    },
    description: t("description"),
    keywords: t("keywords"),
    icons: {
      icon: [
        {
          url: "/favicon.ico",
          type: "image/x-icon",
          sizes: "256x256"
        },
        {
          url: "/wecacha-favicon.png",
          type: "image/png",
          sizes: "256x256"
        },
        {
          url: "/favicon.svg",
          type: "image/svg+xml"
        }
      ],
      shortcut: "/favicon.ico",
      apple: "/image.png"
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        vi: "/vi",
        en: "/en",
        "x-default": "/vi"
      }
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      siteName: "Sơn La Coffee",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      type: "website",
      images: [
        {
          url: `/og/home.jpg`,
          width: 1200,
          height: 630,
          alt: "Sơn La Coffee"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description")
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    }
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${serif.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <JsonLd data={organizationJsonLd(locale as Locale)} />
            <JsonLd data={webSiteJsonLd(locale as Locale)} />
            <SiteHeader />
            {children}
            <FloatingContact />
            <SiteFooter locale={locale as Locale} />
          </SmoothScrollProvider>
          <div className="film-grain" aria-hidden="true" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
