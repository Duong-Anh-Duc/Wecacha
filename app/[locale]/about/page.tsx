import Image from "next/image";
import {CheckCircle2, HeartHandshake, Leaf, ShieldCheck} from "lucide-react";
import {Reveal} from "@/components/motion/reveal";
import {SectionHeading} from "@/components/sections/section-heading";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";

export function generateMetadata({params: {locale}}: {params: {locale: Locale}}) {
  return {
    title: locale === "vi" ? "Giới thiệu · Wecacha Sơn La" : "About Us · Wecacha Son La",
    description: locale === "vi" ? "Câu chuyện thương hiệu, tầm nhìn và sứ mệnh của Wecacha Sơn La Coffee." : "Brand story, vision and mission of Wecacha Son La Coffee."
  };
}

export default function AboutPage({params: {locale}}: {params: {locale: Locale}}) {
  const isVi = locale === "vi";

  return (
    <main className="bg-parchment-50">
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageLibrary.mountains}
            alt="Sơn La Mountains"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-forest-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-parchment-50 via-forest-950/40 to-transparent" />
        </div>

        <div className="absolute top-28 left-4 sm:left-6 lg:left-8 z-20 xl:left-12">
          <Breadcrumbs 
            homeLabel={isVi ? "Trang chủ" : "Home"} 
            theme="dark"
            items={[{ label: isVi ? "Về Wecacha" : "About Us" }]} 
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 mt-20">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember mb-6">
              {isVi ? "Câu chuyện thương hiệu" : "Brand Story"}
            </p>
            <h1 className="font-serif text-5xl leading-[1.1] text-parchment-50 sm:text-7xl">
              {isVi ? "Trẻ Hoá Người Dùng Cà Phê Đặc Sản" : "Rejuvenating Specialty Coffee"}
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80">
              {isVi
                ? "Bắt đầu từ những nương đồi cà phê giữa mây ngàn Tây Bắc – nơi mỗi hạt Arabica Sơn La lưu giữ hương vị nguyên sơ của đất trời."
                : "Starting from the coffee hills amidst the clouds of Northwest Vietnam – where every Son La Arabica bean captures the pristine essence of nature."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. Brand Story Content */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-cinematic">
              <Image
                src={imageLibrary.farmer}
                alt="Coffee Farmer"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-forest-950/10" />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-4xl leading-tight text-forest-950 sm:text-5xl">
                {isVi ? "Sự giao hòa giữa thiên nhiên và cảm hứng sáng tạo" : "The harmony of nature and creative inspiration"}
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-forest-950/70">
                <p>
                  {isVi
                    ? "Giữa những triền núi phủ mây trắng của Tây Bắc, nơi những nương cà phê hàng chục năm tuổi vẫn lặng lẽ vươn mình trong sương sớm, cuộc sống của người đồng bào từ bao đời nay vẫn gắn liền với cây cà phê – món quà thiên nhiên ban tặng."
                    : "Amidst the cloud-covered slopes of the Northwest, where decades-old coffee farms quietly reach into the morning mist, the lives of indigenous people have long been intertwined with the coffee tree – a gift from nature."}
                </p>
                <p>
                  {isVi
                    ? "Wecacha ra đời như một cách kể mới về cà phê đặc sản, không chỉ giữ gìn hương vị nguyên bản mà còn mang nó vào những thức uống hiện đại, gần gũi với thế hệ hôm nay. Chúng tôi chọn Arabica Sơn La làm nền tảng, kết hợp cùng kỹ thuật rang xay hiện đại."
                    : "Wecacha was born as a new way to tell the story of specialty coffee, not only preserving its original flavor but also bringing it into modern, accessible drinks for today's generation. We chose Son La Arabica as our foundation, combined with modern roasting techniques."}
                </p>
                <p>
                  {isVi
                    ? "Mỗi ly cà phê bán ra là sự giao hòa giữa tinh thần thủ công và cảm hứng sáng tạo. Không chỉ là một thức uống, Wecacha là cách kể chuyện mới về cà phê Việt – bằng sự tử tế trong từng chi tiết nhỏ."
                    : "Every cup sold is a harmony between craftsmanship and creative inspiration. More than just a drink, Wecacha is a new storytelling of Vietnamese coffee – through kindness in every small detail."}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Vision & Mission (Dark Section) */}
      <section className="bg-forest-950 px-4 py-24 text-parchment-50 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Vision */}
            <Reveal>
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-earth-600/20 blur-2xl" />
                <h3 className="relative font-serif text-4xl text-white">
                  {isVi ? "Tầm nhìn" : "Vision"}
                </h3>
                <p className="mt-6 text-lg leading-8 text-white/70">
                  {isVi
                    ? "Wecacha hướng đến một tương lai nơi những đồi cà phê Tây Bắc vẫn tiếp tục xanh, và cuộc sống của người đồng bào được nâng đỡ từ chính giá trị mà cây cà phê mang lại. Bằng cách đưa hương vị Sơn La vào những ly đồ uống hiện đại, chúng tôi mong muốn di sản ấy không chỉ được nhắc nhớ, mà được sống tiếp."
                    : "Wecacha looks toward a future where the Northwest coffee hills remain green, and the lives of the indigenous people are uplifted by the very value the coffee tree provides. By bringing Son La's flavor into modern drinks, we hope this heritage is not just remembered, but lived."}
                </p>
              </div>
            </Reveal>

            {/* Mission */}
            <Reveal delay={0.2}>
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-ember/20 blur-2xl" />
                <h3 className="relative font-serif text-4xl text-white">
                  {isVi ? "Sứ mệnh" : "Mission"}
                </h3>
                <p className="mt-6 text-lg leading-8 text-white/70">
                  {isVi ? "Wecacha ra đời để gìn giữ, kết nối và lan tỏa." : "Wecacha was born to preserve, connect, and spread."}
                </p>
                <ul className="mt-6 space-y-4 text-base text-white/70">
                  <li className="flex gap-3">
                    <span className="text-ember">•</span>
                    <span>{isVi ? "Gìn giữ hương vị từng hạt cà phê – nguyên bản, tinh khiết và tiên phong cho những kết hợp mới." : "Preserve the flavor of every coffee bean – original, pure, and pioneering new combinations."}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-ember">•</span>
                    <span>{isVi ? "Kết nối người nông dân vùng cao với khách hàng khắp nơi thông qua mỗi ly cà phê đậm hương." : "Connect highland farmers with customers everywhere through every flavorful cup."}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-ember">•</span>
                    <span>{isVi ? "Lan tỏa văn hóa bản địa và tinh thần Tây Bắc – chân thật, mộc mạc nhưng đầy tự hào." : "Spread indigenous culture and the Northwest spirit – authentic, rustic, yet deeply proud."}</span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            kicker={isVi ? "Bản sắc" : "Identity"}
            title={isVi ? "Giá trị cốt lõi" : "Core Values"}
            align="center"
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={0.1}>
              <div className="group h-full rounded-2xl border border-forest-950/10 bg-white p-8 text-center shadow-warm transition duration-500 hover:-translate-y-2 hover:shadow-cinematic">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment-100 text-earth-700 transition group-hover:bg-earth-600 group-hover:text-white">
                  <HeartHandshake className="h-8 w-8" />
                </div>
                <h4 className="mt-6 font-serif text-2xl text-forest-950">
                  {isVi ? "Cộng đồng" : "Community"}
                </h4>
                <p className="mt-4 text-sm leading-6 text-forest-950/60">
                  {isVi
                    ? "Wecacha luôn hướng đến cuộc sống tốt đẹp hơn cho đồng bào các dân tộc thiểu số tại vùng trồng Sơn La."
                    : "Wecacha always aims for a better life for ethnic minorities in the Son La growing region."}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="group h-full rounded-2xl border border-forest-950/10 bg-white p-8 text-center shadow-warm transition duration-500 hover:-translate-y-2 hover:shadow-cinematic">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment-100 text-earth-700 transition group-hover:bg-earth-600 group-hover:text-white">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h4 className="mt-6 font-serif text-2xl text-forest-950">
                  {isVi ? "Minh bạch" : "Transparency"}
                </h4>
                <p className="mt-4 text-sm leading-6 text-forest-950/60">
                  {isVi
                    ? "Mọi hợp tác, thu mua và quy trình tiêu thụ đều được thực hiện rõ ràng, trung thực và có trách nhiệm."
                    : "All cooperation, purchasing, and consumption processes are conducted clearly, honestly, and responsibly."}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="group h-full rounded-2xl border border-forest-950/10 bg-white p-8 text-center shadow-warm transition duration-500 hover:-translate-y-2 hover:shadow-cinematic">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment-100 text-earth-700 transition group-hover:bg-earth-600 group-hover:text-white">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="mt-6 font-serif text-2xl text-forest-950">
                  {isVi ? "Tôn trọng" : "Respect"}
                </h4>
                <p className="mt-4 text-sm leading-6 text-forest-950/60">
                  {isVi
                    ? "Chúng tôi tôn trọng con người, văn hóa bản địa và thiên nhiên – nền tảng tạo nên bản sắc cà phê Sơn La."
                    : "We respect people, indigenous culture, and nature – the foundation of Son La coffee identity."}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="group h-full rounded-2xl border border-forest-950/10 bg-white p-8 text-center shadow-warm transition duration-500 hover:-translate-y-2 hover:shadow-cinematic">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment-100 text-earth-700 transition group-hover:bg-earth-600 group-hover:text-white">
                  <Leaf className="h-8 w-8" />
                </div>
                <h4 className="mt-6 font-serif text-2xl text-forest-950">
                  {isVi ? "Bảo tồn" : "Preservation"}
                </h4>
                <p className="mt-4 text-sm leading-6 text-forest-950/60">
                  {isVi
                    ? "Gìn giữ và phát triển di sản cà phê đặc sản, để hương vị nguyên bản được tiếp nối qua từng thế hệ."
                    : "Preserving and developing the specialty coffee heritage, so the original flavor is passed down through generations."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. CTA Footer Block */}
      <section className="relative flex min-h-[50vh] items-center justify-center py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageLibrary.brocade}
            alt="Brocade pattern"
            fill
            className="object-cover opacity-30 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-forest-950/90" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <h2 className="font-serif text-4xl text-parchment-50 sm:text-5xl">
              {isVi ? "Cùng Wecacha bước vào mùa vụ mới" : "Join Wecacha in the new harvest season"}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              {isVi 
                ? "Khám phá ngay các dòng sản phẩm cà phê được tuyển chọn tỉ mỉ từ những vùng trồng tốt nhất Sơn La."
                : "Explore our meticulously selected coffee products from the best growing regions in Son La."}
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex h-14 items-center justify-center rounded-full bg-earth-600 px-8 text-base font-bold text-white transition hover:bg-earth-700"
              >
                {isVi ? "Đến cửa hàng" : "Go to shop"}
              </Link>
              <Link
                href="/explore"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                {isVi ? "Hành trình hạt" : "Coffee journey"}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
