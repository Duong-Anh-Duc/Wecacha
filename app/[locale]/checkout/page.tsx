import type {Metadata} from "next";
import {Suspense} from "react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {ShieldCheck} from "lucide-react";
import {CheckoutForm} from "@/features/checkout/checkout-form";
import type {Locale} from "@/i18n/routing";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Checkout"});

  return {
    title: t("title"),
    robots: {index: false, follow: false},
    alternates: {
      canonical: `/${locale}/checkout`,
      languages: {
        vi: "/vi/checkout",
        en: "/en/checkout",
        "x-default": "/vi/checkout"
      }
    }
  };
}

export default async function CheckoutPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Checkout"});
  const tNav = await getTranslations({locale, namespace: "Nav"});

  return (
    <main className="bg-[radial-gradient(ellipse_at_center,_#fffdfa_0%,_#f2eadc_100%)] px-4 pb-24 pt-32 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden">
      
      {/* Sketched Leaves Background Decoration */}
      <div className="absolute left-[-10%] top-[30%] opacity-[0.15] pointer-events-none scale-150">
        <svg width="300" height="400" viewBox="0 0 100 100" fill="none">
          <path d="M 0 50 Q 50 20 80 80 Q 30 100 0 50" fill="#2a5a31" />
          <path d="M 10 40 Q 60 10 90 70 Q 40 90 10 40" fill="#2a5a31" opacity="0.6" />
        </svg>
      </div>
      <div className="absolute right-[-10%] bottom-[5%] opacity-[0.15] pointer-events-none rotate-[160deg] scale-150">
        <svg width="300" height="400" viewBox="0 0 100 100" fill="none">
          <path d="M 0 50 Q 50 20 80 80 Q 30 100 0 50" fill="#2a5a31" />
        </svg>
      </div>

      <div className="mx-auto max-w-[1200px] relative z-10">
        <Reveal>
          <div className="mb-10 pl-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b5703a] mb-5">
              <span className="cursor-pointer hover:underline">{tNav("home")}</span>
              <span className="text-[#142918]/30">&gt;</span>
              <span className="text-[#142918]/60">{tNav("checkout")}</span>
            </div>
            <h1 className="font-serif text-[3.5rem] md:text-[4.5rem] text-[#1a3020] mb-4 leading-none tracking-tight">
              {t("title")}
            </h1>
            <div className="flex items-center gap-2 text-[#1a3020]/70 text-[14px]">
              <ShieldCheck className="w-4 h-4 text-[#2a5a31]" />
              {t("securityNote")}
            </div>
          </div>
        </Reveal>
        
        <div className="mt-8">
          <Suspense fallback={null}>
            <CheckoutForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
