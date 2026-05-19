"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { imageLibrary } from "@/lib/content";
import { submitExperienceForm } from "@/actions/register-experience";

export function ExperienceForm() {
  const t = useTranslations("ExperienceForm");
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  if (pathname.includes("/contact")) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string || "",
      note: formData.get("note") as string || "",
    };

    startTransition(async () => {
      setStatus("idle");
      const result = await submitExperienceForm(data);
      if (result.success) {
        setStatus("success");
        // Tự động reset trạng thái sau 3 giây
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        alert(t("formError") + result.error);
      }
    });
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden py-24 sm:py-32">
       <div className="absolute inset-0 z-0">
         <Image
           src={imageLibrary.coffeeSet}
           alt="Coffee tasting"
           fill
           className="object-cover"
         />
         <div className="absolute inset-0 bg-forest-950/80" />
         <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent" />
       </div>

       <div className="relative z-10 w-full px-4 text-center sm:px-6">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-forest-950/40 p-8 shadow-cinematic backdrop-blur-xl sm:p-12 text-left"
         >
           <div className="text-center">
             <h2 className="font-serif text-4xl sm:text-5xl text-parchment-50">
               {t("title")}
             </h2>
             <p className="mt-4 text-lg text-white/70">
               {t("copy")}
             </p>
           </div>

           <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
               <div>
                 <label htmlFor="exp-name" className="mb-2 block text-sm font-semibold text-white/90">
                   {t("name")} <span className="text-red-500">*</span>
                 </label>
                 <input
                   id="exp-name"
                   name="name"
                   required
                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 backdrop-blur focus:border-ember focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ember/30 transition"
                   placeholder={t("namePlaceholder")}
                 />
               </div>
               <div>
                 <label htmlFor="exp-phone" className="mb-2 block text-sm font-semibold text-white/90">
                   {t("phone")} <span className="text-red-500">*</span>
                 </label>
                 <input
                   id="exp-phone"
                   name="phone"
                   required
                   type="tel"
                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 backdrop-blur focus:border-ember focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ember/30 transition"
                   placeholder={t("phonePlaceholder")}
                 />
               </div>
             </div>
             <div>
               <label htmlFor="exp-address" className="mb-2 block text-sm font-semibold text-white/90">
                 {t("address")}
               </label>
               <input
                 id="exp-address"
                 name="address"
                 className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 backdrop-blur focus:border-ember focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ember/30 transition"
                 placeholder={t("addressPlaceholder")}
               />
             </div>
             <div>
               <label htmlFor="exp-note" className="mb-2 block text-sm font-semibold text-white/90">
                 {t("note")}
               </label>
               <textarea
                 id="exp-note"
                 name="note"
                 rows={3}
                 className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 backdrop-blur focus:border-ember focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ember/30 transition"
                 placeholder={t("notePlaceholder")}
               />
             </div>
             <Button
               type="submit"
               variant="forest"
               disabled={isPending}
               className="mt-2 h-14 w-full rounded-xl text-base font-bold shadow-warm transition-transform hover:-translate-y-0.5 hover:shadow-cinematic disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {isPending ? t("loading") : status === "success" ? t("success") : t("submit")}
             </Button>
           </form>
         </motion.div>
       </div>
    </section>
  );
}
