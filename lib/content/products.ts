import type {Product} from "./types";

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
