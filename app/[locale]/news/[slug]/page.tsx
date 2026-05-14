import type {Metadata} from "next";
import {setRequestLocale, getTranslations} from "next-intl/server";
import {CinematicPageHero} from "@/components/sections/cinematic-page-hero";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";
import Image from "next/image";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";

type Props = {
  params: Promise<{locale: Locale; slug: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const isVi = locale === "vi";

  const contentMap: Record<string, any> = {
    "coffee-culture": { 
      vi: { title: "Văn hóa cà phê", desc: "Khám phá chiều sâu của hạt cà phê qua lăng kính lịch sử và nhịp sống hiện đại." }, 
      en: { title: "Coffee Culture", desc: "Explore the depth of coffee beans through history and modern lifestyle." },
      image: imageLibrary.coffeePour
    },
    events: { 
      vi: { title: "Sự kiện & Hoạt động", desc: "Đồng hành cùng Wecacha trong các sự kiện ra mắt, workshop và hành trình về bản." }, 
      en: { title: "Events", desc: "Join Wecacha in launch events, workshops, and farm journeys." },
      image: imageLibrary.farm
    },
    recipes: { 
      vi: { title: "Công thức pha chế", desc: "Bí quyết để tự tay pha một tách cà phê thơm ngon, chuẩn vị chuyên gia ngay tại nhà." }, 
      en: { title: "Recipes", desc: "Secrets to brewing a delicious, expert-level cup of coffee right at home." },
      image: imageLibrary.phin
    }
  };

  const data = contentMap[slug] || contentMap["coffee-culture"];
  const content = data[isVi ? "vi" : "en"];
  const section = isVi ? "Tin Tức" : "News";
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

export default async function NewsCategoryPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const isVi = locale === "vi";
  const tNav = await getTranslations({locale, namespace: "Nav"});
  const tCommon = await getTranslations({locale, namespace: "Common"});

  const contentMap: Record<string, any> = {
    "coffee-culture": {
      vi: { 
        title: "Văn hóa cà phê", 
        intro: "Khám phá chiều sâu của hạt cà phê qua lăng kính lịch sử và nhịp sống hiện đại.",
        article: {
          title: "Làn sóng cà phê thứ ba chạm ngõ sương mù Sơn La",
          date: "12 Tháng 5, 2026",
          paragraphs: [
            "Làn sóng cà phê thứ ba (Third Wave Coffee) không chỉ là sự thay đổi về cách thưởng thức mà còn là sự trân trọng nguồn gốc và công sức của người nông dân. Tại Sơn La, sự chuyển dịch này đang diễn ra mạnh mẽ hơn bao giờ hết.",
            "Trước đây, cà phê Sơn La thường chỉ được biết đến như nguồn nguyên liệu thô để xuất khẩu giá rẻ. Nhưng ngày nay, với sự đầu tư vào quy trình chế biến ướt (Washed), chế biến mật ong (Honey) và chế biến tự nhiên (Natural), hạt Arabica của núi rừng Tây Bắc đã chứng minh được phẩm chất vượt trội.",
            "Wecacha tự hào là một trong những đại diện tiên phong. Chúng tôi mang đến cho người yêu cà phê những tách pour-over sáng bừng hương hoa quả, độ chua thanh lịch, xóa bỏ định kiến rằng cà phê Việt Nam chỉ có vị đắng gắt."
          ]
        }
      },
      en: { 
        title: "Coffee Culture", 
        intro: "Explore the depth of coffee beans through history and modern lifestyle.",
        article: {
          title: "The Third Wave of Coffee reaches the misty hills of Son La",
          date: "May 12, 2026",
          paragraphs: [
            "The Third Wave Coffee movement is not just about how we consume, but about respecting the origin and the farmers' hard work. In Son La, this shift is happening stronger than ever.",
            "Previously, Son La coffee was mostly known as cheap raw material for export. But today, with investments in Washed, Honey, and Natural processing, the Arabica beans of the Northwest mountains have proven their exceptional quality.",
            "Wecacha is proud to be a pioneer. We bring coffee lovers bright, fruity pour-overs with elegant acidity, erasing the stereotype that Vietnamese coffee is only harshly bitter."
          ]
        }
      },
      image: imageLibrary.coffeePour,
      secondaryImage: imageLibrary.roasted
    },
    events: {
      vi: { 
        title: "Sự kiện & Hoạt động", 
        intro: "Đồng hành cùng Wecacha trong các sự kiện ra mắt, workshop và hành trình về bản.",
        article: {
          title: "Workshop Cupping: Hương Vị Nguyên Bản Sơn La tại Hà Nội",
          date: "28 Tháng 4, 2026",
          paragraphs: [
            "Tuần vừa qua, Wecacha đã tổ chức thành công buổi Workshop thử nếm (Cupping) tại trung tâm Hà Nội, quy tụ hơn 50 chuyên gia barista và những người đam mê cà phê đặc sản.",
            "Sự kiện là cơ hội để mọi người trực tiếp cảm nhận 3 dòng sản phẩm mới nhất của Wecacha, đại diện cho 3 phương pháp sơ chế khác biệt từ mùa vụ năm nay. Những nốt hương cam chanh (citrus), mật ong và trà đen đã nhận được vô số lời khen ngợi.",
            "Wecacha xin gửi lời cảm ơn chân thành đến tất cả các khách mời. Hành trình đưa cà phê đặc sản Sơn La đến gần hơn với cộng đồng vẫn sẽ tiếp tục với nhiều sự kiện thú vị trong tương lai."
          ]
        }
      },
      en: { 
        title: "Events", 
        intro: "Join Wecacha in launch events, workshops, and farm journeys.",
        article: {
          title: "Cupping Workshop: Original Son La Flavors in Hanoi",
          date: "April 28, 2026",
          paragraphs: [
            "Last week, Wecacha successfully hosted a Cupping Workshop in downtown Hanoi, gathering over 50 barista experts and specialty coffee enthusiasts.",
            "The event was an opportunity for everyone to directly experience Wecacha's 3 latest product lines, representing 3 distinct processing methods from this year's harvest. Notes of citrus, honey, and black tea received countless praises.",
            "Wecacha extends our sincere thanks to all guests. The journey to bring Son La specialty coffee closer to the community will continue with many exciting events in the future."
          ]
        }
      },
      image: imageLibrary.farm,
      secondaryImage: imageLibrary.coffeeRoast
    },
    recipes: {
      vi: { 
        title: "Công thức pha chế", 
        intro: "Bí quyết để tự tay pha một tách cà phê thơm ngon, chuẩn vị chuyên gia ngay tại nhà.",
        article: {
          title: "Hướng dẫn pha Pour-over hoàn hảo với hạt Wecacha Light Roast",
          date: "05 Tháng 5, 2026",
          paragraphs: [
            "Phương pháp Pour-over (V60) luôn là lựa chọn hàng đầu để khai thác trọn vẹn hương vị tinh tế của cà phê rang nhẹ (Light Roast). Hôm nay, Wecacha sẽ hướng dẫn bạn tỷ lệ vàng để pha một bình V60 xuất sắc.",
            "Chuẩn bị: 15g cà phê Wecacha xay mức vừa thô (Medium-Coarse), 250ml nước tinh khiết ở nhiệt độ 92°C, giấy lọc V60 và cân điện tử.",
            "Các bước thực hiện: \n1. Tráng giấy lọc bằng nước nóng. \n2. Cho cà phê vào và rót 30ml nước để ủ (bloom) trong 30 giây. \n3. Rót từ từ 220ml nước còn lại theo vòng xoắn ốc từ trong ra ngoài. \n4. Đợi nước chảy hết (khoảng 2 phút 30 giây) và thưởng thức ngay khi còn nóng."
          ]
        }
      },
      en: { 
        title: "Recipes", 
        intro: "Secrets to brewing a delicious, expert-level cup of coffee right at home.",
        article: {
          title: "Guide to the Perfect Pour-over with Wecacha Light Roast",
          date: "May 05, 2026",
          paragraphs: [
            "The Pour-over (V60) method is always the top choice to fully extract the delicate flavors of Light Roast coffee. Today, Wecacha shares the golden ratio for an excellent V60 brew.",
            "Preparation: 15g Wecacha coffee ground medium-coarse, 250ml purified water at 92°C, V60 filter paper, and a scale.",
            "Steps: \n1. Rinse the filter paper with hot water. \n2. Add coffee and pour 30ml of water to bloom for 30 seconds. \n3. Slowly pour the remaining 220ml in a spiral motion from the center outward. \n4. Wait for the drawdown (about 2:30 minutes) and enjoy while hot."
          ]
        }
      },
      image: imageLibrary.phin,
      secondaryImage: imageLibrary.cup
    }
  };

  const data = contentMap[slug] || contentMap["coffee-culture"];
  const content = data[isVi ? "vi" : "en"];

  return (
    <main className="bg-parchment-50">
      <CinematicPageHero
        kicker={tNav("news")}
        title={content.title}
        copy={content.intro}
        image={data.image}
        imageAlt={content.title}
        scrollLabel={tCommon("scrollDown")}
        breadcrumbs={
          <Breadcrumbs
            homeLabel={tNav("home")}
            theme="dark"
            items={[
              { label: tNav("news") },
              { label: content.title }
            ]} 
          />
        }
      />
      
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <article className="prose prose-lg prose-stone mx-auto">
              <header className="mb-12 text-center">
                <h1 className="mb-4 font-serif text-4xl text-forest-950 sm:text-5xl leading-tight">
                  {content.article.title}
                </h1>
                <p className="text-sm font-bold uppercase tracking-widest text-ember">
                  {content.article.date}
                </p>
              </header>

              <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-warm">
                <Image
                  src={data.secondaryImage}
                  alt={content.article.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-6 text-forest-950/80">
                {content.article.paragraphs.map((para: string, idx: number) => (
                  <p key={idx} className="whitespace-pre-line leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
