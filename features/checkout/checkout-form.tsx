"use client";

import {useState, useEffect} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {CheckCircle2, User, Phone, MapPin, Map, FileText, ShoppingBag, Truck, ShieldCheck, Headset, ChevronDown, Loader2, Minus, Plus, Trash2, AlertCircle} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useSearchParams} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {getCartTotals, useCartStore, type CartItem} from "@/features/cart/cart-store";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {formatCurrency} from "@/lib/content";
import Image from "next/image";

type Province = {code: number; name: string};
type Ward = {code: number; name: string};

const checkoutSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  address: z.string().min(6),
  city: z.string().min(2),
  ward: z.string().min(2),
  note: z.string().optional()
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Checkout");
  const common = useTranslations("Common");
  const searchParams = useSearchParams();
  const cartItems = useCartStore((state) => state.items);
  const buyNowItem = useCartStore((state) => state.buyNowItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateBuyNowQuantity = useCartStore((state) => state.updateBuyNowQuantity);
  const clearBuyNow = useCartStore((state) => state.clearBuyNow);
  const [success, setSuccess] = useState(false);
  const [minQtyWarning, setMinQtyWarning] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);

  // Buy Now mode: chỉ thanh toán đúng 1 sản phẩm, không liên quan giỏ hàng
  const isBuyNow = searchParams.get("mode") === "buynow" && Boolean(buyNowItem);
  const items = isBuyNow && buyNowItem ? [buyNowItem] : cartItems;
  const totals = getCartTotals(items);

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting}
  } = useForm<CheckoutValues>({resolver: zodResolver(checkoutSchema)});

  const errorText = t("fieldError");

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v2/?depth=1")
      .then((r) => r.json())
      .then((data: Province[]) => setProvinces(data))
      .catch(() => {})
      .finally(() => setLoadingProvinces(false));
  }, []);

  useEffect(() => {
    if (!minQtyWarning) return;
    const id = setTimeout(() => setMinQtyWarning(false), 2800);
    return () => clearTimeout(id);
  }, [minQtyWarning]);

  function handleDecrease(item: CartItem) {
    if (item.quantity <= 1) {
      setMinQtyWarning(true);
      return;
    }
    if (isBuyNow) {
      updateBuyNowQuantity(item.quantity - 1);
    } else {
      updateQuantity(item.slug, item.quantity - 1);
    }
  }

  async function handleProvinceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value;
    const name = provinces.find((p) => String(p.code) === code)?.name ?? "";
    setValue("city", name);
    setValue("ward", "");
    setWards([]);
    if (!code) return;
    setLoadingWards(true);
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/v2/p/${code}?depth=2`);
      const data = await res.json();
      setWards(data.wards ?? []);
    } catch {}
    setLoadingWards(false);
  }

  function onSubmit() {
    setSuccess(true);
    if (isBuyNow) {
      clearBuyNow();
    } else {
      clearCart();
    }
  }

  if (success) {
    return (
      <div className="rounded-[2rem] border border-[#142918]/10 bg-white p-12 text-center shadow-[0_20px_50px_rgba(20,41,24,0.05)]">
        <CheckCircle2 className="mx-auto h-16 w-16 text-[#2a5a31]" aria-hidden="true" />
        <h2 className="mt-6 font-serif text-4xl text-[#142918]">{t("success")}</h2>
        <Button asChild className="mt-8 bg-[#142918] text-white hover:bg-[#2a5a31] rounded-xl px-8 py-6" variant="default">
          <Link href="/">{common("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:gap-16 lg:grid-cols-[1fr_400px] items-start">
      {/* Left Column: Form */}
      <div className="rounded-[1.5rem] bg-white p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col border border-[#e5e0d8]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#f4f2ea] flex items-center justify-center text-[#b5703a]">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl text-[#142918]">{t("details")}</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Họ tên */}
            <Field label={t("fullName")} required error={errors.fullName && errorText}>
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <Input placeholder={t("fullNamePlaceholder")} className="pl-11 h-12 rounded-xl border-[#e5e0d8] bg-white focus-visible:ring-[#1a3020] text-[14px]" {...register("fullName")} />
            </Field>

            {/* Số điện thoại */}
            <Field label={t("phone")} required error={errors.phone && errorText}>
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <Input placeholder={t("phonePlaceholder")} className="pl-11 h-12 rounded-xl border-[#e5e0d8] bg-white focus-visible:ring-[#1a3020] text-[14px]" {...register("phone")} />
            </Field>

            {/* Tỉnh / Thành phố */}
            <Field label={t("city")} required error={errors.city && errorText}>
              <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              {loadingProvinces
                ? <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                : <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              }
              <select
                className="w-full appearance-none pl-11 pr-10 h-12 rounded-xl border border-[#e5e0d8] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3020] text-[14px] text-[#142918] cursor-pointer disabled:opacity-50"
                disabled={loadingProvinces}
                defaultValue=""
                onChange={handleProvinceChange}
              >
                <option value="">{t("cityPlaceholder")}</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
            </Field>

            {/* Xã / Phường */}
            <Field label={t("ward")} required error={errors.ward && errorText}>
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              {loadingWards
                ? <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                : <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              }
              <select
                className="w-full appearance-none pl-11 pr-10 h-12 rounded-xl border border-[#e5e0d8] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3020] text-[14px] text-[#142918] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={wards.length === 0 || loadingWards}
                defaultValue=""
                {...register("ward")}
              >
                <option value="">{t("wardPlaceholder")}</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.name}>{w.name}</option>
                ))}
              </select>
            </Field>

            {/* Địa chỉ cụ thể */}
            <Field label={t("address")} required error={errors.address && errorText} className="sm:col-span-2">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <Input placeholder={t("addressPlaceholder")} className="pl-11 h-12 rounded-xl border-[#e5e0d8] bg-white focus-visible:ring-[#1a3020] text-[14px]" {...register("address")} />
            </Field>

            {/* Ghi chú */}
            <Field className="sm:col-span-2" label={t("noteOptional")} error={errors.note && errorText}>
              <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <Textarea placeholder={t("notePlaceholder")} className="pl-11 pt-4 min-h-[120px] rounded-xl border-[#e5e0d8] bg-white focus-visible:ring-[#1a3020] resize-none text-[14px]" {...register("note")} />
            </Field>
          </div>

          <Button className="mt-10 bg-[#1a3020] hover:bg-[#142918] text-white rounded-xl h-14 px-8 font-medium transition-all shadow-md hover:-translate-y-0.5 w-fit" disabled={isSubmitting}>
            <ShoppingBag className="w-4 h-4 mr-2" /> {t("placeOrder")}
          </Button>
        </form>

        <div className="mt-12 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-gray-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-[#142918] uppercase">{t("deliveryPerk")}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{t("deliveryPerkSub")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-[#142918] uppercase">{t("securityPerk")}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{t("securityPerkSub")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headset className="w-5 h-5 text-gray-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-[#142918] uppercase">{t("supportPerk")}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{t("supportPerkSub")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <aside className="h-fit rounded-[1.5rem] bg-[#1a3020] p-8 text-white shadow-[0_20px_50px_rgba(20,41,24,0.1)] relative overflow-hidden">
        <div className="flex items-center justify-between mb-10 relative z-10">
          <h2 className="font-serif text-3xl">{t("orderSummary")}</h2>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="space-y-6 relative z-10">
          {items.length === 0 ? (
            <p className="text-white/60 py-4">{common("emptyCart")}</p>
          ) : (
            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div className="flex items-start gap-4 w-full" key={item.slug}>
                  <div className="relative w-14 h-14 rounded-[0.6rem] overflow-hidden bg-white/10 shrink-0 border border-white/5">
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-[13px] font-medium text-white leading-snug">{item.name}</h4>
                      <span className="font-medium text-[13px] whitespace-nowrap shrink-0">{formatCurrency(item.price * item.quantity, locale)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-lg border border-white/15 bg-white/5">
                        <button
                          type="button"
                          onClick={() => handleDecrease(item)}
                          className="flex h-7 w-7 items-center justify-center text-white/70 transition-colors hover:text-white"
                          aria-label={common("decreaseQty")}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-7 text-center text-[13px] font-semibold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            isBuyNow
                              ? updateBuyNowQuantity(item.quantity + 1)
                              : updateQuantity(item.slug, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center text-white/70 transition-colors hover:text-white"
                          aria-label={common("increaseQty")}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {!isBuyNow && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.slug)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-red-300"
                          aria-label={common("removeItem")}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="pt-6 border-t border-dashed border-white/10 space-y-5">
            <div className="flex justify-between text-[13px] text-white/80">
              <span>{common("subtotal")}</span>
              <span>{formatCurrency(totals.subtotal, locale)}</span>
            </div>
            <div className="flex justify-between text-[13px] text-white/80">
              <span>{t("shippingFee")}</span>
              <span>{formatCurrency(totals.shipping, locale)}</span>
            </div>
            <div className="pt-5 border-t border-dashed border-white/10 flex justify-between items-center">
              <span className="text-base text-[#b5703a] font-semibold">{common("total")}</span>
              <span className="text-xl text-[#b5703a] font-bold">{formatCurrency(totals.total, locale)}</span>
            </div>
          </div>
        </div>
        <div className="mt-8 rounded-[0.8rem] bg-[#eef4ea] p-4 flex gap-3 relative z-10 border border-[#e5f0df]">
          <ShieldCheck className="w-5 h-5 text-[#2a5a31] shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-[#142918]">{t("codLabel")}</p>
            <p className="text-[11px] text-[#142918]/60 mt-1">{t("codSubtext")}</p>
          </div>
        </div>
      </aside>

      {/* Min quantity warning toast */}
      {minQtyWarning && (
        <div className="fixed inset-x-0 top-24 z-[9999] flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#b5703a]/20 bg-white px-5 py-3.5 shadow-[0_12px_40px_rgba(20,41,24,0.18)] animate-[slide-in-right_0.3s_ease-out]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b5703a]/10 text-[#b5703a]">
              <AlertCircle className="h-5 w-5" />
            </div>
            <p className="text-[14px] font-semibold text-[#142918]">{t("minQuantity")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({label, error, className, required, children}: {
  label: string;
  error?: string | false;
  className?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="text-[13px] font-semibold text-[#1a3020] mb-2.5 inline-block">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      <div className="relative">{children}</div>
      {error ? <p className="mt-1.5 text-[11px] text-red-500">{error}</p> : null}
    </div>
  );
}
