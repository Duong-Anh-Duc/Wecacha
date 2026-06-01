import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import {createClient} from "@supabase/supabase-js";

const rootDir = process.cwd();
const moduleCache = new Map();

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    process.env[trimmed.slice(0, index)] ??= trimmed
      .slice(index + 1)
      .replace(/^["']|["']$/g, "");
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function resolveTsModule(request, parentFile) {
  const base = path.resolve(path.dirname(parentFile), request);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, "index.ts")
  ];

  const match = candidates.find((candidate) => fs.existsSync(candidate));
  if (!match) {
    throw new Error(`Cannot resolve ${request} from ${path.relative(rootDir, parentFile)}`);
  }

  return match;
}

function loadTsModule(relativePath) {
  const filename = path.resolve(rootDir, relativePath);
  if (moduleCache.has(filename)) return moduleCache.get(filename).exports;

  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    },
    fileName: filename
  }).outputText;

  const module = {exports: {}};
  moduleCache.set(filename, module);

  const sandbox = {
    exports: module.exports,
    module,
    require(request) {
      if (request.startsWith(".")) {
        return loadTsModule(path.relative(rootDir, resolveTsModule(request, filename)));
      }

      throw new Error(`Unexpected runtime import "${request}" in ${path.relative(rootDir, filename)}`);
    }
  };

  vm.runInNewContext(output, sandbox, {filename});
  return module.exports;
}

function loadMessages(locale) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, "messages", `${locale}.json`), "utf8"));
}

function pair(vi, en) {
  return {vi, en};
}

function section({
  pageKey,
  sectionKey,
  type = "section",
  eyebrow = pair("", ""),
  title = pair("", ""),
  copy = pair("", ""),
  quote = pair("", ""),
  cta = pair("", ""),
  ctaHref = null,
  media = {},
  settings = {},
  sortOrder
}) {
  return {
    page_key: pageKey,
    section_key: sectionKey,
    type,
    eyebrow_vi: eyebrow.vi,
    eyebrow_en: eyebrow.en,
    title_vi: title.vi,
    title_en: title.en,
    copy_vi: copy.vi,
    copy_en: copy.en,
    quote_vi: quote.vi,
    quote_en: quote.en,
    cta_label_vi: cta.vi,
    cta_label_en: cta.en,
    cta_href: ctaHref,
    media,
    settings,
    is_visible: true,
    sort_order: sortOrder,
    updated_at: new Date().toISOString()
  };
}

function item({
  pageKey,
  sectionKey,
  itemKey,
  type = "item",
  label = pair("", ""),
  title = pair("", ""),
  subtitle = pair("", ""),
  body = pair("", ""),
  href = null,
  media = {},
  data = {},
  sortOrder
}) {
  return {
    page_key: pageKey,
    section_key: sectionKey,
    item_key: itemKey,
    type,
    label_vi: label.vi,
    label_en: label.en,
    title_vi: title.vi,
    title_en: title.en,
    subtitle_vi: subtitle.vi,
    subtitle_en: subtitle.en,
    body_vi: body.vi,
    body_en: body.en,
    href,
    media,
    data,
    is_visible: true,
    sort_order: sortOrder,
    updated_at: new Date().toISOString()
  };
}

function currentExploreCategoryPages(imageLibrary) {
  return [
    {
      key: "explore-farm",
      path: "/explore/farm",
      slug: "farm",
      title: pair("Vùng trồng nguyên liệu", "Our Farms"),
      intro: pair(
        "Từ độ cao 1.050m trên mực nước biển, những cây cà phê hấp thụ trọn vẹn tinh hoa đất trời Sơn La.",
        "From 1,050m above sea level, our coffee trees absorb the true essence of Son La's terroir."
      ),
      image: imageLibrary.farm,
      secondaryImage: imageLibrary.village,
      sections: [
        {
          heading: pair("Thổ nhưỡng và khí hậu", "Terroir & Climate"),
          text: pair(
            "Sơn La sở hữu địa hình chia cắt mạnh, tạo nên những tiểu vùng khí hậu đặc trưng. Sự chênh lệch nhiệt độ ngày và đêm lớn cùng sương mù bao phủ quanh năm giúp quả cà phê chín chậm hơn, tích lũy lượng đường tự nhiên cao và hình thành những nốt hương hoa quả tinh tế, phức hợp.",
            "Son La possesses a strongly divided terrain, creating unique microclimates. The high temperature difference between day and night, along with year-round mist, helps the coffee cherries ripen slower, accumulating natural sugars and developing delicate, complex fruity notes."
          )
        },
        {
          heading: pair("Những cây cà phê dưới tán rừng", "Coffee under the canopy"),
          text: pair(
            "Khác với việc canh tác công nghiệp, phần lớn cà phê Wecacha được trồng xen canh dưới những tán cây rừng bản địa hoặc cây ăn quả. Hệ sinh thái này không chỉ bảo vệ đất đai mà còn mang lại bóng râm, giúp cây sinh trưởng khỏe mạnh một cách tự nhiên nhất.",
            "Unlike industrial farming, most Wecacha coffee is shade-grown under native forest canopies or fruit trees. This ecosystem not only protects the soil but provides shade, helping the trees grow healthily in the most natural way possible."
          )
        }
      ]
    },
    {
      key: "explore-processing",
      path: "/explore/processing",
      slug: "processing",
      title: pair("Phương pháp sơ chế", "Processing Methods"),
      intro: pair(
        "Khắt khe trong từng công đoạn: từ hái chín 100% bằng tay đến lên men tự nhiên và phơi trên giàn lưới.",
        "Strict at every stage: from 100% hand-picked ripe cherries to natural fermentation and raised bed drying."
      ),
      image: imageLibrary.harvest,
      secondaryImage: imageLibrary.beans,
      sections: [
        {
          heading: pair("Chỉ chọn quả chín mọng", "Only the ripest cherries"),
          text: pair(
            "Bước quan trọng nhất quyết định chất lượng ly cà phê chính là thu hoạch. Bà con nông dân Sơn La phải lội bộ qua những sườn đồi dốc để hái chọn lọc bằng tay 100% quả chín đỏ (Red Cherry). Chỉ những quả đạt lượng đường tối đa mới được đưa vào xưởng sơ chế.",
            "The most important step determining coffee quality is the harvest. Farmers in Son La walk through steep hillsides to selectively hand-pick 100% ripe red cherries. Only cherries reaching maximum sugar content enter the processing mill."
          )
        },
        {
          heading: pair("Lên men và phơi nắng tự nhiên", "Fermentation & Sun-drying"),
          text: pair(
            "Wecacha áp dụng các phương pháp sơ chế Honey và Natural để giữ lại trọn vẹn độ ngọt. Cà phê được phơi trên giàn lưới cách mặt đất, trong nhà kính để kiểm soát nghiêm ngặt nhiệt độ và độ ẩm, giúp hạt khô từ từ trong 15-20 ngày.",
            "Wecacha applies Honey and Natural processing methods to retain maximum sweetness. The coffee is dried on raised beds inside greenhouses to strictly control temperature and humidity, allowing the beans to dry slowly over 15-20 days."
          )
        }
      ]
    },
    {
      key: "explore-culture",
      path: "/explore/culture",
      slug: "culture",
      title: pair("Văn hóa bản địa", "Local Culture"),
      intro: pair(
        "Cà phê không chỉ là thức uống, mà là nhịp thở và câu chuyện của hàng trăm nông hộ người Thái, người Mông.",
        "Coffee is not just a drink, but the breath and story of hundreds of Thai and Hmong farming families."
      ),
      image: imageLibrary.village,
      secondaryImage: imageLibrary.cup,
      sections: [
        {
          heading: pair("Những người giữ mùa", "The season keepers"),
          text: pair(
            "Sơn La là mái nhà của nhiều cộng đồng dân tộc thiểu số. Với họ, cây cà phê đã trở thành một phần của cuộc sống qua nhiều thế hệ. Bàn tay chai sạn nhưng khéo léo của những người phụ nữ Thái, Mông đã chăm chút cho từng gốc cà phê, biến những sườn đồi cằn cỗi thành màu xanh bạt ngàn.",
            "Son La is home to many ethnic minority communities. For them, the coffee tree has become a part of life for generations. The calloused yet skillful hands of Thai and Hmong women care for each plant, turning barren hillsides into endless green."
          )
        },
        {
          heading: pair("Sự phát triển bền vững", "Sustainable growth"),
          text: pair(
            "Wecacha không chỉ mua bán, chúng tôi đồng hành cùng bà con. Bằng việc trả giá cao hơn cho cà phê chất lượng đặc sản, chúng tôi khuyến khích nông dân bảo vệ môi trường, không dùng hóa chất độc hại, giữ lại vẻ đẹp nguyên sơ của núi rừng Tây Bắc.",
            "Wecacha doesn't just trade; we walk alongside the farmers. By paying premium prices for specialty coffee, we encourage farmers to protect the environment, avoid harmful chemicals, and preserve the pristine beauty of the Northwest mountains."
          )
        }
      ]
    }
  ];
}

