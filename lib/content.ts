import type {Locale} from "@/i18n/routing";

export type Localized<T = string> = Record<Locale, T>;

export type ProductCategory = "beans" | "ground" | "phin" | "gifts";

export type Product = {
  slug: string;
  category: ProductCategory;
  name: Localized;
  short: Localized;
  description: Localized;
  farmerStory: Localized;
  journey: Localized<
    {
      stage: string;
      title: string;
      body: string;
    }[]
  >;
  brewGuide: Localized<string[]>;
  price: number;
  originalPrice?: number;
  weight: string;
  altitude: string;
  roast: Localized;
  origin: Localized;
  notes: Localized<string[]>;
  images: string[];
  featured?: boolean;
};

export type StoryChapter = {
  id: string;
  eyebrow: Localized;
  title: Localized;
  body: Localized<string[]>;
  image: string;
  alt: Localized;
};

export type ExploreCard = {
  id: string;
  topic: Localized;
  title: Localized;
  body: Localized;
  image: string;
};

export type Journey = {
  title: Localized;
  body: Localized;
  image: string;
  href: string;
};

export const imageLibrary = {
  hero:
    "/son_la_bg.png",
  heroPoster:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=86",
  farmer:
    "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=1400&q=82",
  harvest:
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1400&q=82",
  village:
    "/sonla_stilt_village.png",
  brocade:
    "/sonla_brocade.png",
  campfire:
    "/sonla_village_night.png",
  roasted:
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1400&q=82",
  cup:
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1400&q=82",
  beans:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=82",
  beansBowl:
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1400&q=82",
  coffeePour:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=82",
  coffeeRoast:
    "https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=1400&q=82",
  coffeeSet:
    "https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=1400&q=82",
  farm:
    "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1600&q=84",
  mountains:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=84",
  packaging:
    "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=1400&q=82",
  phin:
    "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1400&q=82"
};

export const heroVideo = "/video1.mov";

