import {Facebook, Mail, MapPin, Mountain, Phone} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {siteConfig} from "@/lib/site";

export async function SiteFooter({locale}: {locale: Locale}) {
  const nav = await getTranslations({locale, namespace: "Nav"});
  const home = await getTranslations({locale, namespace: "Home"});
  const footer = await getTranslations({locale, namespace: "Footer"});

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(181,101,0,0.28),transparent_24rem)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8 lg:py-18">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-white/8">
              <Mountain className="h-5 w-5 text-ember" aria-hidden="true" />
            </span>
            <div>
              <p className="font-serif text-3xl">Sơn La Coffee</p>
              <p className="text-xs font-semibold uppercase text-white/56">
                {footer("tagline")}
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-lg font-serif text-3xl leading-tight text-parchment-100">
            {home("footerCta")}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-ember">{footer("pages")}</h2>
          <div className="mt-5 grid gap-3 text-sm text-white/68">
            <Link className="transition hover:text-white" href="/">
              {nav("home")}
            </Link>
            <Link className="transition hover:text-white" href="/story">
              {nav("story")}
            </Link>
            <Link className="transition hover:text-white" href="/shop">
              {nav("shop")}
            </Link>
            <Link className="transition hover:text-white" href="/explore">
              {nav("explore")}
            </Link>
            <Link className="transition hover:text-white" href="/contact">
              {nav("contact")}
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-ember">{footer("contactHeading")}</h2>
          <div className="mt-5 grid gap-4 text-sm text-white/68">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-ember" aria-hidden="true" />
              {siteConfig.address[locale]}
            </p>
            <a className="flex gap-3 transition hover:text-white" href={`tel:${siteConfig.phone}`}>
              <Phone className="mt-0.5 h-4 w-4 text-ember" aria-hidden="true" />
              {siteConfig.phone}
            </a>
            <a className="flex gap-3 transition hover:text-white" href={`mailto:${siteConfig.email}`}>
              <Mail className="mt-0.5 h-4 w-4 text-ember" aria-hidden="true" />
              {siteConfig.email}
            </a>
            <a className="flex gap-3 transition hover:text-white" href={siteConfig.facebook}>
              <Facebook className="mt-0.5 h-4 w-4 text-ember" aria-hidden="true" />
              Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 px-4 py-5 text-center text-xs text-white/48">
        {footer("copyright")}
      </div>
    </footer>
  );
}
