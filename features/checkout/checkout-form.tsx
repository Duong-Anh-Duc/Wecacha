"use client";

import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {CheckCircle2} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {getCartTotals, useCartStore} from "@/features/cart/cart-store";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {formatCurrency} from "@/lib/content";

const checkoutSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  address: z.string().min(6),
  city: z.string().min(2),
  note: z.string().optional()
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Checkout");
  const common = useTranslations("Common");
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [success, setSuccess] = useState(false);
  const totals = getCartTotals(items);
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema)
  });
  const errorText = t("fieldError");

  function onSubmit() {
    setSuccess(true);
    clearCart();
  }

  if (success) {
    return (
      <div className="rounded-md border border-forest-950/10 bg-parchment-100 p-10 text-center shadow-warm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-earth-600" aria-hidden="true" />
        <h2 className="mt-4 font-serif text-4xl text-forest-950">
          {t("success")}
        </h2>
        <Button asChild className="mt-6" variant="forest">
          <Link href="/shop">{common("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md border border-forest-950/10 bg-parchment-100 p-6 shadow-warm"
      >
        <h2 className="font-serif text-4xl text-forest-950">{t("details")}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label={t("fullName")} error={errors.fullName && errorText}>
            <Input {...register("fullName")} />
          </Field>
          <Field label={t("phone")} error={errors.phone && errorText}>
            <Input {...register("phone")} />
          </Field>
          <Field label={t("address")} error={errors.address && errorText}>
            <Input {...register("address")} />
          </Field>
          <Field label={t("city")} error={errors.city && errorText}>
            <Input {...register("city")} />
          </Field>
          <Field
            className="sm:col-span-2"
            label={t("note")}
            error={errors.note && errorText}
          >
            <Textarea {...register("note")} />
          </Field>
        </div>
        <Button className="mt-7 w-full sm:w-auto" disabled={isSubmitting}>
          {t("placeOrder")}
        </Button>
      </form>

      <aside className="h-fit rounded-md border border-forest-950/10 bg-forest-950 p-6 text-white shadow-cinematic">
        <h2 className="font-serif text-4xl">{common("total")}</h2>
        <div className="mt-6 space-y-4 text-sm text-white/68">
          {items.length === 0 ? (
            <p>{common("emptyCart")}</p>
          ) : (
            items.map((item) => (
              <div className="flex justify-between gap-4" key={item.slug}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity, locale)}</span>
              </div>
            ))
          )}
          <div className="border-t border-white/14 pt-4 text-lg font-bold text-ember">
            <div className="flex justify-between">
              <span>{common("total")}</span>
              <span>{formatCurrency(totals.total, locale)}</span>
            </div>
          </div>
        </div>
        <p className="mt-5 rounded-md bg-white/8 p-4 text-sm text-white/64">
          {t("payment")}
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children
}: {
  label: string;
  error?: string | false;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-2 text-xs text-earth-700">{error}</p> : null}
    </div>
  );
}
