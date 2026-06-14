// Per-flavor quiz content (bilingual). Each main wheel group has its own quiz.
// Flow: user clicks a flavor on the wheel -> the matching quiz opens ->
// finishing the quiz shows that flavor's "gu cà phê" description.

import type {Locale} from "@/i18n/routing";

export type LocalizedText = {vi: string; en: string};

export type QuizAnswer = {
  id: string;
  label: LocalizedText;
};

export type QuizQuestion = {
  id: string;
  title: LocalizedText;
  answers: QuizAnswer[];
};

export type FlavorQuiz = {
  /** Wheel group key (matches wheelGroups[].key) */
  groupKey: string;
  name: LocalizedText;
  /** short line shown on the quiz intro */
  intro: LocalizedText;
  questions: QuizQuestion[];
  result: {
    title: LocalizedText;
    description: LocalizedText;
    traits: LocalizedText[];
  };
};

export function tx(text: LocalizedText, locale: Locale) {
  return locale === "vi" ? text.vi : text.en;
}

const a = (id: string, vi: string, en: string): QuizAnswer => ({id, label: {vi, en}});

export const flavorQuizzes: Record<string, FlavorQuiz> = {
  floral: {
    groupKey: "floral",
    name: {vi: "Hoa", en: "Floral"},
    intro: {
      vi: "Bạn nghiêng về hương hoa tinh tế. Trả lời vài câu để hiểu rõ gu của mình.",
      en: "You lean toward delicate floral aromas. Answer a few questions to map your taste."
    },
    questions: [
      {
        id: "f1",
        title: {vi: "Buổi sáng lý tưởng của bạn có mùi gì?", en: "What does your ideal morning smell like?"},
        answers: [
          a("a", "Hoa nhài, trà thơm", "Jasmine and fragrant tea"),
          a("b", "Hoa hồng, phấn nhẹ", "Rose and soft powder"),
          a("c", "Cỏ cây tươi mát", "Fresh greenery")
        ]
      },
      {
        id: "f2",
        title: {vi: "Bạn thích tách cà phê thế nào?", en: "How do you like your cup?"},
        answers: [
          a("a", "Thanh, nhẹ, ít đắng", "Light, clean, low bitterness"),
          a("b", "Hậu vị ngọt dịu kéo dài", "Gentle lingering sweetness"),
          a("c", "Thơm nức ngay từ lúc ngửi", "Aromatic from the first sniff")
        ]
      },
      {
        id: "f3",
        title: {vi: "Pha kiểu nào hợp bạn nhất?", en: "Which brew suits you best?"},
        answers: [
          a("a", "Pour-over / V60", "Pour-over / V60"),
          a("b", "Trà lạnh ủ chậm", "Slow cold brew"),
          a("c", "Espresso nhẹ", "A light espresso")
        ]
      }
    ],
    result: {
      title: {vi: "Gu Hoa cỏ tinh tế", en: "Delicate Floral Palate"},
      description: {
        vi: "Bạn yêu sự nhẹ nhàng, thanh tao. Cà phê hợp gu bạn thường có tầng hương hoa nhài, trà và hậu vị ngọt mảnh.",
        en: "You love elegance and lightness. Your coffee tends to carry jasmine, tea-like notes and a fine sweet finish."
      },
      traits: [
        {vi: "Hương hoa nhài, trà", en: "Jasmine & tea aromatics"},
        {vi: "Axit thấp, êm dịu", en: "Low acidity, smooth"},
        {vi: "Hậu vị sạch, tinh tế", en: "Clean, refined finish"}
      ]
    }
  },

  fruity: {
    groupKey: "fruity",
    name: {vi: "Trái cây", en: "Fruity"},
    intro: {
      vi: "Bạn thích sự tươi tắn của trái cây. Cùng khám phá gu của bạn nhé.",
      en: "You enjoy bright, fruity character. Let's map out your taste."
    },
    questions: [
      {
        id: "fr1",
        title: {vi: "Loại trái cây bạn mê nhất?", en: "Your favourite fruit family?"},
        answers: [
          a("a", "Mọng nước: dâu, việt quất", "Berries: strawberry, blueberry"),
          a("b", "Nhiệt đới: dứa, xoài", "Tropical: pineapple, mango"),
          a("c", "Quả khô: nho khô, mận", "Dried: raisin, prune")
        ]
      },
      {
        id: "fr2",
        title: {vi: "Bạn thích độ chua thế nào?", en: "How much acidity do you like?"},
        answers: [
          a("a", "Chua sáng, sống động", "Bright and lively"),
          a("b", "Chua vừa, cân bằng", "Moderate and balanced"),
          a("c", "Ít chua, ngọt trái cây", "Low acidity, fruity sweetness")
        ]
      },
      {
        id: "fr3",
        title: {vi: "Khi nào bạn uống cà phê này?", en: "When do you sip this coffee?"},
        answers: [
          a("a", "Buổi sáng cho tỉnh táo", "Morning wake-up"),
          a("b", "Giữa chiều thư giãn", "Afternoon relax"),
          a("c", "Cà phê đá giải nhiệt", "Iced, to cool down")
        ]
      }
    ],
    result: {
      title: {vi: "Gu Trái cây tươi sáng", en: "Bright Fruity Palate"},
      description: {
        vi: "Bạn bị cuốn hút bởi tầng hương trái cây sống động và độ chua sáng. Đây là gu của những ly cà phê đầy sức sống.",
        en: "You're drawn to vivid fruit notes and bright acidity — the taste of lively, expressive coffees."
      },
      traits: [
        {vi: "Hương quả mọng, nhiệt đới", en: "Berry & tropical notes"},
        {vi: "Độ chua sáng, sạch", en: "Bright, clean acidity"},
        {vi: "Hậu vị tươi", en: "Juicy finish"}
      ]
    }
  },

  sourFermented: {
    groupKey: "sourFermented",
    name: {vi: "Lên men chua", en: "Sour / Fermented"},
    intro: {
      vi: "Bạn tò mò với hương lên men độc đáo. Khám phá gu của bạn.",
      en: "You're curious about funky fermented notes. Let's explore your taste."
    },
    questions: [
      {
        id: "sf1",
        title: {vi: "Hương nào khiến bạn thích thú?", en: "Which note intrigues you?"},
        answers: [
          a("a", "Rượu vang, whisky", "Wine, whisky"),
          a("b", "Sữa chua, lên men nhẹ", "Yogurt, light ferment"),
          a("c", "Trái chín, mật lên men", "Ripe fruit, fermented honey")
        ]
      },
      {
        id: "sf2",
        title: {vi: "Bạn đánh giá vị lạ thế nào?", en: "How do you feel about bold, unusual flavours?"},
        answers: [
          a("a", "Càng độc đáo càng thích", "The wilder the better"),
          a("b", "Thích nhưng vừa phải", "Like it, but in moderation"),
          a("c", "Chỉ cần thoáng qua là đủ", "Just a hint is enough")
        ]
      },
      {
        id: "sf3",
        title: {vi: "Bạn thuộc kiểu người nào?", en: "Which describes you?"},
        answers: [
          a("a", "Thích thử nghiệm cái mới", "Always trying new things"),
          a("b", "Sành cà phê đặc sản", "A specialty coffee geek"),
          a("c", "Thích câu chuyện sau hạt cà phê", "Love the story behind the bean")
        ]
      }
    ],
    result: {
      title: {vi: "Gu Lên men phá cách", en: "Adventurous Fermented Palate"},
      description: {
        vi: "Bạn không ngại những hương vị độc đáo. Cà phê lên men tự nhiên với tầng hương rượu, trái chín là sân chơi của bạn.",
        en: "You're not afraid of bold flavours. Naturally fermented coffees with winey, ripe-fruit notes are your playground."
      },
      traits: [
        {vi: "Hương rượu vang, whisky", en: "Winey, whisky notes"},
        {vi: "Lên men trái chín", en: "Ripe fermented fruit"},
        {vi: "Cá tính mạnh", en: "Strong character"}
      ]
    }
  },

  green: {
    groupKey: "green",
    name: {vi: "Tươi xanh / Thực vật", en: "Green / Vegetative"},
    intro: {
      vi: "Bạn thích nét tươi xanh, mộc mạc. Cùng tìm hiểu gu của bạn.",
      en: "You like fresh, green and herbal character. Let's find your taste."
    },
    questions: [
      {
        id: "g1",
        title: {vi: "Mùi thiên nhiên bạn yêu thích?", en: "Favourite natural scent?"},
        answers: [
          a("a", "Cỏ tươi mới cắt", "Freshly cut grass"),
          a("b", "Thảo mộc, lá trà xanh", "Herbs, green tea leaves"),
          a("c", "Đậu, hạt tươi", "Beans, fresh seeds")
        ]
      },
      {
        id: "g2",
        title: {vi: "Bạn thích cảm giác nào trong miệng?", en: "Preferred mouthfeel?"},
        answers: [
          a("a", "Nhẹ và tươi", "Light and fresh"),
          a("b", "Mượt, hơi dầu", "Silky, a touch oily"),
          a("c", "Chát nhẹ, sạch", "Lightly grassy, clean")
        ]
      },
      {
        id: "g3",
        title: {vi: "Phong cách sống của bạn?", en: "Your lifestyle?"},
        answers: [
          a("a", "Gần gũi thiên nhiên", "Close to nature"),
          a("b", "Ăn uống lành mạnh", "Healthy eating"),
          a("c", "Tối giản, mộc mạc", "Minimal and rustic")
        ]
      }
    ],
    result: {
      title: {vi: "Gu Tươi xanh mộc mạc", en: "Fresh Green Palate"},
      description: {
        vi: "Bạn yêu sự nguyên bản, tươi mới. Cà phê hợp gu bạn mang nét thảo mộc, tươi xanh và cảm giác sạch sẽ.",
        en: "You value freshness and authenticity. Your coffee carries herbal, green notes and a clean feel."
      },
      traits: [
        {vi: "Hương thảo mộc, cỏ tươi", en: "Herbal, grassy notes"},
        {vi: "Tươi, sạch", en: "Fresh and clean"},
        {vi: "Mộc mạc, nguyên bản", en: "Rustic, authentic"}
      ]
    }
  },

  other: {
    groupKey: "other",
    name: {vi: "Mùi vị khác", en: "Other"},
    intro: {
      vi: "Bạn có gu khám phá những hương vị khác lạ. Cùng tìm hiểu nhé.",
      en: "You have a taste for the unusual. Let's explore."
    },
    questions: [
      {
        id: "o1",
        title: {vi: "Hương nào gây ấn tượng với bạn?", en: "Which note stands out to you?"},
        answers: [
          a("a", "Giấy, gỗ, mộc", "Paper, wood, musty"),
          a("b", "Hóa chất nhẹ, khoáng", "Light chemical, mineral"),
          a("c", "Da thuộc, động vật", "Leather, animalic")
        ]
      },
      {
        id: "o2",
        title: {vi: "Bạn uống cà phê vì điều gì?", en: "Why do you drink coffee?"},
        answers: [
          a("a", "Trải nghiệm hương vị lạ", "Unusual flavour experiences"),
          a("b", "Sự phức tạp, nhiều tầng", "Complexity and layers"),
          a("c", "Tìm hiểu nguồn gốc", "Understanding origins")
        ]
      },
      {
        id: "o3",
        title: {vi: "Bạn mô tả mình là?", en: "You'd describe yourself as?"},
        answers: [
          a("a", "Người khám phá", "An explorer"),
          a("b", "Người sành sỏi", "A connoisseur"),
          a("c", "Người hoài niệm", "A nostalgic soul")
        ]
      }
    ],
    result: {
      title: {vi: "Gu Khám phá độc đáo", en: "Curious Explorer Palate"},
      description: {
        vi: "Bạn thích những hương vị ngoài lối mòn. Gu của bạn dành cho những tách cà phê phức tạp, nhiều tầng và đầy bất ngờ.",
        en: "You love flavours off the beaten path. Your taste favours complex, layered and surprising cups."
      },
      traits: [
        {vi: "Hương phức tạp, khác lạ", en: "Complex, unusual aromatics"},
        {vi: "Nhiều tầng vị", en: "Layered profile"},
        {vi: "Tinh thần khám phá", en: "Exploratory spirit"}
      ]
    }
  },

  roasted: {
    groupKey: "roasted",
    name: {vi: "Rang", en: "Roasted"},
    intro: {
      vi: "Bạn thích vị rang đậm, ấm áp. Cùng khám phá gu của bạn.",
      en: "You like deep, warm roasted character. Let's map your taste."
    },
    questions: [
      {
        id: "r1",
        title: {vi: "Mức rang bạn thích?", en: "Preferred roast level?"},
        answers: [
          a("a", "Rang đậm, khói", "Dark, smoky"),
          a("b", "Rang vừa, ngũ cốc", "Medium, cereal-like"),
          a("c", "Thuốc lá, gỗ nướng", "Tobacco, toasted wood")
        ]
      },
      {
        id: "r2",
        title: {vi: "Bạn uống thế nào?", en: "How do you take it?"},
        answers: [
          a("a", "Đen đậm, mạnh", "Strong and black"),
          a("b", "Phin truyền thống", "Traditional Vietnamese phin"),
          a("c", "Cà phê sữa đậm đà", "Rich coffee with milk")
        ]
      },
      {
        id: "r3",
        title: {vi: "Cảm giác bạn tìm kiếm?", en: "What feeling are you after?"},
        answers: [
          a("a", "Tỉnh táo, mạnh mẽ", "Bold and energising"),
          a("b", "Ấm áp, hoài niệm", "Warm and nostalgic"),
          a("c", "Đậm đà, đầy đặn", "Full-bodied richness")
        ]
      }
    ],
    result: {
      title: {vi: "Gu Rang đậm mạnh mẽ", en: "Bold Roasted Palate"},
      description: {
        vi: "Bạn thích sự đậm đà, mạnh mẽ. Cà phê hợp gu bạn có vị rang sâu, khói nhẹ và body đầy đặn.",
        en: "You love intensity and strength. Your coffee shows deep roast, gentle smoke and a full body."
      },
      traits: [
        {vi: "Vị rang sâu, khói", en: "Deep roast, smoke"},
        {vi: "Body đầy đặn", en: "Full body"},
        {vi: "Mạnh mẽ, tỉnh táo", en: "Bold and energising"}
      ]
    }
  },

  spicy: {
    groupKey: "spicy",
    name: {vi: "Gia vị", en: "Spices"},
    intro: {
      vi: "Bạn thích nét cay nồng của gia vị. Cùng tìm hiểu gu của bạn.",
      en: "You enjoy warm spice character. Let's find your taste."
    },
    questions: [
      {
        id: "sp1",
        title: {vi: "Gia vị bạn yêu thích?", en: "Favourite spice?"},
        answers: [
          a("a", "Quế, đinh hương", "Cinnamon, clove"),
          a("b", "Tiêu đen, hồi", "Black pepper, anise"),
          a("c", "Nhục đậu khấu", "Nutmeg")
        ]
      },
      {
        id: "sp2",
        title: {vi: "Bạn thích cảm giác nào?", en: "Which sensation do you like?"},
        answers: [
          a("a", "Cay ấm, nồng", "Warm, pungent"),
          a("b", "Hăng nhẹ, thú vị", "Lightly sharp, intriguing"),
          a("c", "Ngọt cay hài hòa", "Sweet-spice harmony")
        ]
      },
      {
        id: "sp3",
        title: {vi: "Món bạn thường thèm?", en: "What do you crave?"},
        answers: [
          a("a", "Đồ ăn đậm đà", "Bold, savoury food"),
          a("b", "Bánh quế, gừng", "Cinnamon & ginger bakes"),
          a("c", "Trà gia vị (chai)", "Spiced chai")
        ]
      }
    ],
    result: {
      title: {vi: "Gu Gia vị nồng ấm", en: "Warm Spiced Palate"},
      description: {
        vi: "Bạn bị thu hút bởi nét cay nồng, ấm áp. Cà phê hợp gu bạn có hương quế, tiêu, gia vị khô đầy quyến rũ.",
        en: "You're drawn to warm, pungent spice. Your coffee carries cinnamon, pepper and dry-spice charm."
      },
      traits: [
        {vi: "Hương quế, tiêu, đinh hương", en: "Cinnamon, pepper, clove"},
        {vi: "Cay ấm, nồng", en: "Warm, pungent"},
        {vi: "Quyến rũ, ấm áp", en: "Charming and warm"}
      ]
    }
  },

  nutty: {
    groupKey: "nutty",
    name: {vi: "Ca cao & Hạt", en: "Nutty / Cocoa"},
    intro: {
      vi: "Bạn thích vị hạt và ca cao quen thuộc. Cùng khám phá gu của bạn.",
      en: "You love familiar nutty, cocoa notes. Let's map your taste."
    },
    questions: [
      {
        id: "n1",
        title: {vi: "Hương nào khiến bạn ấm lòng?", en: "Which note comforts you?"},
        answers: [
          a("a", "Socola đậm", "Dark chocolate"),
          a("b", "Hạnh nhân, hạt phỉ", "Almond, hazelnut"),
          a("c", "Đậu phộng rang", "Roasted peanut")
        ]
      },
      {
        id: "n2",
        title: {vi: "Bạn thích vị thế nào?", en: "Preferred taste?"},
        answers: [
          a("a", "Ngọt béo, dịu", "Sweet, creamy, mellow"),
          a("b", "Đậm, ít chua", "Rich, low acidity"),
          a("c", "Cân bằng, dễ uống", "Balanced and easy")
        ]
      },
      {
        id: "n3",
        title: {vi: "Cà phê với bạn là?", en: "Coffee for you is?"},
        answers: [
          a("a", "Niềm vui mỗi ngày", "A daily pleasure"),
          a("b", "Khoảnh khắc thư giãn", "A moment of calm"),
          a("c", "Thói quen thân thuộc", "A familiar ritual")
        ]
      }
    ],
    result: {
      title: {vi: "Gu Ca cao & Hạt êm dịu", en: "Mellow Nutty-Cocoa Palate"},
      description: {
        vi: "Bạn yêu sự ấm áp, quen thuộc. Cà phê hợp gu bạn ngọt dịu với hương socola, hạnh nhân và hạt rang.",
        en: "You love warmth and familiarity. Your coffee is mellow-sweet with chocolate, almond and roasted-nut notes."
      },
      traits: [
        {vi: "Hương socola, hạt", en: "Chocolate & nut notes"},
        {vi: "Ngọt dịu, ít chua", en: "Mellow-sweet, low acidity"},
        {vi: "Dễ uống, cân bằng", en: "Easy, balanced"}
      ]
    }
  },

  sweet: {
    groupKey: "sweet",
    name: {vi: "Ngọt", en: "Sweet"},
    intro: {
      vi: "Bạn thích hậu vị ngọt ngào. Cùng tìm hiểu gu của bạn.",
      en: "You love sweet, comforting finishes. Let's find your taste."
    },
    questions: [
      {
        id: "sw1",
        title: {vi: "Vị ngọt bạn mê?", en: "Your kind of sweetness?"},
        answers: [
          a("a", "Caramen, đường nâu", "Caramel, brown sugar"),
          a("b", "Mật ong, si-rô", "Honey, syrup"),
          a("c", "Vani ngọt ngào", "Sweet vanilla")
        ]
      },
      {
        id: "sw2",
        title: {vi: "Bạn thích hậu vị ra sao?", en: "Preferred aftertaste?"},
        answers: [
          a("a", "Ngọt kéo dài", "Long, sweet finish"),
          a("b", "Ngọt dịu vừa phải", "Gently sweet"),
          a("c", "Ngọt béo như kẹo", "Candy-like sweetness")
        ]
      },
      {
        id: "sw3",
        title: {vi: "Bạn thường thêm gì?", en: "What do you usually add?"},
        answers: [
          a("a", "Uống nguyên bản, đủ ngọt tự nhiên", "Black — naturally sweet enough"),
          a("b", "Chút sữa đặc", "A touch of condensed milk"),
          a("c", "Sữa tươi, đường", "Fresh milk and sugar")
        ]
      }
    ],
    result: {
      title: {vi: "Gu Ngọt ngào dễ chịu", en: "Sweet & Comforting Palate"},
      description: {
        vi: "Bạn tìm kiếm sự ngọt ngào, dễ chịu. Cà phê hợp gu bạn có hương caramen, mật ong và hậu vị ngọt mượt.",
        en: "You seek sweetness and comfort. Your coffee carries caramel, honey and a smooth sweet finish."
      },
      traits: [
        {vi: "Hương caramen, mật ong", en: "Caramel & honey notes"},
        {vi: "Hậu vị ngọt mượt", en: "Smooth sweet finish"},
        {vi: "Dễ chịu, dễ uống", en: "Comforting and easy"}
      ]
    }
  }
};

export function getFlavorQuiz(groupKey: string): FlavorQuiz | undefined {
  return flavorQuizzes[groupKey];
}