export const products: Product[] = [
  {
    slug: "mist-valley-arabica",
    category: "beans",
    name: {
      vi: "Arabica Thung Lũng Sương",
      en: "Mist Valley Arabica"
    },
    short: {
      vi: "Hạt rang nguyên chất từ nương cao Sơn La.",
      en: "Whole beans from high Son La farms."
    },
    description: {
      vi: "Lô arabica sáng, sạch và sâu, được rang vừa để giữ vị mận chín, mật ong rừng và hậu ngọt như khói bếp.",
      en: "A bright and deep arabica lot, medium roasted to keep ripe plum, forest honey and a soft fireside finish."
    },
    farmerStory: {
      vi: "Gia đình anh Lò Văn Hòa hái chọn quả chín vào những buổi sớm lạnh. Cà phê được phơi trên giàn cao, tránh mùi đất và giữ độ ngọt tự nhiên.",
      en: "Lo Van Hoa's family handpicks ripe cherries on cold mornings. The coffee dries on raised beds to keep the cup clean and naturally sweet."
    },
    journey: {
      vi: [
        {
          stage: "Nương cao",
          title: "Quả chín chậm trong sương Mộc Châu",
          body: "Arabica được chọn từ những nương cao có đêm lạnh, ngày nắng nhẹ và lớp sương giữ quả chín từ tốn."
        },
        {
          stage: "Sơ chế",
          title: "Phơi giàn để vị ngọt sạch hơn",
          body: "Quả chín được phân loại, sơ chế cẩn thận rồi phơi trên giàn cao để tránh mùi đất và giữ hương trái cây."
        },
        {
          stage: "Rang",
          title: "Rang vừa để giữ mận chín và mật rừng",
          body: "Mẻ rang dừng ở ngưỡng medium, đủ sâu cho thân vị nhưng không che đi độ sáng tự nhiên của vùng cao."
        }
      ],
      en: [
        {
          stage: "High farm",
          title: "Cherries ripen slowly in Moc Chau mist",
          body: "Arabica is selected from high farms where cold nights, soft sun and fog slow down ripening."
        },
        {
          stage: "Process",
          title: "Raised-bed drying keeps sweetness clean",
          body: "Ripe cherries are sorted, processed carefully and dried above the ground to keep fruit notes clear."
        },
        {
          stage: "Roast",
          title: "Medium roast keeps plum and forest honey",
          body: "The roast stops at medium, deep enough for body while preserving the brightness of the highlands."
        }
      ]
    },
    brewGuide: {
      vi: ["15g cà phê", "250ml nước 92°C", "Thời gian pha: 2.5 phút"],
      en: ["15g coffee", "250ml water at 92°C", "Brew time: 2.5 mins"]
    },
    price: 285000,
    originalPrice: 350000,
    weight: "250g",
    altitude: "1.050m - 1.250m",
    roast: {
      vi: "Rang vừa",
      en: "Medium roast"
    },
    origin: {
      vi: "Mộc Châu, Sơn La",
      en: "Moc Chau, Son La"
    },
    notes: {
      vi: ["Mận chín", "Mật ong rừng", "Khói bếp"],
      en: ["Ripe plum", "Forest honey", "Wood smoke"]
    },
    images: ["/sp1.jpeg", "/image1.jpeg", "/image5.jpeg"],
    featured: true
  },
  {
    slug: "forest-phin-blend",
    category: "phin",
    name: {
      vi: "Phin Núi Rừng",
      en: "Forest Phin Blend"
    },
    short: {
      vi: "Đậm, ấm, hợp sữa đặc hoặc uống đen đá.",
      en: "Bold and warm, made for condensed milk or iced black coffee."
    },
    description: {
      vi: "Blend dành cho phin với thân vị dày, vị cacao, đường nâu và một chút thảo mộc khô của vùng núi.",
      en: "A phin blend with a full body, cacao, brown sugar and a trace of dry mountain herbs."
    },
    farmerStory: {
      vi: "Blend kết hợp nhiều lô nhỏ từ các hộ trồng quanh Mường La. Mỗi mẻ được rang chậm để giữ độ đậm mà không cháy gắt.",
      en: "This blend gathers small lots from families around Muong La. Each batch is slow roasted for depth without harsh bitterness."
    },
    journey: {
      vi: [
        {
          stage: "Nương bản",
          title: "Nhiều lô nhỏ ghép thành một vị phin",
          body: "Blend gom các lô từ những hộ quanh Mường La, chọn hạt có thân vị dày và hậu ngọt đủ lâu."
        },
        {
          stage: "Phối trộn",
          title: "Cân lại cacao, đường nâu và thảo mộc khô",
          body: "Từng mẻ được thử nếm để blend không chỉ đậm, mà còn có lớp hương ấm của vùng núi."
        },
        {
          stage: "Nghi thức",
          title: "Rơi từng giọt chậm trong chiếc phin Việt",
          body: "Công thức hướng đến phin: đậm, tròn, sạch, hợp uống đen đá hoặc cùng sữa đặc."
        }
      ],
      en: [
        {
          stage: "Village farms",
          title: "Small lots become one phin profile",
          body: "The blend gathers Muong La family lots selected for body, depth and a lasting sweet finish."
        },
        {
          stage: "Blend",
          title: "Balancing cacao, brown sugar and dry herbs",
          body: "Each batch is cupped so the blend is not only bold, but layered with warm mountain aromatics."
        },
        {
          stage: "Ritual",
          title: "Slow drops through a Vietnamese phin",
          body: "The recipe is built for phin brewing: bold, round, clean, excellent black over ice or with condensed milk."
        }
      ]
    },
    brewGuide: {
      vi: ["Dùng 25g cà phê cho phin 120ml", "Ủ 25 giây với nước nóng", "Rót chậm và uống cùng đá hoặc sữa"],
      en: ["Use 25g coffee for a 120ml phin", "Bloom 25 seconds with hot water", "Drip slowly and serve with ice or milk"]
    },
    price: 195000,
    originalPrice: 250000,
    weight: "250g",
    altitude: "900m - 1.100m",
    roast: {
      vi: "Rang đậm vừa",
      en: "Medium dark roast"
    },
    origin: {
      vi: "Mường La, Sơn La",
      en: "Muong La, Son La"
    },
    notes: {
      vi: ["Cacao", "Đường nâu", "Thảo mộc khô"],
      en: ["Cacao", "Brown sugar", "Dry herbs"]
    },
    images: ["/sp2.jpeg", "/image2.jpeg", "/image3.jpeg"],
    featured: true
  },
  {
    slug: "brocade-gift-set",
    category: "gifts",
    name: {
      vi: "Hộp Quà Thổ Cẩm",
      en: "Brocade Gift Set"
    },
    short: {
      vi: "Bộ quà cà phê và khăn thổ cẩm thủ công.",
      en: "Coffee gift set with a handcrafted brocade cloth."
    },
    description: {
      vi: "Hộp quà giới hạn gồm hai gói cà phê, thiệp kể chuyện mùa vụ và khăn thổ cẩm lấy cảm hứng từ sắc màu bản làng.",
      en: "A limited gift box with two coffees, a harvest story card and a brocade cloth inspired by village colors."
    },
    farmerStory: {
      vi: "Mỗi hộp quà được đóng bởi đội rang tại Sơn La, kèm ghi chú về nông hộ và ngày rang để người nhận biết hành trình của hạt.",
      en: "Every gift box is packed by the Son La roasting team with farm notes and roast dates, so the recipient can trace the bean's journey."
    },
    journey: {
      vi: [
        {
          stage: "Hai vùng",
          title: "Mộc Châu sáng vị, Mường La đậm ấm",
          body: "Hộp quà ghép hai sắc thái Sơn La: arabica sáng trong và blend phin có chiều sâu."
        },
        {
          stage: "Thổ cẩm",
          title: "Màu bản làng đi cùng mùi cà phê mới rang",
          body: "Khăn thổ cẩm và thiệp mùa vụ biến hộp quà thành một lát cắt văn hóa, không chỉ là sản phẩm."
        },
        {
          stage: "Trao tặng",
          title: "Người nhận mở hộp như mở một chuyến đi",
          body: "Mỗi chi tiết giúp người nhận biết hạt đến từ đâu, rang khi nào và nên pha theo cách nào."
        }
      ],
      en: [
        {
          stage: "Two origins",
          title: "Moc Chau brightness, Muong La warmth",
          body: "The box pairs two Son La profiles: a clean arabica and a deeper phin blend."
        },
        {
          stage: "Brocade",
          title: "Village colors meet freshly roasted coffee",
          body: "The brocade cloth and harvest card turn the box into a cultural fragment, not just a product."
        },
        {
          stage: "Gift",
          title: "Opening the box feels like opening a journey",
          body: "Every detail tells where the coffee came from, when it was roasted and how to brew it."
        }
      ]
    },
    brewGuide: {
      vi: ["Pha phin cho blend đậm", "Pha pour-over cho arabica", "Dùng trong 30 ngày sau khi mở túi"],
      en: ["Brew the bold blend with a phin", "Brew arabica as pour-over", "Use within 30 days after opening"]
    },
    price: 620000,
    originalPrice: 800000,
    weight: "2 x 250g",
    altitude: "900m - 1.250m",
    roast: {
      vi: "Hai mức rang",
      en: "Two roast levels"
    },
    origin: {
      vi: "Mộc Châu và Mường La",
      en: "Moc Chau and Muong La"
    },
    notes: {
      vi: ["Mận", "Cacao", "Mật ong", "Khói nhẹ"],
      en: ["Plum", "Cacao", "Honey", "Soft smoke"]
    },
    images: ["/gift_box_brocade.png", "/sonla_brocade.png", "/image1.jpeg"],
    featured: true
  },
  {
    slug: "slow-roast-ground",
    category: "ground",
    name: {
      vi: "Cà Phê Xay Rang Chậm",
      en: "Slow Roast Ground Coffee"
    },
    short: {
      vi: "Xay sẵn cho văn phòng và buổi sáng bận rộn.",
      en: "Pre-ground for offices and slow mornings that start quickly."
    },
    description: {
      vi: "Cà phê xay mộc, giữ thân vị tròn và hương hạt rang ấm. Phù hợp moka pot, phin, French press.",
      en: "Natural ground coffee with a round body and warm roasted aromatics. Works for moka pot, phin and French press."
    },
    farmerStory: {
      vi: "Nguồn hạt được chọn từ các nương có bóng cây che nhẹ. Lịch rang nhỏ giúp cà phê luôn mới khi đến tay người uống.",
      en: "The coffee comes from lightly shaded farms. Small roast schedules keep each bag fresh when it reaches the drinker."
    },
    journey: {
      vi: [
        {
          stage: "Bóng cây",
          title: "Hạt từ nương có bóng che nhẹ",
          body: "Nguồn hạt đến từ các nương có ánh nắng dịu, cho vị hạt rang, caramel và gỗ ấm cân bằng."
        },
        {
          stage: "Xay",
          title: "Xay đúng cỡ cho nhịp sáng bận rộn",
          body: "Cà phê được xay sẵn để giữ sự tiện lợi nhưng vẫn ưu tiên độ tươi trong từng lịch rang nhỏ."
        },
        {
          stage: "Pha",
          title: "Một túi cho phin, moka pot và French press",
          body: "Profile rang vừa đậm giúp sản phẩm linh hoạt, phù hợp văn phòng và những ngày cần bắt đầu nhanh."
        }
      ],
      en: [
        {
          stage: "Shade",
          title: "Beans from lightly shaded farms",
          body: "The coffee comes from gentle shade, giving roasted nuts, caramel and warm wood in balance."
        },
        {
          stage: "Grind",
          title: "Ground for busy morning rhythm",
          body: "It is ground for convenience while small roast schedules keep each bag fresh."
        },
        {
          stage: "Brew",
          title: "One bag for phin, moka pot and French press",
          body: "The medium-dark profile is flexible for offices and mornings that need to begin quickly."
        }
      ]
    },
    brewGuide: {
      vi: ["Bảo quản kín sau khi mở", "Dùng 18g cho 250ml nước", "Hợp pha nóng lẫn pha lạnh"],
      en: ["Seal tightly after opening", "Use 18g for 250ml water", "Good for hot brew and cold brew"]
    },
    price: 215000,
    originalPrice: 280000,
    weight: "250g",
    altitude: "950m - 1.150m",
    roast: {
      vi: "Rang vừa đậm",
      en: "Medium dark roast"
    },
    origin: {
      vi: "Mai Sơn, Sơn La",
      en: "Mai Son, Son La"
    },
    notes: {
      vi: ["Hạt rang", "Caramel", "Gỗ ấm"],
      en: ["Roasted nuts", "Caramel", "Warm wood"]
    },
    images: ["/image5.jpeg", "/image2.jpeg", "/image3.jpeg"]
  }
];

