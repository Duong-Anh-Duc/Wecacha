"use client";

import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {Send} from "lucide-react";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  message: z.string().min(10)
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const t = useTranslations("Contact");
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: ""
    }
  });

  const errorText = t("fieldError");

  function onSubmit() {
    setSent(true);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md border border-white/14 bg-white/10 p-5 text-white shadow-cinematic backdrop-blur-md sm:p-7"
    >
      <div className="grid gap-5">
        <div>
          <Label className="text-white" htmlFor="name">
            {t("name")}
          </Label>
          <Input
            id="name"
            className="mt-2 border-white/14 bg-white/86 text-forest-950"
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-2 text-xs text-ember">{errorText}</p>
          ) : null}
        </div>
        <div>
          <Label className="text-white" htmlFor="phone">
            {t("phone")}
          </Label>
          <Input
            id="phone"
            type="tel"
            className="mt-2 border-white/14 bg-white/86 text-forest-950"
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="mt-2 text-xs text-ember">{errorText}</p>
          ) : null}
        </div>
        <div>
          <Label className="text-white" htmlFor="message">
            {t("message")}
          </Label>
          <Textarea
            id="message"
            className="mt-2 border-white/14 bg-white/86 text-forest-950"
            {...register("message")}
          />
          {errors.message ? (
            <p className="mt-2 text-xs text-ember">{errorText}</p>
          ) : null}
        </div>
      </div>
      <Button className="mt-6 w-full" disabled={isSubmitting}>
        <Send className="h-4 w-4" aria-hidden="true" />
        {t("send")}
      </Button>
      {sent ? <p className="mt-4 text-sm text-parchment-100">{t("success")}</p> : null}
    </form>
  );
}
