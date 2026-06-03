export type FlavorKey =
  | "floral"
  | "fruity"
  | "citrus"
  | "berry"
  | "sweet"
  | "chocolate"
  | "nutty"
  | "spicy"
  | "roasted"
  | "earthy";

export type FlavorScore = Partial<Record<FlavorKey, number>>;

export type FlavorOption = {
  id: string;
  labelKey: string;
  scores: FlavorScore;
};

export type FlavorQuestion = {
  id: string;
  titleKey: string;
  answers: FlavorOption[];
};

export const flavors: {key: FlavorKey; color: string; childKey: string}[] = [
  {key: "floral", color: "#d65f96", childKey: "flavors.floral.children"},
  {key: "fruity", color: "#e15b52", childKey: "flavors.fruity.children"},
  {key: "citrus", color: "#d6b12f", childKey: "flavors.citrus.children"},
  {key: "berry", color: "#b44b73", childKey: "flavors.berry.children"},
  {key: "sweet", color: "#c88335", childKey: "flavors.sweet.children"},
  {key: "chocolate", color: "#8d5f45", childKey: "flavors.chocolate.children"},
  {key: "nutty", color: "#ad8a56", childKey: "flavors.nutty.children"},
  {key: "spicy", color: "#bf5f3f", childKey: "flavors.spicy.children"},
  {key: "roasted", color: "#5f5147", childKey: "flavors.roasted.children"},
  {key: "earthy", color: "#7c735f", childKey: "flavors.earthy.children"}
];

export const questions: FlavorQuestion[] = [
  {
    id: "q1",
    titleKey: "questions.q1.title",
    answers: [
      {id: "q1a", labelKey: "questions.q1.a", scores: {citrus: 1, fruity: 1, floral: 1}},
      {id: "q1b", labelKey: "questions.q1.b", scores: {sweet: 1, chocolate: 1, nutty: 1}},
      {id: "q1c", labelKey: "questions.q1.c", scores: {roasted: 1, chocolate: 1, earthy: 1}},
      {id: "q1d", labelKey: "questions.q1.d", scores: {sweet: 1, nutty: 1, chocolate: 1}}
    ]
  },
  {
    id: "q2",
    titleKey: "questions.q2.title",
    answers: [
      {id: "q2a", labelKey: "questions.q2.a", scores: {fruity: 1, citrus: 1}},
      {id: "q2b", labelKey: "questions.q2.b", scores: {floral: 1}},
      {id: "q2c", labelKey: "questions.q2.c", scores: {chocolate: 1, sweet: 1}},
      {id: "q2d", labelKey: "questions.q2.d", scores: {nutty: 1, roasted: 1}},
      {id: "q2e", labelKey: "questions.q2.e", scores: {roasted: 1, earthy: 1, spicy: 1}}
    ]
  },
  {
    id: "q3",
    titleKey: "questions.q3.title",
    answers: [
      {id: "q3a", labelKey: "questions.q3.a", scores: {floral: 1, fruity: 1, citrus: 1}},
      {id: "q3b", labelKey: "questions.q3.b", scores: {chocolate: 1, nutty: 1, sweet: 1}},
      {id: "q3c", labelKey: "questions.q3.c", scores: {roasted: 1, chocolate: 1, earthy: 1}},
      {id: "q3d", labelKey: "questions.q3.d", scores: {chocolate: 1, sweet: 1, nutty: 1}},
      {id: "q3e", labelKey: "questions.q3.e", scores: {}}
    ]
  },
  {
    id: "q4",
    titleKey: "questions.q4.title",
    answers: [
      {id: "q4a", labelKey: "questions.q4.a", scores: {citrus: 1, floral: 1, fruity: 1}},
      {id: "q4b", labelKey: "questions.q4.b", scores: {sweet: 1, chocolate: 1, nutty: 1}},
      {id: "q4c", labelKey: "questions.q4.c", scores: {roasted: 1, earthy: 1, chocolate: 1}},
      {id: "q4d", labelKey: "questions.q4.d", scores: {fruity: 1, spicy: 1, floral: 1}}
    ]
  },
  {
    id: "q5",
    titleKey: "questions.q5.title",
    answers: [
      {id: "q5a", labelKey: "questions.q5.a", scores: {chocolate: 1, nutty: 1, sweet: 1}},
      {id: "q5b", labelKey: "questions.q5.b", scores: {fruity: 1, floral: 1, spicy: 1}},
      {id: "q5c", labelKey: "questions.q5.c", scores: {roasted: 1, earthy: 1, chocolate: 1}},
      {id: "q5d", labelKey: "questions.q5.d", scores: {floral: 1, citrus: 1, fruity: 1}}
    ]
  },
  {
    id: "q6",
    titleKey: "questions.q6.title",
    answers: [
      {id: "q6a", labelKey: "questions.q6.a", scores: {floral: 1, fruity: 1, citrus: 1}},
      {id: "q6b", labelKey: "questions.q6.b", scores: {sweet: 1, chocolate: 1, nutty: 1}},
      {id: "q6c", labelKey: "questions.q6.c", scores: {roasted: 1, chocolate: 1, earthy: 1}},
      {id: "q6d", labelKey: "questions.q6.d", scores: {}}
    ]
  },
  {
    id: "q7",
    titleKey: "questions.q7.title",
    answers: [
      {id: "q7a", labelKey: "questions.q7.a", scores: {floral: 1, fruity: 1, citrus: 1}},
      {id: "q7b", labelKey: "questions.q7.b", scores: {sweet: 1, chocolate: 1, nutty: 1}},
      {id: "q7c", labelKey: "questions.q7.c", scores: {roasted: 1, chocolate: 1, earthy: 1}},
      {id: "q7d", labelKey: "questions.q7.d", scores: {fruity: 1, spicy: 1, floral: 1}}
    ]
  }
];

export const productKeywords: Record<FlavorKey, string[]> = {
  floral: ["hoa", "floral", "flower", "jasmine", "nhài", "trà"],
  fruity: ["trái cây", "fruit", "fruity", "mận", "đào", "apple", "táo"],
  citrus: ["cam", "chanh", "citrus", "orange", "lemon", "chua"],
  berry: ["berry", "dâu", "mọng", "việt quất", "raspberry"],
  sweet: ["ngọt", "sweet", "mật ong", "honey", "caramel", "đường nâu"],
  chocolate: ["chocolate", "cacao", "cocoa", "socola"],
  nutty: ["hạt", "nut", "nutty", "hạnh nhân", "almond", "óc chó"],
  spicy: ["gia vị", "spice", "spicy", "quế", "tiêu", "thảo mộc"],
  roasted: ["rang", "roast", "roasted", "khói", "smoky", "nướng"],
  earthy: ["đất", "mộc", "earthy", "trầm", "dày"]
};