function currentStoryFeatureCopy() {
  return {
    vi: {
      kicker: "Câu chuyện",
      title: "Về Wecacha: Hành trình từ nương mây đến tách cà phê",
      body:
        "Khám phá nguồn gốc, triết lý rang và những con người đứng sau từng hạt cà phê Sơn La đặc sản. Câu chuyện về sự kiên định và đam mê.",
      video: "Xem hành trình của hạt cà phê",
      discover: "Khám phá",
      news: "Tin tức",
      read: "Đọc thêm",
      cards: [
        {
          title: "Vùng trồng nguyên liệu",
          body: "Từ độ cao, sương núi và đất đỏ làm nên vị ngọt sâu.",
          href: "/explore/farm"
        },
        {
          title: "Phương pháp sơ chế",
          body: "Khắt khe trong từng mẻ phơi, đảo và ghi chép mùa vụ.",
          href: "/explore/processing"
        },
        {
          title: "Văn hóa bản địa",
          body: "Cà phê không tách khỏi bản làng, bếp lửa và thổ cẩm.",
          href: "/explore/culture"
        }
      ],
      newsCards: [
        {
          title: "Văn hóa cà phê",
          body: "Khám phá chiều sâu của hạt cà phê qua lăng kính lịch sử và nhịp sống hiện đại.",
          icon: "coffee",
          href: "/news"
        },
        {
          title: "Sự kiện & Hoạt động",
          body: "Đồng hành cùng Wecacha trong các sự kiện ra mắt, workshop và hành trình về bản.",
          icon: "calendar",
          href: "/news"
        },
        {
          title: "Công thức pha chế",
          body: "Bí quyết để tự tay pha một tách cà phê thơm ngon, chuẩn vị chuyên gia.",
          icon: "coffee",
          href: "/news"
        }
      ]
    },
    en: {
      kicker: "Story",
      title: "About Wecacha: From cloud farms to the coffee cup",
      body:
        "Explore the origin, roast philosophy and people behind every bag of specialty coffee from Son La.",
      video: "Watch the coffee bean journey",
      discover: "Explore",
      news: "News",
      read: "Read more",
      cards: [
        {
          title: "Growing regions",
          body: "Altitude, mountain mist and red soil create deep sweetness.",
          href: "/explore/farm"
        },
        {
          title: "Processing methods",
          body: "Precise drying, turning and harvest notes shape every batch.",
          href: "/explore/processing"
        },
        {
          title: "Local culture",
          body: "Coffee stays close to village life, firelight and brocade.",
          href: "/explore/culture"
        }
      ],
      newsCards: [
        {
          title: "Coffee culture",
          body: "Discover coffee through history, place and modern daily rituals.",
          icon: "coffee",
          href: "/news"
        },
        {
          title: "Events & Activities",
          body: "Join Wecacha launches, workshops and journeys back to the village.",
          icon: "calendar",
          href: "/news"
        },
        {
          title: "Brew recipes",
          body: "Practical recipes for a fragrant, balanced cup at home.",
          icon: "coffee",
          href: "/news"
        }
      ]
    }
  };
}

async function upsertOrThrow(supabase, table, rows, options) {
  if (!rows.length) return;

  const {error} = await supabase.from(table).upsert(rows, options);
  if (error) {
    if (error.code === "42P01" || error.code === "PGRST205") {
      throw new Error(
        `Missing table "${table}". Run supabase/sql/supabase-site-content-migration.sql in Supabase SQL Editor first.`
      );
    }

    throw error;
  }
}

