import Image from "next/image";
import {Reveal} from "@/components/motion/reveal";
import {imageLibrary} from "@/lib/content";
import {Flame, Clock, Droplets} from "lucide-react";
import type {Locale} from "@/i18n/routing";

export function generateMetadata({params: {locale}}: {params: {locale: Locale}}) {
  return {
    title: locale === "vi" ? "Triết lý rang · Wecacha" : "Roasting Philosophy · Wecacha",
    description: locale === "vi" ? "Khám phá nghệ thuật rang cà phê đặc sản tại Sơn La." : "Discover the art of specialty coffee roasting in Son La."
  };
}

export default function PhilosophyPage({params: {locale}}: {params: {locale: Locale}}) {
  const isVi = locale === "vi";

  return (
    <main className="bg-forest-950 text-parchment-50">
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageLibrary.coffeeRoast}
            alt="Coffee Roasting"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-forest-950/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center mt-20">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-ember">
              {isVi ? "Sự chuyển hóa của nhiệt" : "The Transformation of Heat"}
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl">
              {isVi ? "Triết Lý Rang" : "Roasting Philosophy"}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 className="font-serif text-3xl sm:text-5xl">
                {isVi ? "Tôn trọng nguyên bản, khơi dậy tiềm năng" : "Respect the origin, awaken the potential"}
              </h2>
              <div className="mt-8 space-y-6 text-lg text-white/70">
                <p>
                  {isVi 
                    ? "Tại Wecacha, chúng tôi không xem rang cà phê là việc 'nấu chín' hạt. Rang là một cuộc đối thoại với những hạt cà phê nhân xanh, lắng nghe cấu trúc tế bào của chúng và quyết định thời điểm hoàn hảo để dừng lại."
                    : "At Wecacha, we don't see roasting as 'cooking' the beans. Roasting is a dialogue with the green coffee beans, listening to their cellular structure and deciding the perfect moment to stop."}
                </p>
                <p>
                  {isVi
                    ? "Chúng tôi áp dụng triết lý rang chậm (Slow Roast). Việc kéo dài thời gian phát triển hương vị giúp làm nổi bật vị ngọt tự nhiên, giảm bớt độ chua gắt, và lưu giữ trọn vẹn những nốt hương hoa quả tinh tế của vùng đất Sơn La."
                    : "We apply the Slow Roast philosophy. Extending the flavor development time highlights natural sweetness, reduces harsh acidity, and fully preserves the delicate fruity notes of the Son La terroir."}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur">
                  <Flame className="h-8 w-8 text-ember mb-4" />
                  <h3 className="font-serif text-xl mb-2">{isVi ? "Kiểm soát nhiệt" : "Heat Control"}</h3>
                  <p className="text-sm text-white/60">{isVi ? "Profile rang được thiết kế riêng cho từng mẻ thu hoạch." : "Roast profile tailored for each harvest batch."}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur">
                  <Clock className="h-8 w-8 text-ember mb-4" />
                  <h3 className="font-serif text-xl mb-2">{isVi ? "Thời gian" : "Time"}</h3>
                  <p className="text-sm text-white/60">{isVi ? "Phát triển đủ lâu để caramel hóa trọn vẹn lượng đường tự nhiên." : "Developed long enough to fully caramelize natural sugars."}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur sm:col-span-2">
                  <Droplets className="h-8 w-8 text-ember mb-4" />
                  <h3 className="font-serif text-xl mb-2">{isVi ? "Làm nguội nhanh" : "Rapid Cooling"}</h3>
                  <p className="text-sm text-white/60">{isVi ? "Khóa chặt hương thơm ngay tại thời điểm hạt đạt độ chín hoàn hảo nhất." : "Locking in the aroma exactly when the beans reach perfect maturity."}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