export const storyChapters: StoryChapter[] = [
  {
    id: "soil",
    eyebrow: {
      vi: "Mùa sương",
      en: "Mist season"
    },
    title: {
      vi: "Đất đỏ giữ ấm cho rễ, sương giữ chậm cho quả",
      en: "Red soil warms the roots, mist slows the cherry"
    },
    body: {
      vi: [
        "Ở Sơn La, buổi sáng đến bằng một lớp sương mỏng. Những nương cà phê nằm trên sườn đồi, xen cùng mận, ngô và mái nhà gỗ của bản.",
        "Độ cao và khí hậu khiến quả chín từ tốn. Cái chậm ấy tạo nên vị ngọt sâu, độ chua dịu và hậu vị sạch."
      ],
      en: [
        "In Son La, morning arrives as a thin layer of fog. Coffee farms sit on hillsides beside plum trees, corn fields and wooden village roofs.",
        "Altitude and climate make cherries ripen with patience. That slowness becomes deep sweetness, gentle acidity and a clean finish."
      ]
    },
    image: "/sonla_mist_season.png",
    alt: {
      vi: "Đồi núi mờ sương lúc bình minh",
      en: "Misty mountain hills at dawn"
    }
  },
  {
    id: "harvest",
    eyebrow: {
      vi: "Mùa hái",
      en: "Harvest"
    },
    title: {
      vi: "Người trồng không hái mùa vụ, họ hái từng khoảnh khắc chín",
      en: "Growers do not pick a season, they pick ripe moments"
    },
    body: {
      vi: [
        "Quả chín đỏ được tách khỏi cành bằng tay. Những quả xanh được để lại cho tuần sau, khi nắng và sương đã làm phần đường trong thịt quả đầy hơn.",
        "Đây là công đoạn tốn thời gian, nhưng nó quyết định sự trong trẻo của ly cà phê sau cùng."
      ],
      en: [
        "Red cherries are removed by hand. Green cherries stay on the branch until the next week, when sun and fog have filled the fruit with more sugar.",
        "It is slow work, but it decides the clarity of the final cup."
      ]
    },
    image: "/sonla_harvest.png",
    alt: {
      vi: "Cành cà phê chín được hái bằng tay",
      en: "Ripe coffee cherries picked by hand"
    }
  },
  {
    id: "culture",
    eyebrow: {
      vi: "Đêm bản",
      en: "Village night"
    },
    title: {
      vi: "Thổ cẩm, bếp lửa và những câu chuyện đi qua hương khói",
      en: "Brocade, firelight and stories passing through smoke"
    },
    body: {
      vi: [
        "Sau ngày hái, bản làng sáng lên bằng bếp lửa. Tiếng nói chuyện, màu thổ cẩm, mùi khói và hạt cà phê phơi ngoài hiên hòa thành một ký ức rất Tây Bắc.",
        "Chúng tôi không tách cà phê khỏi văn hóa đã nuôi nó. Mỗi bao hạt đều mang theo dấu vết của nơi chốn."
      ],
      en: [
        "After harvest, the village glows around firelight. Conversation, brocade colors, smoke and drying coffee on the porch become a memory of the northwest.",
        "We do not separate coffee from the culture that raised it. Every bag carries traces of place."
      ]
    },
    image: "/sonla_village_night.png",
    alt: {
      vi: "Ánh lửa trong một đêm bản vùng núi",
      en: "Firelight in a mountain village night"
    }
  },
  {
    id: "roast",
    eyebrow: {
      vi: "Xưởng rang",
      en: "Roastery"
    },
    title: {
      vi: "Rang chậm, nghe tiếng hạt nứt như nghe núi thở",
      en: "Slow roasting, listening to the bean crack like a mountain breath"
    },
    body: {
      vi: [
        "Rang quá nhanh sẽ làm mất đi lớp hương mỏng của sương. Rang quá đậm sẽ che mất đất đỏ, trái chín và mật hoa.",
        "Chúng tôi chọn nhịp rang giữ được độ sâu, nhưng vẫn để người uống nhận ra Sơn La trong từng ngụm."
      ],
      en: [
        "Roasting too quickly erases the delicate layer of mist. Roasting too dark hides red soil, ripe fruit and nectar.",
        "We choose roast curves that keep depth while letting the drinker recognize Son La in every sip."
      ]
    },
    image: "/sonla_roastery.png",
    alt: {
      vi: "Hạt cà phê vừa rang trong ánh sáng ấm",
      en: "Freshly roasted coffee beans in warm light"
    }
  }
];

