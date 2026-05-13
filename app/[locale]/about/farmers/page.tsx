import Image from "next/image";
import {Reveal} from "@/components/motion/reveal";
import {imageLibrary} from "@/lib/content";
import type {Locale} from "@/i18n/routing";

export function generateMetadata({params: {locale}}: {params: {locale: Locale}}) {
  return {
    title: locale === "vi" ? "Người nông dân · Wecacha" : "Our Farmers · Wecacha",
    description: locale === "vi" ? "Gặp gỡ những người giữ mùa trên vùng núi Sơn La." : "Meet the season keepers in the mountains of Son La."
  };
}

export default function FarmersPage({params: {locale}}: {params: {locale: Locale}}) {
  const isVi = locale === "vi";

  return (
    <main className="bg-parchment-50 text-forest-950">
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageLibrary.harvest}
            alt="Coffee Harvest"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-950/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center mt-20 text-white">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-ember">
              {isVi ? "Những người giữ mùa" : "The Season Keepers"}
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl">
              {isVi ? "Trái Tim Của Sơn La" : "The Heart of Son La"}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <Image
                  src={imageLibrary.village}
                  alt="Son La Village"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
            <div className="flex flex-col justify-center">
              <Reveal delay={0.2}>
                <h2 className="font-serif text-3xl sm:text-5xl mb-6">
                  {isVi ? "Những đôi bàn tay thầm lặng" : "The silent hands"}
                </h2>
                <div className="space-y-6 text-lg text-forest-950/70">
                  <p>
                    {isVi
                      ? "Đằng sau mỗi tách cà phê Wecacha là công sức của hàng trăm hộ nông dân đồng bào thiểu số tại Sơn La. Họ không chỉ là những người trồng trọt, họ là những người nghệ nhân của núi rừng."
                      : "Behind every cup of Wecacha coffee is the hard work of hundreds of ethnic minority farming households in Son La. They are not just growers; they are artisans of the forest."}
                  </p>
                  <p>
                    {isVi
                      ? "Việc hái chọn lọc bằng tay 100% trái chín đòi hỏi sự kiên nhẫn phi thường. Phải đi qua những sườn đồi dốc đứng trong sương lạnh, tỉ mỉ chọn từng quả anh đào đỏ mọng để đảm bảo lượng đường tự nhiên cao nhất."
                      : "100% hand-picking of ripe cherries requires extraordinary patience. Walking through steep hills in the cold mist, meticulously selecting each ripe red cherry ensures the highest natural sugar content."}
                  </p>
                  <div className="mt-8 border-l-2 border-ember pl-6 italic">
                    {isVi 
                      ? "\"Cây cà phê không biết nói, nhưng nó trả ơn người chăm sóc bằng thứ quả mọng ngọt ngào nhất.\""
                      : "\"The coffee tree doesn't speak, but it rewards the caretaker with the sweetest berries.\""}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
