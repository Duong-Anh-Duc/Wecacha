import Link from "next/link";
import {Mountain} from "lucide-react";
import {getLocale, getTranslations} from "next-intl/server";
import {Button} from "@/components/ui/button";

export default async function LocaleNotFound() {
  const locale = await getLocale();
  const t = await getTranslations("NotFound");

  return (
    <main className="grid min-h-screen place-items-center bg-forest-950 px-4 text-center text-white">
      <div>
        <Mountain className="mx-auto h-12 w-12 text-ember" aria-hidden="true" />
        <h1 className="mt-6 font-serif text-6xl leading-none">404</h1>
        <p className="mt-4 max-w-md text-white/68">
          {t("title")}. {t("copy")}
        </p>
        <Button asChild className="mt-7">
          <Link href={`/${locale}`}>{t("home")}</Link>
        </Button>
      </div>
    </main>
  );
}