async function main() {
  loadEnvFile(path.join(rootDir, ".env.local"));

  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {auth: {persistSession: false}}
  );

  const vi = loadMessages("vi");
  const en = loadMessages("en");
  const {imageLibrary, heroVideo} = loadTsModule("lib/content/images.ts");
  const {exploreCards, testimonials, mapLocations} = loadTsModule("lib/content/discover.ts");
  const {journeys, storyChapters} = loadTsModule("lib/content/stories.ts");
  const {products} = loadTsModule("lib/content/products.ts");
  const storyFeatureCopy = currentStoryFeatureCopy();
  const now = new Date().toISOString();

  const pages = [
    {
      key: "home",
      path: "/",
      title_vi: vi.Home.heroTitle,
      title_en: en.Home.heroTitle,
      description_vi: vi.Home.heroCopy,
      description_en: en.Home.heroCopy,
      metadata: {route: "/[locale]"},
      is_visible: true,
      sort_order: 1,
      updated_at: now
    },
    {
      key: "explore",
      path: "/explore",
      title_vi: vi.Explore.title,
      title_en: en.Explore.title,
      description_vi: vi.Explore.intro,
      description_en: en.Explore.intro,
      metadata: {route: "/[locale]/explore"},
      is_visible: true,
      sort_order: 2,
      updated_at: now
    },
    {
      key: "shop",
      path: "/shop",
      title_vi: vi.Shop.title,
      title_en: en.Shop.title,
      description_vi: vi.Shop.intro,
      description_en: en.Shop.intro,
      metadata: {route: "/[locale]/shop"},
      is_visible: true,
      sort_order: 3,
      updated_at: now
    },
    {
      key: "product-detail",
      path: "/shop/[slug]",
      title_vi: vi.Product.infoHeading,
      title_en: en.Product.infoHeading,
      description_vi: vi.Product.journeyCopy,
      description_en: en.Product.journeyCopy,
      metadata: {route: "/[locale]/shop/[slug]"},
      is_visible: true,
      sort_order: 4,
      updated_at: now
    },
    {
      key: "news",
      path: "/news",
      title_vi: vi.News.title,
      title_en: en.News.title,
      description_vi: vi.News.copy,
      description_en: en.News.copy,
      metadata: {route: "/[locale]/news"},
      is_visible: true,
      sort_order: 5,
      updated_at: now
    },
    {
      key: "about",
      path: "/about",
      title_vi: vi.About.heroTitle,
      title_en: en.About.heroTitle,
      description_vi: vi.About.heroCopy,
      description_en: en.About.heroCopy,
      metadata: {route: "/[locale]/about"},
      is_visible: true,
      sort_order: 6,
      updated_at: now
    },
    {
      key: "about-farmers",
      path: "/about/farmers",
      title_vi: vi.About.farmersTitle,
      title_en: en.About.farmersTitle,
      description_vi: vi.About.farmersPara1,
      description_en: en.About.farmersPara1,
      metadata: {route: "/[locale]/about/farmers"},
      is_visible: true,
      sort_order: 7,
      updated_at: now
    },
    {
      key: "about-philosophy",
      path: "/about/philosophy",
      title_vi: vi.Philosophy.heroTitle,
      title_en: en.Philosophy.heroTitle,
      description_vi: vi.Philosophy.respectPara1,
      description_en: en.Philosophy.respectPara1,
      metadata: {route: "/[locale]/about/philosophy"},
      is_visible: true,
      sort_order: 8,
      updated_at: now
    },
    {
      key: "story",
      path: "/about/story",
      title_vi: vi.Story.title,
      title_en: en.Story.title,
      description_vi: vi.Story.intro,
      description_en: en.Story.intro,
      metadata: {route: "/[locale]/about/story"},
      is_visible: true,
      sort_order: 9,
      updated_at: now
    },
    {
      key: "contact",
      path: "/contact",
      title_vi: vi.Contact.title,
      title_en: en.Contact.title,
      description_vi: vi.Contact.intro,
      description_en: en.Contact.intro,
      metadata: {route: "/[locale]/contact"},
      is_visible: true,
      sort_order: 10,
      updated_at: now
    },
    ...currentExploreCategoryPages(imageLibrary).map((page, index) => ({
      key: page.key,
      path: page.path,
      title_vi: page.title.vi,
      title_en: page.title.en,
      description_vi: page.intro.vi,
      description_en: page.intro.en,
      metadata: {route: "/[locale]/explore/[slug]", slug: page.slug},
      is_visible: true,
      sort_order: 10 + index,
      updated_at: now
    }))
  ];

  const sections = [
    section({
      pageKey: "home",
      sectionKey: "hero",
      type: "hero",
      eyebrow: pair(vi.Home.kicker, en.Home.kicker),
      title: pair(vi.Home.heroTitle, en.Home.heroTitle),
      copy: pair(vi.Home.heroCopy, en.Home.heroCopy),
      cta: pair(vi.Home.ctaPrimary, en.Home.ctaPrimary),
      ctaHref: "/contact",
      media: {video: heroVideo, poster: imageLibrary.heroPoster},
      settings: {
        secondaryCta: {vi: vi.Home.ctaSecondary, en: en.Home.ctaSecondary, href: "/explore"},
        scrollLabel: {vi: vi.Home.scroll, en: en.Home.scroll}
      },
      sortOrder: 1
    }),
    section({
      pageKey: "home",
      sectionKey: "origin_story",
      type: "story_with_stats",
      eyebrow: pair(vi.Home.originKicker, en.Home.originKicker),
      title: pair(vi.Home.storyTitle, en.Home.storyTitle),
      copy: pair(vi.Home.storyCopy, en.Home.storyCopy),
      quote: pair(vi.Home.storyQuote, en.Home.storyQuote),
      media: {
        background: "/image1.jpeg",
        primary: "/image2.jpeg",
        secondary: "/image1.jpeg"
      },
      sortOrder: 2
    }),
    section({
      pageKey: "home",
      sectionKey: "culture",
      type: "quote_band",
      eyebrow: pair(vi.Home.cultureKicker, en.Home.cultureKicker),
      title: pair(vi.Home.cultureTitle, en.Home.cultureTitle),
      copy: pair(vi.Home.cultureCopy, en.Home.cultureCopy),
      quote: pair(vi.Home.cultureQuote, en.Home.cultureQuote),
      media: {background: "/image3.jpeg"},
      sortOrder: 3
    }),
    section({
      pageKey: "home",
      sectionKey: "core_values",
      type: "value_cards",
      eyebrow: pair(vi.Home.coreValuesKicker, en.Home.coreValuesKicker),
      title: pair(vi.Home.coreValuesTitle, en.Home.coreValuesTitle),
      media: {texture: "/thai-pattern-bg.png"},
      sortOrder: 4
    }),
    section({
      pageKey: "home",
      sectionKey: "featured_product_cards",
      type: "product_marketing_cards",
      eyebrow: pair(vi.Home.productsKicker, en.Home.productsKicker),
      title: pair(vi.Home.productsTitle2, en.Home.productsTitle2),
      copy: pair(vi.Home.productsCopy, en.Home.productsCopy),
      media: {background: "/premium-coffee-bg.png"},
      settings: {
        profileLabel: {vi: vi.Home.prodProfileLabel, en: en.Home.prodProfileLabel},
        storyLabel: {vi: vi.Home.prodStoryLabel, en: en.Home.prodStoryLabel},
        cta: {vi: vi.Home.prodCta, en: en.Home.prodCta, href: "/contact"}
      },
      sortOrder: 5
    }),
    section({
      pageKey: "home",
      sectionKey: "commitment",
      type: "accordion_cards",
      eyebrow: pair(vi.Home.commitmentKicker, en.Home.commitmentKicker),
      title: pair(vi.Home.commitmentTitle, en.Home.commitmentTitle),
      copy: pair(vi.Home.commitmentCopy, en.Home.commitmentCopy),
      sortOrder: 6
    }),
    section({
      pageKey: "home",
      sectionKey: "testimonials",
      type: "carousel",
      eyebrow: pair(vi.Home.testimonialsKicker, en.Home.testimonialsKicker),
      title: pair(vi.Home.testimonialsTitle, en.Home.testimonialsTitle),
      media: {background: "/image5.jpeg"},
      sortOrder: 7
    }),
    section({
      pageKey: "home",
      sectionKey: "recent_purchases",
      type: "marquee",
      sortOrder: 8
    }),
    section({
      pageKey: "home",
      sectionKey: "journeys",
      type: "journey_cards",
      eyebrow: pair(vi.Home.journeysKicker, en.Home.journeysKicker),
      title: pair(vi.Home.journeysTitle, en.Home.journeysTitle),
      sortOrder: 9
    }),
    section({
      pageKey: "explore",
      sectionKey: "hero_card",
      type: "editorial_hero_card",
      eyebrow: pair(vi.Explore.storyLabel, en.Explore.storyLabel),
      title: pair(
        `${vi.Explore.heroAbout} ${vi.Explore.heroTitle1} ${vi.Explore.heroTitle2}`,
        `${en.Explore.heroAbout} ${en.Explore.heroTitle1} ${en.Explore.heroTitle2}`
      ),
      copy: pair(`${vi.Explore.heroCopy1} ${vi.Explore.heroCopy2}`, `${en.Explore.heroCopy1} ${en.Explore.heroCopy2}`),
      cta: pair(vi.Explore.watchJourney, en.Explore.watchJourney),
      ctaHref: "/about",
      media: {image: imageLibrary.mountains},
      settings: {
        titleLines: {
          vi: [vi.Explore.heroAbout, vi.Explore.heroTitle1, vi.Explore.heroTitle2],
          en: [en.Explore.heroAbout, en.Explore.heroTitle1, en.Explore.heroTitle2]
        }
      },
      sortOrder: 1
    }),
    section({
      pageKey: "explore",
      sectionKey: "article_cards",
      type: "link_cards",
      eyebrow: pair(vi.Explore.exploreLabel, en.Explore.exploreLabel),
      sortOrder: 2
    }),
    section({
      pageKey: "explore",
      sectionKey: "news_categories",
      type: "news_links",
      sortOrder: 3
    }),
    section({
      pageKey: "explore",
      sectionKey: "gallery",
      type: "image_gallery",
      title: pair(vi.Explore.gallery, en.Explore.gallery),
      sortOrder: 4
    }),
    section({
      pageKey: "explore",
      sectionKey: "reels",
      type: "video_reels",
      title: pair(vi.Explore.reels, en.Explore.reels),
      sortOrder: 5
    }),
    section({
      pageKey: "explore",
      sectionKey: "map",
      type: "map_points",
      eyebrow: pair(vi.Explore.mapLabel, en.Explore.mapLabel),
      title: pair(vi.Explore.mapTitle, en.Explore.mapTitle),
      media: {background: imageLibrary.mountains},
      sortOrder: 6
    }),
    section({
      pageKey: "shop",
      sectionKey: "hero",
      type: "page_hero",
      eyebrow: pair(vi.Shop.shopKicker, en.Shop.shopKicker),
      title: pair(vi.Shop.title, en.Shop.title),
      copy: pair(vi.Shop.intro, en.Shop.intro),
      media: {image: imageLibrary.farm},
      settings: {
        chips: {
          vi: [vi.Shop.chip1, vi.Shop.chip2, vi.Shop.chip3],
          en: [en.Shop.chip1, en.Shop.chip2, en.Shop.chip3]
        }
      },
      sortOrder: 1
    }),
    section({
      pageKey: "shop",
      sectionKey: "media_strip",
      type: "media_strip",
      media: {
        images: [imageLibrary.beans, imageLibrary.roasted, imageLibrary.phin, imageLibrary.packaging, imageLibrary.cup]
      },
      sortOrder: 2
    }),
    section({
      pageKey: "product-detail",
      sectionKey: "benefits",
      type: "benefit_cards",
      title: pair(vi.Product.whyLoveTitle, en.Product.whyLoveTitle),
      media: {image: "/son_la_bg.png"},
      sortOrder: 1
    }),
    section({
      pageKey: "product-detail",
      sectionKey: "reviews",
      type: "reviews",
      title: pair(vi.Product.reviewsTitle, en.Product.reviewsTitle),
      settings: {rating: 4.9, reviewCount: 128},
      sortOrder: 2
    }),
    section({
      pageKey: "news",
      sectionKey: "hero",
      type: "page_hero",
      eyebrow: pair(vi.News.kicker, en.News.kicker),
      title: pair(vi.News.title, en.News.title),
      copy: pair(vi.News.copy, en.News.copy),
      media: {image: imageLibrary.cup},
      settings: {
        scrollLabel: {vi: vi.News.scrollLabel, en: en.News.scrollLabel}
      },
      sortOrder: 1
    }),
    section({
      pageKey: "about",
      sectionKey: "hero",
      type: "page_hero",
      eyebrow: pair(vi.About.kicker, en.About.kicker),
      title: pair(vi.About.heroTitle, en.About.heroTitle),
      copy: pair(vi.About.heroCopy, en.About.heroCopy),
      media: {image: imageLibrary.mountains},
      sortOrder: 1
    }),
    section({
      pageKey: "about",
      sectionKey: "brand_story",
      type: "image_text",
      title: pair(vi.About.harmonyTitle, en.About.harmonyTitle),
      media: {image: imageLibrary.farmer},
      sortOrder: 2
    }),
    section({
      pageKey: "about",
      sectionKey: "vision_mission",
      type: "two_column",
      sortOrder: 3
    }),
    section({
      pageKey: "about",
      sectionKey: "core_values",
      type: "icon_cards",
      eyebrow: pair(vi.About.coreValuesKicker, en.About.coreValuesKicker),
      title: pair(vi.About.coreValuesTitle, en.About.coreValuesTitle),
      sortOrder: 4
    }),
    section({
      pageKey: "about",
      sectionKey: "cta",
      type: "cta",
      title: pair(vi.About.ctaTitle, en.About.ctaTitle),
      copy: pair(vi.About.ctaCopy, en.About.ctaCopy),
      cta: pair(vi.About.ctaJourney, en.About.ctaJourney),
      ctaHref: "/explore",
      media: {background: imageLibrary.brocade},
      sortOrder: 5
    }),
    section({
      pageKey: "about-farmers",
      sectionKey: "hero",
      type: "page_hero",
      eyebrow: pair(vi.About.farmersKicker, en.About.farmersKicker),
      title: pair(vi.About.farmersTitle, en.About.farmersTitle),
      media: {image: imageLibrary.harvest},
      sortOrder: 1
    }),
    section({
      pageKey: "about-farmers",
      sectionKey: "body",
      type: "image_text_quote",
      title: pair(vi.About.farmersHandsTitle, en.About.farmersHandsTitle),
      copy: pair(`${vi.About.farmersPara1}\n\n${vi.About.farmersPara2}`, `${en.About.farmersPara1}\n\n${en.About.farmersPara2}`),
      quote: pair(vi.About.farmersQuote, en.About.farmersQuote),
      media: {image: imageLibrary.village},
      sortOrder: 2
    }),
    section({
      pageKey: "about-philosophy",
      sectionKey: "hero",
      type: "page_hero",
      eyebrow: pair(vi.Philosophy.heatKicker, en.Philosophy.heatKicker),
      title: pair(vi.Philosophy.heroTitle, en.Philosophy.heroTitle),
      media: {image: imageLibrary.coffeeRoast},
      sortOrder: 1
    }),
    section({
      pageKey: "about-philosophy",
      sectionKey: "body",
      type: "text_with_principles",
      title: pair(vi.Philosophy.respectTitle, en.Philosophy.respectTitle),
      copy: pair(`${vi.Philosophy.respectPara1}\n\n${vi.Philosophy.respectPara2}`, `${en.Philosophy.respectPara1}\n\n${en.Philosophy.respectPara2}`),
      sortOrder: 2
    }),
    section({
      pageKey: "story",
      sectionKey: "hero",
      type: "documentary_hero",
      eyebrow: pair(vi.Story.documentary, en.Story.documentary),
      title: pair(vi.Story.title, en.Story.title),
      copy: pair(vi.Story.intro, en.Story.intro),
      media: {image: imageLibrary.hero},
      sortOrder: 1
    }),
    section({
      pageKey: "story",
      sectionKey: "chapters",
      type: "chapter_slider",
      eyebrow: pair(vi.Story.fieldNotes, en.Story.fieldNotes),
      quote: pair(vi.Story.quote, en.Story.quote),
      sortOrder: 2
    }),
    section({
      pageKey: "story",
      sectionKey: "journey_feature",
      type: "story_feature",
      eyebrow: pair(storyFeatureCopy.vi.kicker, storyFeatureCopy.en.kicker),
      title: pair(storyFeatureCopy.vi.title, storyFeatureCopy.en.title),
      copy: pair(storyFeatureCopy.vi.body, storyFeatureCopy.en.body),
      cta: pair(storyFeatureCopy.vi.video, storyFeatureCopy.en.video),
      ctaHref: "/explore",
      media: {image: imageLibrary.hero},
      settings: {
        discoverLabel: {vi: storyFeatureCopy.vi.discover, en: storyFeatureCopy.en.discover},
        newsLabel: {vi: storyFeatureCopy.vi.news, en: storyFeatureCopy.en.news},
        readLabel: {vi: storyFeatureCopy.vi.read, en: storyFeatureCopy.en.read}
      },
      sortOrder: 3
    }),
    section({
      pageKey: "story",
      sectionKey: "culture_band",
      type: "image_band",
      eyebrow: storyChapters[2].eyebrow,
      title: storyChapters[2].title,
      copy: pair(storyChapters[2].body.vi[0], storyChapters[2].body.en[0]),
      media: {images: [imageLibrary.brocade, imageLibrary.campfire, imageLibrary.village]},
      sortOrder: 4
    }),
    section({
      pageKey: "story",
      sectionKey: "roast_section",
      type: "image_text_cta",
      eyebrow: storyChapters[3].eyebrow,
      title: storyChapters[3].title,
      copy: pair(storyChapters[3].body.vi[0], storyChapters[3].body.en[0]),
      cta: pair(vi.Common.ctaShop, en.Common.ctaShop),
      ctaHref: "/shop",
      media: {
        image: storyChapters[3].image,
        secondaryImage: imageLibrary.beansBowl,
        alt: storyChapters[3].alt
      },
      settings: {
        extraCopy: {vi: storyChapters[3].body.vi[1], en: storyChapters[3].body.en[1]}
      },
      sortOrder: 5
    }),
    section({
      pageKey: "story",
      sectionKey: "conclusion",
      type: "fullscreen_cta",
      eyebrow: pair(vi.About.storyConclKicker, en.About.storyConclKicker),
      title: pair(vi.About.storyConclTitle, en.About.storyConclTitle),
      copy: pair(vi.About.storyConclCopy, en.About.storyConclCopy),
      media: {image: imageLibrary.coffeePour},
      sortOrder: 6
    }),
    section({
      pageKey: "contact",
      sectionKey: "hero",
      type: "contact_hero",
      eyebrow: pair(vi.Contact.contactKicker, en.Contact.contactKicker),
      title: pair(vi.Contact.title, en.Contact.title),
      copy: pair(vi.Contact.intro, en.Contact.intro),
      media: {image: imageLibrary.village},
      sortOrder: 1
    }),
    section({
      pageKey: "contact",
      sectionKey: "media_strip",
      type: "media_strip",
      media: {
        images: [imageLibrary.village, imageLibrary.farm, imageLibrary.brocade, imageLibrary.campfire, imageLibrary.roasted, imageLibrary.cup]
      },
      sortOrder: 2
    }),
    section({
      pageKey: "contact",
      sectionKey: "map",
      type: "map_embed",
      title: pair(vi.Contact.mapIframeTitle, en.Contact.mapIframeTitle),
      settings: {src: "https://www.google.com/maps?q=Son%20La%20Vietnam&output=embed"},
      sortOrder: 3
    }),
    ...currentExploreCategoryPages(imageLibrary).map((page) =>
      section({
        pageKey: page.key,
        sectionKey: "hero",
        type: "page_hero",
        eyebrow: pair(vi.Nav.explore, en.Nav.explore),
        title: page.title,
        copy: page.intro,
        media: {image: page.image, secondaryImage: page.secondaryImage},
        sortOrder: 1
      })
    ),
    ...currentExploreCategoryPages(imageLibrary).map((page) =>
      section({
        pageKey: page.key,
        sectionKey: "body",
        type: "editorial_sections",
        media: {image: page.secondaryImage},
        sortOrder: 2
      })
    )
  ];

  const items = [
    ...[
      ["altitude", "mountain", 1200, "m+", 0, vi.Home.statAltLabel, en.Home.statAltLabel, vi.Home.statAltCaption, en.Home.statAltCaption],
      ["farmland", "map", 24300, " ha", 0, vi.Home.statFarmersLabel, en.Home.statFarmersLabel, vi.Home.statFarmersCaption, en.Home.statFarmersCaption],
      ["arabica_share", "award", 47.9, "%", 1, vi.Home.statRoastValue, en.Home.statRoastValue, vi.Home.statRoastCaption, en.Home.statRoastCaption]
    ].map(([key, icon, value, suffix, decimals, titleVi, titleEn, bodyVi, bodyEn], index) =>
      item({
        pageKey: "home",
        sectionKey: "origin_story",
        itemKey: String(key),
        type: "stat",
        title: pair(String(titleVi), String(titleEn)),
        body: pair(String(bodyVi), String(bodyEn)),
        media: {icon},
        data: {value, suffix, decimals},
        sortOrder: index + 1
      })
    ),
    ...[
      ["preserve_culture", "leaf", "01", vi.Home.coreVal1Title, en.Home.coreVal1Title, vi.Home.coreVal1Copy, en.Home.coreVal1Copy, "/core-val-1.png"],
      ["respect_history", "compass", "02", vi.Home.coreVal2Title, en.Home.coreVal2Title, vi.Home.coreVal2Copy, en.Home.coreVal2Copy, "/core-val-2.png"],
      ["farmers_story", "heart", "03", vi.Home.coreVal3Title, en.Home.coreVal3Title, vi.Home.coreVal3Copy, en.Home.coreVal3Copy, "/core-val-3.png"],
      ["distinct_identity", "mountain", "04", vi.Home.coreVal4Title, en.Home.coreVal4Title, vi.Home.coreVal4Copy, en.Home.coreVal4Copy, "/core-val-4.png"]
    ].map(([key, icon, numeral, titleVi, titleEn, bodyVi, bodyEn, image], index) =>
      item({
        pageKey: "home",
        sectionKey: "core_values",
        itemKey: String(key),
        type: "value_card",
        title: pair(String(titleVi), String(titleEn)),
        body: pair(String(bodyVi), String(bodyEn)),
        media: {image, icon},
        data: {numeral},
        sortOrder: index + 1
      })
    ),
    ...[
      ["premium", vi.Home.prod1Badge, en.Home.prod1Badge, vi.Home.prod1Name, en.Home.prod1Name, vi.Home.prod1Sub, en.Home.prod1Sub, vi.Home.prod1Story, en.Home.prod1Story, vi.Home.prod1Profile, en.Home.prod1Profile, "/product-premium.png"],
      ["specialty", vi.Home.prod2Badge, en.Home.prod2Badge, vi.Home.prod2Name, en.Home.prod2Name, vi.Home.prod2Sub, en.Home.prod2Sub, vi.Home.prod2Story, en.Home.prod2Story, vi.Home.prod2Profile, en.Home.prod2Profile, "/product-specialty.png"]
    ].map(([key, labelVi, labelEn, titleVi, titleEn, subtitleVi, subtitleEn, bodyVi, bodyEn, profileVi, profileEn, image], index) =>
      item({
        pageKey: "home",
        sectionKey: "featured_product_cards",
        itemKey: String(key),
        type: "product_marketing_card",
        label: pair(String(labelVi), String(labelEn)),
        title: pair(String(titleVi), String(titleEn)),
        subtitle: pair(String(subtitleVi), String(subtitleEn)),
        body: pair(String(bodyVi), String(bodyEn)),
        media: {image},
        data: {profile: {vi: profileVi, en: profileEn}},
        sortOrder: index + 1
      })
    ),
    ...[
      ["hand_harvest", vi.Home.commit1Title, en.Home.commit1Title, vi.Home.commit1Copy, en.Home.commit1Copy, "/commit-altitude.png"],
      ["women_children", vi.Home.commit2Title, en.Home.commit2Title, vi.Home.commit2Copy, en.Home.commit2Copy, "/commit-farmers.png"],
      ["natural_roast", vi.Home.commit3Title, en.Home.commit3Title, vi.Home.commit3Copy, en.Home.commit3Copy, "/commit-roast.png"]
    ].map(([key, titleVi, titleEn, bodyVi, bodyEn, image], index) =>
      item({
        pageKey: "home",
        sectionKey: "commitment",
        itemKey: String(key),
        type: "commitment_card",
        title: pair(String(titleVi), String(titleEn)),
        body: pair(String(bodyVi), String(bodyEn)),
        media: {image},
        sortOrder: index + 1
      })
    ),
    ...testimonials.map((testimonial, index) =>
      item({
        pageKey: "home",
        sectionKey: "testimonials",
        itemKey: `testimonial-${index + 1}`,
        type: "testimonial",
        label: pair(testimonial.role.vi, testimonial.role.en),
        title: pair(testimonial.name, testimonial.name),
        body: pair(testimonial.quote.vi, testimonial.quote.en),
        media: {avatar: testimonial.avatar, background: testimonial.bgImage},
        sortOrder: index + 1
      })
    ),
    ...[
      ["purchase-plum", "shopping-bag", "Đinh Lan Hương", "Dinh Lan Huong", "Hà Nội", "Hanoi", vi.Home.recentPurchases.buyPlum, en.Home.recentPurchases.buyPlum, vi.Home.recentPurchases.time2m, en.Home.recentPurchases.time2m, "text-rose-400"],
      ["purchase-gift", "package", "Phạm Quốc Bảo", "Pham Quoc Bao", "TP.HCM", "HCMC", vi.Home.recentPurchases.buyGift, en.Home.recentPurchases.buyGift, vi.Home.recentPurchases.time15m, en.Home.recentPurchases.time15m, "text-amber-400"],
      ["purchase-honey", "shopping-bag", "Vũ Phương Thảo", "Vu Phuong Thao", "Đà Nẵng", "Da Nang", vi.Home.recentPurchases.buyHoney, en.Home.recentPurchases.buyHoney, vi.Home.recentPurchases.time1h, en.Home.recentPurchases.time1h, "text-emerald-400"],
      ["purchase-phin", "shopping-bag", "Bùi Quang Huy", "Bui Quang Huy", "Sơn La", "Son La", vi.Home.recentPurchases.buyPhin, en.Home.recentPurchases.buyPhin, vi.Home.recentPurchases.time2h, en.Home.recentPurchases.time2h, "text-blue-400"],
      ["rating-arabica", "star", "Trần Minh Nhật", "Tran Minh Nhat", "Hải Phòng", "Hai Phong", vi.Home.recentPurchases.rateArabica, en.Home.recentPurchases.rateArabica, vi.Home.recentPurchases.time3h, en.Home.recentPurchases.time3h, "text-yellow-500"]
    ].map(([key, icon, nameVi, nameEn, locationVi, locationEn, bodyVi, bodyEn, timeVi, timeEn, color], index) =>
      item({
        pageKey: "home",
        sectionKey: "recent_purchases",
        itemKey: String(key),
        type: "recent_activity",
        title: pair(String(nameVi), String(nameEn)),
        subtitle: pair(String(locationVi), String(locationEn)),
        body: pair(String(bodyVi), String(bodyEn)),
        data: {time: {vi: timeVi, en: timeEn}, icon, color},
        sortOrder: index + 1
      })
    ),
    ...journeys.map((journey, index) =>
      item({
        pageKey: "home",
        sectionKey: "journeys",
        itemKey: `journey-${index + 1}`,
        type: "journey_card",
        title: pair(journey.title.vi, journey.title.en),
        body: pair(journey.body.vi, journey.body.en),
        href: journey.href,
        media: {image: journey.image},
        sortOrder: index + 1
      })
    ),
    ...[
      ["farm", "/explore/farm", vi.Explore.farmTitle, en.Explore.farmTitle, vi.Explore.farmDesc, en.Explore.farmDesc, imageLibrary.beansBowl],
      ["processing", "/explore/processing", vi.Explore.processingTitle, en.Explore.processingTitle, vi.Explore.processingDesc, en.Explore.processingDesc, imageLibrary.roasted],
      ["culture", "/explore/culture", vi.Explore.cultureArticleTitle, en.Explore.cultureArticleTitle, vi.Explore.cultureArticleDesc, en.Explore.cultureArticleDesc, imageLibrary.village]
    ].map(([key, href, titleVi, titleEn, bodyVi, bodyEn, image], index) =>
      item({
        pageKey: "explore",
        sectionKey: "article_cards",
        itemKey: String(key),
        type: "article_link",
        label: pair(vi.Explore.exploreLabel, en.Explore.exploreLabel),
        title: pair(String(titleVi), String(titleEn)),
        body: pair(String(bodyVi), String(bodyEn)),
        href: String(href),
        media: {image},
        sortOrder: index + 1
      })
    ),
    ...[
      ["coffee-culture", "/news/coffee-culture", "coffee", vi.Explore.coffeeCultureTitle, en.Explore.coffeeCultureTitle, vi.Explore.coffeeCultureDesc, en.Explore.coffeeCultureDesc],
      ["events", "/news/events", "calendar", vi.Explore.eventsTitle, en.Explore.eventsTitle, vi.Explore.eventsDesc, en.Explore.eventsDesc],
      ["recipes", "/news/recipes", "coffee", vi.Explore.recipesTitle, en.Explore.recipesTitle, vi.Explore.recipesDesc, en.Explore.recipesDesc]
    ].map(([key, href, icon, titleVi, titleEn, bodyVi, bodyEn], index) =>
      item({
        pageKey: "explore",
        sectionKey: "news_categories",
        itemKey: String(key),
        type: "news_link",
        label: pair(vi.Nav.news, en.Nav.news),
        title: pair(String(titleVi), String(titleEn)),
        body: pair(String(bodyVi), String(bodyEn)),
        href: String(href),
        media: {icon},
        sortOrder: index + 1
      })
    ),
    ...exploreCards.map((card, index) =>
      item({
        pageKey: "explore",
        sectionKey: "gallery",
        itemKey: card.id,
        type: "gallery_card",
        label: pair(card.topic.vi, card.topic.en),
        title: pair(card.title.vi, card.title.en),
        body: pair(card.body.vi, card.body.en),
        media: {image: card.image},
        data: {layout: index % 2 === 0 ? "tall" : "short"},
        sortOrder: index + 1
      })
    ),
    ...[
      ["mist-farm", vi.Explore.reel1, en.Explore.reel1, imageLibrary.farm, heroVideo],
      ["campfire", vi.Explore.reel2, en.Explore.reel2, imageLibrary.campfire, "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4"]
    ].map(([key, titleVi, titleEn, poster, src], index) =>
      item({
        pageKey: "explore",
        sectionKey: "reels",
        itemKey: String(key),
        type: "video_reel",
        title: pair(String(titleVi), String(titleEn)),
        media: {poster, src},
        sortOrder: index + 1
      })
    ),
    ...mapLocations.map((location, index) =>
      item({
        pageKey: "explore",
        sectionKey: "map",
        itemKey: location.id,
        type: "map_location",
        title: pair(location.name.vi, location.name.en),
        body: pair(location.note.vi, location.note.en),
        data: {x: location.x, y: location.y},
        sortOrder: index + 1
      })
    ),
    ...[
      ["bold_flavor", "sun", vi.Product.boldFlavorTitle, en.Product.boldFlavorTitle, vi.Product.boldFlavorCopy, en.Product.boldFlavorCopy],
      ["natural_aroma", "leaf", vi.Product.naturalAromaTitle, en.Product.naturalAromaTitle, vi.Product.naturalAromaCopy, en.Product.naturalAromaCopy],
      ["perfect_phin", "coffee", vi.Product.perfectPhinTitle, en.Product.perfectPhinTitle, vi.Product.perfectPhinCopy, en.Product.perfectPhinCopy]
    ].map(([key, icon, titleVi, titleEn, bodyVi, bodyEn], index) =>
      item({
        pageKey: "product-detail",
        sectionKey: "benefits",
        itemKey: String(key),
        type: "benefit",
        title: pair(String(titleVi), String(titleEn)),
        body: pair(String(bodyVi), String(bodyEn)),
        media: {icon},
        sortOrder: index + 1
      })
    ),
    ...[
      ["paragraph-1", vi.About.harmonyPara1, en.About.harmonyPara1],
      ["paragraph-2", vi.About.harmonyPara2, en.About.harmonyPara2],
      ["paragraph-3", vi.About.harmonyPara3, en.About.harmonyPara3]
    ].map(([key, bodyVi, bodyEn], index) =>
      item({
        pageKey: "about",
        sectionKey: "brand_story",
        itemKey: String(key),
        type: "paragraph",
        body: pair(String(bodyVi), String(bodyEn)),
        sortOrder: index + 1
      })
    ),
    item({
      pageKey: "about",
      sectionKey: "vision_mission",
      itemKey: "vision",
      type: "statement",
      title: pair(vi.About.visionTitle, en.About.visionTitle),
      body: pair(vi.About.visionCopy, en.About.visionCopy),
      media: {accent: "earth"},
      sortOrder: 1
    }),
    item({
      pageKey: "about",
      sectionKey: "vision_mission",
      itemKey: "mission",
      type: "statement",
      title: pair(vi.About.missionTitle, en.About.missionTitle),
      body: pair(vi.About.missionTagline, en.About.missionTagline),
      media: {accent: "ember"},
      data: {
        bullets: {
          vi: [vi.About.missionBullet1, vi.About.missionBullet2, vi.About.missionBullet3],
          en: [en.About.missionBullet1, en.About.missionBullet2, en.About.missionBullet3]
        }
      },
      sortOrder: 2
    }),
    ...[
      ["customer", "heart-handshake", vi.About.value1Label, en.About.value1Label, vi.About.value1Copy, en.About.value1Copy],
      ["innovation", "shield-check", vi.About.value2Label, en.About.value2Label, vi.About.value2Copy, en.About.value2Copy],
      ["integrity", "check-circle-2", vi.About.value3Label, en.About.value3Label, vi.About.value3Copy, en.About.value3Copy],
      ["people", "leaf", vi.About.value4Label, en.About.value4Label, vi.About.value4Copy, en.About.value4Copy]
    ].map(([key, icon, titleVi, titleEn, bodyVi, bodyEn], index) =>
      item({
        pageKey: "about",
        sectionKey: "core_values",
        itemKey: String(key),
        type: "value_card",
        title: pair(String(titleVi), String(titleEn)),
        body: pair(String(bodyVi), String(bodyEn)),
        media: {icon},
        sortOrder: index + 1
      })
    ),
    ...[
      ["heat_control", "flame", vi.Philosophy.heatControlLabel, en.Philosophy.heatControlLabel, vi.Philosophy.heatControlDesc, en.Philosophy.heatControlDesc],
      ["time", "clock", vi.Philosophy.timeLabel, en.Philosophy.timeLabel, vi.Philosophy.timeDesc, en.Philosophy.timeDesc],
      ["cooling", "droplets", vi.Philosophy.coolingLabel, en.Philosophy.coolingLabel, vi.Philosophy.coolingDesc, en.Philosophy.coolingDesc]
    ].map(([key, icon, titleVi, titleEn, bodyVi, bodyEn], index) =>
      item({
        pageKey: "about-philosophy",
        sectionKey: "body",
        itemKey: String(key),
        type: "principle",
        title: pair(String(titleVi), String(titleEn)),
        body: pair(String(bodyVi), String(bodyEn)),
        media: {icon},
        sortOrder: index + 1
      })
    ),
    ...storyChapters.map((chapter, index) =>
      item({
        pageKey: "story",
        sectionKey: "chapters",
        itemKey: chapter.id,
        type: "chapter",
        label: chapter.eyebrow,
        title: chapter.title,
        body: pair(chapter.body.vi.join("\n\n"), chapter.body.en.join("\n\n")),
        media: {image: chapter.image},
        data: {
          paragraphs: chapter.body,
          alt: chapter.alt
        },
        sortOrder: index + 1
      })
    ),
    ...storyFeatureCopy.vi.cards.map((card, index) =>
      item({
        pageKey: "story",
        sectionKey: "journey_feature",
        itemKey: `discover-${index + 1}`,
        type: "discover_card",
        label: pair(storyFeatureCopy.vi.discover, storyFeatureCopy.en.discover),
        title: pair(card.title, storyFeatureCopy.en.cards[index].title),
        body: pair(card.body, storyFeatureCopy.en.cards[index].body),
        href: card.href,
        media: {
          image: [products[0]?.images[0] ?? "/sp1.jpeg", imageLibrary.cup, imageLibrary.village][index]
        },
        sortOrder: index + 1
      })
    ),
    ...storyFeatureCopy.vi.newsCards.map((card, index) =>
      item({
        pageKey: "story",
        sectionKey: "journey_feature",
        itemKey: `news-${index + 1}`,
        type: "news_card",
        label: pair(storyFeatureCopy.vi.news, storyFeatureCopy.en.news),
        title: pair(card.title, storyFeatureCopy.en.newsCards[index].title),
        body: pair(card.body, storyFeatureCopy.en.newsCards[index].body),
        href: card.href,
        media: {icon: card.icon},
        sortOrder: 10 + index
      })
    ),
    ...currentExploreCategoryPages(imageLibrary).flatMap((page) =>
      page.sections.map((entry, index) =>
        item({
          pageKey: page.key,
          sectionKey: "body",
          itemKey: `section-${index + 1}`,
          type: "editorial_block",
          title: entry.heading,
          body: entry.text,
          sortOrder: index + 1
        })
      )
    )
  ];

  const reviews = [
    {
      review_key: "review-minh-t",
      product_slug: null,
      name_vi: "Nguyễn Minh T.",
      name_en: "Nguyen Minh T.",
      review_vi: "Phin rất đẹp, cà phê pha ra đúng vị đậm đà, thơm mùi thảo mộc. Sẽ ủng hộ tiếp!",
      review_en: "The phin is beautiful, and the coffee brews bold with a pleasant herbal aroma. I will order again.",
      rating: 5,
      is_verified: true,
      is_visible: true,
      sort_order: 1,
      updated_at: now
    },
    {
      review_key: "review-hoai-an",
      product_slug: null,
      name_vi: "Trần Hoài An",
      name_en: "Tran Hoai An",
      review_vi: "Giao hàng nhanh, đóng gói cẩn thận. Cà phê ngon, hậu ngọt sâu.",
      review_en: "Fast delivery, careful packaging. The coffee is delicious with a deep sweet finish.",
      rating: 5,
      is_verified: true,
      is_visible: true,
      sort_order: 2,
      updated_at: now
    },
    {
      review_key: "review-van-hung",
      product_slug: null,
      name_vi: "Lê Văn Hùng",
      name_en: "Le Van Hung",
      review_vi: "Rất thích hương vị này, uống mỗi sáng tỉnh táo cả ngày.",
      review_en: "I really like this flavor. Drinking it every morning keeps me focused all day.",
      rating: 5,
      is_verified: true,
      is_visible: true,
      sort_order: 3,
      updated_at: now
    }
  ];

  await upsertOrThrow(supabase, "site_pages", pages, {onConflict: "key"});
  await upsertOrThrow(supabase, "site_sections", sections, {onConflict: "page_key,section_key"});
  await upsertOrThrow(supabase, "site_section_items", items, {onConflict: "page_key,section_key,item_key"});
  await upsertOrThrow(supabase, "product_reviews", reviews, {onConflict: "review_key"});

  for (const product of products) {
    const {error} = await supabase
      .from("products")
      .update({
        journey_vi: product.journey.vi,
        journey_en: product.journey.en,
        updated_at: now
      })
      .eq("slug", product.slug);

    if (error) throw error;
  }

  console.log(
    `Imported ${pages.length} pages, ${sections.length} sections, ${items.length} section items, ${reviews.length} reviews and ${products.length} product journeys.`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