export const journeys: Journey[] = [
  {
    title: {
      vi: "Từ nương đến xưởng rang",
      en: "From farm to roastery"
    },
    body: {
      vi: "Theo dấu hạt cà phê qua hái chọn, sơ chế, phơi và rang.",
      en: "Follow coffee through picking, processing, drying and roasting."
    },
    image: imageLibrary.farm,
    href: "/explore"
  },
  {
    title: {
      vi: "Những người giữ mùa",
      en: "People who keep the season"
    },
    body: {
      vi: "Gặp các nông hộ và câu chuyện nhỏ phía sau từng mẻ rang.",
      en: "Meet farming families and the small stories behind each roast."
    },
    image: imageLibrary.farmer,
    href: "/story"
  },
  {
    title: {
      vi: "Nghi thức phin trong sương sớm",
      en: "Phin ritual in morning fog"
    },
    body: {
      vi: "Một cách pha chậm để bắt đầu ngày như người vùng cao.",
      en: "A slow brewing ritual for beginning the day like the highlands."
    },
    image: imageLibrary.phin,
    href: "/shop/forest-phin-blend"
  }
];

export const exploreCards: ExploreCard[] = [
  {
    id: "farm",
    topic: {vi: "Nông trại", en: "Farm"},
    title: {vi: "Con đường lên nương cà phê", en: "The road to the coffee farms"},
    body: {
      vi: "Đường đất đỏ đi qua thung lũng, rồi mở ra những sườn đồi có mây thấp như khói.",
      en: "Red dirt roads pass through valleys before opening onto hillsides where clouds sit low like smoke."
    },
    image: imageLibrary.farm
  },
  {
    id: "culture",
    topic: {vi: "Văn hóa", en: "Culture"},
    title: {vi: "Màu thổ cẩm trong hộp quà", en: "Brocade colors inside the gift box"},
    body: {
      vi: "Sắc vải truyền thống gợi cách người Tây Bắc giữ ký ức bằng hoa văn, sợi chỉ và bàn tay.",
      en: "Traditional cloth colors show how northwest communities keep memory through patterns, thread and hands."
    },
    image: imageLibrary.brocade
  },
  {
    id: "processing",
    topic: {vi: "Sơ chế", en: "Processing"},
    title: {vi: "Chậm để vị ngọt hiện ra", en: "Slow enough for sweetness to appear"},
    body: {
      vi: "Phơi trên giàn cao, đảo đều, ghi lại thời tiết từng ngày để hạt khô sạch và ổn định.",
      en: "Raised beds, careful turning and weather notes help the beans dry cleanly and evenly."
    },
    image: imageLibrary.harvest
  },
  {
    id: "people",
    topic: {vi: "Con người", en: "People"},
    title: {vi: "Những bàn tay biết mùa", en: "Hands that understand the season"},
    body: {
      vi: "Người trồng nhận ra quả đã đủ chín bằng màu, độ mềm và ký ức của nhiều mùa trước.",
      en: "Growers read ripeness through color, softness and the memory of many harvests before."
    },
    image: imageLibrary.farmer
  }
];

