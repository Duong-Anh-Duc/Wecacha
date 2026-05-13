import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import {CinematicPageHero} from "@/components/sections/cinematic-page-hero";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";
import Image from "next/image";

type Props = {
  params: Promise<{locale: Locale; slug: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const isVi = locale === "vi";

  const contentMap: Record<string, any> = {
    farm: { 
      vi: { title: "Vùng trồng nguyên liệu", desc: "Từ độ cao 1.050m trên mực nước biển, những cây cà phê hấp thụ trọn vẹn tinh hoa đất trời Sơn La." }, 
      en: { title: "Our Farms", desc: "From 1,050m above sea level, our coffee trees absorb the true essence of Son La's terroir." },
      image: imageLibrary.farm
    },
    processing: { 
      vi: { title: "Phương pháp sơ chế", desc: "Khắt khe trong từng công đoạn: từ hái chín 100% bằng tay đến lên men tự nhiên và phơi trên giàn lưới." }, 
      en: { title: "Processing Methods", desc: "Strict at every stage: from 100% hand-picked ripe cherries to natural fermentation and raised bed drying." },
      image: imageLibrary.harvest
    },
    culture: { 
      vi: { title: "Văn hóa bản địa", desc: "Cà phê không chỉ là thức uống, mà là nhịp thở và câu chuyện của hàng trăm nông hộ người Thái, người Mông." }, 
      en: { title: "Local Culture", desc: "Coffee is not just a drink, but the breath and story of hundreds of Thai and Hmong farming families." },
      image: imageLibrary.village
    }
  };

  const data = contentMap[slug] || contentMap["farm"];
  const content = data[isVi ? "vi" : "en"];
  const section = isVi ? "Khám phá" : "Explore";
  const fullTitle = `${content.title} · ${section} · Wecacha`;

  return {
    title: fullTitle,
    description: content.desc,
    openGraph: {
      title: fullTitle,
      description: content.desc,
      images: [{ url: data.image }]
    }
  };
}

export default async function ExploreCategoryPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const isVi = locale === "vi";

  // Data structure for editorial content
  const contentMap: Record<string, any> = {
    farm: {
      vi: { 
        title: "Vùng trồng nguyên liệu", 
        intro: "Từ độ cao 1.050m trên mực nước biển, những cây cà phê hấp thụ trọn vẹn tinh hoa đất trời Sơn La.",
        sections: [
          {
            heading: "Thổ nhưỡng và khí hậu",
            text: "Sơn La sở hữu địa hình chia cắt mạnh, tạo nên những tiểu vùng khí hậu đặc trưng. Sự chênh lệch nhiệt độ ngày và đêm lớn cùng sương mù bao phủ quanh năm giúp quả cà phê chín chậm hơn, tích lũy lượng đường tự nhiên cao và hình thành những nốt hương hoa quả tinh tế, phức hợp."
          },
          {
            heading: "Những cây cà phê dưới tán rừng",
            text: "Khác với việc canh tác công nghiệp, phần lớn cà phê Wecacha được trồng xen canh dưới những tán cây rừng bản địa hoặc cây ăn quả. Hệ sinh thái này không chỉ bảo vệ đất đai mà còn mang lại bóng râm, giúp cây sinh trưởng khỏe mạnh một cách tự nhiên nhất."
          }
        ]
      },
      en: { 
        title: "Our Farms", 
        intro: "From 1,050m above sea level, our coffee trees absorb the true essence of Son La's terroir.",
        sections: [
          {
            heading: "Terroir & Climate",
            text: "Son La possesses a strongly divided terrain, creating unique microclimates. The high temperature difference between day and night, along with year-round mist, helps the coffee cherries ripen slower, accumulating natural sugars and developing delicate, complex fruity notes."
          },
          {
            heading: "Coffee under the canopy",
            text: "Unlike industrial farming, most Wecacha coffee is shade-grown under native forest canopies or fruit trees. This ecosystem not only protects the soil but provides shade, helping the trees grow healthily in the most natural way possible."
          }
        ]
      },
      image: imageLibrary.farm,
      secondaryImage: imageLibrary.village
    },
    processing: {
      vi: { 
        title: "Phương pháp sơ chế", 
        intro: "Khắt khe trong từng công đoạn: từ hái chín 100% bằng tay đến lên men tự nhiên và phơi trên giàn lưới.",
        sections: [
          {
            heading: "Chỉ chọn quả chín mọng",
            text: "Bước quan trọng nhất quyết định chất lượng ly cà phê chính là thu hoạch. Bà con nông dân Sơn La phải lội bộ qua những sườn đồi dốc để hái chọn lọc bằng tay 100% quả chín đỏ (Red Cherry). Chỉ những quả đạt lượng đường tối đa mới được đưa vào xưởng sơ chế."
          },
          {
            heading: "Lên men và phơi nắng tự nhiên",
            text: "Wecacha áp dụng các phương pháp sơ chế Honey và Natural để giữ lại trọn vẹn độ ngọt. Cà phê được phơi trên giàn lưới cách mặt đất, trong nhà kính để kiểm soát nghiêm ngặt nhiệt độ và độ ẩm, giúp hạt khô từ từ trong 15-20 ngày."
          }
        ]
      },
      en: { 
        title: "Processing Methods", 
        intro: "Strict at every stage: from 100% hand-picked ripe cherries to natural fermentation and raised bed drying.",
        sections: [
          {
            heading: "Only the ripest cherries",
            text: "The most important step determining coffee quality is the harvest. Farmers in Son La walk through steep hillsides to selectively hand-pick 100% ripe red cherries. Only cherries reaching maximum sugar content enter the processing mill."
          },
          {
            heading: "Fermentation & Sun-drying",
            text: "Wecacha applies Honey and Natural processing methods to retain maximum sweetness. The coffee is dried on raised beds inside greenhouses to strictly control temperature and humidity, allowing the beans to dry slowly over 15-20 days."
          }
        ]
      },
      image: imageLibrary.harvest,
      secondaryImage: imageLibrary.beans
    },
    culture: {
      vi: { 
        title: "Văn hóa bản địa", 
        intro: "Cà phê không chỉ là thức uống, mà là nhịp thở và câu chuyện của hàng trăm nông hộ người Thái, người Mông.",
        sections: [
          {
            heading: "Những người giữ mùa",
            text: "Sơn La là mái nhà của nhiều cộng đồng dân tộc thiểu số. Với họ, cây cà phê đã trở thành một phần của cuộc sống qua nhiều thế hệ. Bàn tay chai sạn nhưng khéo léo của những người phụ nữ Thái, Mông đã chăm chút cho từng gốc cà phê, biến những sườn đồi cằn cỗi thành màu xanh bạt ngàn."
          },
          {
            heading: "Sự phát triển bền vững",
            text: "Wecacha không chỉ mua bán, chúng tôi đồng hành cùng bà con. Bằng việc trả giá cao hơn cho cà phê chất lượng đặc sản, chúng tôi khuyến khích nông dân bảo vệ môi trường, không dùng hóa chất độc hại, giữ lại vẻ đẹp nguyên sơ của núi rừng Tây Bắc."
          }
        ]
      },
      en: { 
        title: "Local Culture", 
        intro: "Coffee is not just a drink, but the breath and story of hundreds of Thai and Hmong farming families.",
        sections: [
          {
            heading: "The season keepers",
            text: "Son La is home to many ethnic minority communities. For them, the coffee tree has become a part of life for generations. The calloused yet skillful hands of Thai and Hmong women care for each plant, turning barren hillsides into endless green."
          },
          {
            heading: "Sustainable growth",
            text: "Wecacha doesn't just trade; we walk alongside the farmers. By paying premium prices for specialty coffee, we encourage farmers to protect the environment, avoid harmful chemicals, and preserve the pristine beauty of the Northwest mountains."
          }
        ]
      },
      image: imageLibrary.village,
      secondaryImage: imageLibrary.cup
    }
  };

  const data = contentMap[slug] || contentMap["farm"];
  const content = data[isVi ? "vi" : "en"];

  return (
    <main className="bg-parchment-50">
      <CinematicPageHero
        kicker={isVi ? "Khám phá" : "Explore"}
        title={content.title}
        copy={content.intro}
        image={data.image}
        imageAlt={content.title}
        scrollLabel={isVi ? "Cuộn xuống" : "Scroll down"}
      />
      
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Reveal>
                <div className="space-y-12">
                  {content.sections.map((section: any, idx: number) => (
                    <div key={idx}>
                      <h2 className="mb-4 font-serif text-3xl text-forest-950 sm:text-4xl">
                        {section.heading}
                      </h2>
                      <p className="text-lg leading-relaxed text-forest-950/70">
                        {section.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-cinematic">
                <Image
                  src={data.secondaryImage}
                  alt={content.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