export const testimonials = [
  {
    name: "Minh Anh",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    bgImage: imageLibrary.coffeeRoast,
    role: {vi: "Nhà rang độc lập", en: "Independent roaster"},
    quote: {
      vi: "Ly arabica có vị sáng nhưng không lạnh. Nó giống một buổi sáng có nắng đi qua sương.",
      en: "The arabica is bright but never cold. It feels like sunlight moving through mist."
    }
  },
  {
    name: "Daniel Lee",
    avatar: "https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?auto=format&fit=crop&w=200&q=80",
    bgImage: imageLibrary.village,
    role: {vi: "Nhiếp ảnh gia du lịch", en: "Travel photographer"},
    quote: {
      vi: "Tôi mua vì bao bì, nhưng quay lại vì hậu vị khói nhẹ rất khó quên.",
      en: "I bought it for the packaging, but came back for the unforgettable soft smoky finish."
    }
  },
  {
    name: "Hà Linh",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bgImage: imageLibrary.cup,
    role: {vi: "Chủ quán cà phê", en: "Cafe owner"},
    quote: {
      vi: "Blend phin đủ đậm cho khách Việt, nhưng vẫn sạch và có câu chuyện riêng.",
      en: "The phin blend is bold enough for Vietnamese guests, yet clean and full of its own story."
    }
  },
  {
    name: "Trần Quốc Hùng",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    bgImage: imageLibrary.coffeePour,
    role: {vi: "Barista 10 năm kinh nghiệm", en: "10-year barista"},
    quote: {
      vi: "Hạt Sơn La rang medium làm tôi ngạc nhiên — độ chua thanh, không gắt, thích hợp pour-over buổi sáng sớm.",
      en: "The medium-roast Sơn La beans surprised me — clean acidity, never harsh, perfect for an early pour-over."
    }
  },
  {
    name: "Sophia Nguyen",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    bgImage: imageLibrary.farm,
    role: {vi: "Food & travel blogger", en: "Food & travel blogger"},
    quote: {
      vi: "Mỗi túi cà phê là một lần kể chuyện — từ vùng đất đến tách uống. Hiếm thương hiệu nào làm được vậy.",
      en: "Every bag tells a story — from the land to the cup. Rare for a brand to pull that off so honestly."
    }
  },
  {
    name: "Nguyễn Văn Bảo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    bgImage: imageLibrary.beans,
    role: {vi: "Nhà thiết kế nội thất", en: "Interior designer"},
    quote: {
      vi: "Đặt từ Hà Nội, cà phê đến tay vẫn còn thơm như vừa rang. Đóng gói cẩn thận, chất lượng đồng nhất.",
      en: "Ordered from Hanoi and it arrived smelling freshly roasted. Careful packaging, consistent quality every time."
    }
  }
];

export const mapLocations = [
  {
    id: "moc-chau",
    name: {vi: "Mộc Châu", en: "Moc Chau"},
    note: {vi: "Nương arabica cao, nhiều sương", en: "High arabica farms with deep fog"},
    x: 58,
    y: 42
  },
  {
    id: "muong-la",
    name: {vi: "Mường La", en: "Muong La"},
    note: {vi: "Blend phin và rang đậm vừa", en: "Phin blends and medium dark roasts"},
    x: 38,
    y: 55
  },
  {
    id: "mai-son",
    name: {vi: "Mai Sơn", en: "Mai Son"},
    note: {vi: "Cà phê xay rang chậm", en: "Slow roast ground coffee"},
    x: 48,
    y: 66
  }
];

export function localized<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string) {
  return products.filter((product) => product.slug !== slug).slice(0, 3);
}

export function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value);
}
