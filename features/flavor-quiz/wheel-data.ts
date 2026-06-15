// Shared flavor-wheel hierarchy + labels. Plain data (no client code) so both the
// client wheel and server-side admin stats can import it.
import type {FlavorKey} from "./data";

export type WheelChild = {
  id: string;
  labelKey: string;
  color: string;
  leaves: string[];
};

export type WheelGroup = {
  key: FlavorKey | string;
  labelKey: string;
  color: string;
  weight: number;
  children: WheelChild[];
};

export const wheelGroups: WheelGroup[] = [
  {
    key: "floral",
    labelKey: "flavors.floral.label",
    color: "#ec008c",
    weight: 4,
    children: [
      { id: "blackTea", labelKey: "wheel.blackTea", color: "#ae667d", leaves: [] },
      { id: "flower", labelKey: "wheel.flower", color: "#f05794", leaves: ["chamomile", "rose", "jasmine"] }
    ]
  },
  {
    key: "fruity",
    labelKey: "flavors.fruity.label",
    color: "#ee1d23",
    weight: 18,
    children: [
      { id: "berryFruit", labelKey: "wheel.berryFruit", color: "#ed2c4b", leaves: ["blackberry", "raspberry", "blueberry", "strawberry"] },
      { id: "driedFruit", labelKey: "wheel.driedFruit", color: "#d7444f", leaves: ["raisin", "prune"] },
      { id: "otherFruit", labelKey: "wheel.otherFruit", color: "#f26648", leaves: ["coconut", "cherry", "pomegranate", "pineapple", "grape", "apple", "peach", "pear"] },
      { id: "citrusFruit", labelKey: "wheel.citrusFruit", color: "#fcb914", leaves: ["grapefruit", "orange", "lemon", "lime"] }
    ]
  },
  {
    key: "sourFermented",
    labelKey: "wheel.sourFermented",
    color: "#c2b21a",
    weight: 9,
    children: [
      { id: "sour", labelKey: "wheel.sour", color: "#e2d925", leaves: ["sourAroma", "vinegar", "yogurt", "isovalericAcid", "citricAcid", "malicAcid"] },
      { id: "fermented", labelKey: "wheel.fermented", color: "#b2a113", leaves: ["wine", "whisky", "ferment", "overripe"] }
    ]
  },
  {
    key: "green",
    labelKey: "wheel.green",
    color: "#17803b",
    weight: 10,
    children: [
      { id: "oliveOil", labelKey: "wheel.oliveOil", color: "#a0b127", leaves: [] },
      { id: "raw", labelKey: "wheel.raw", color: "#6c8c39", leaves: [] },
      { id: "green", labelKey: "wheel.green", color: "#21b252", leaves: ["underRipe", "peapod", "fresh", "darkGreen", "vegetative", "hay", "herb"] },
      { id: "beany", labelKey: "wheel.beany", color: "#6f9f95", leaves: [] }
    ]
  },
  {
    key: "other",
    labelKey: "wheel.other",
    color: "#7ba6bc",
    weight: 9,
    children: [
      { id: "earth", labelKey: "wheel.earth", color: "#9bbccc", leaves: ["stale", "cardboard", "papery", "woody", "moldy", "dust", "dampEarth", "animal", "meatyBrothy", "phenolic"] },
      { id: "chemical", labelKey: "wheel.chemical", color: "#61c6dd", leaves: ["bitter", "salty", "rubber", "wintergreen", "petrol", "medicinal"] }
    ]
  },
  {
    key: "roasted",
    labelKey: "flavors.roasted.label",
    color: "#d33727",
    weight: 8,
    children: [
      { id: "tobacco", labelKey: "wheel.tobacco", color: "#cfb480", leaves: [] },
      { id: "pipeTobacco", labelKey: "wheel.pipeTobacco", color: "#bda06a", leaves: [] },
      { id: "roasted", labelKey: "wheel.roasted", color: "#b6804d", leaves: ["acrid", "ashy", "smoke", "toast"] },
      { id: "cereal", labelKey: "wheel.cereal", color: "#e4bd2d", leaves: ["grain", "malt"] }
    ]
  },
  {
    key: "spicy",
    labelKey: "flavors.spicy.label",
    color: "#b90d41",
    weight: 6,
    children: [
      { id: "drySpice", labelKey: "wheel.drySpice", color: "#be404c", leaves: ["licorice", "nutmeg", "cinnamon", "clove"] },
      { id: "pepper", labelKey: "wheel.pepper", color: "#bc4747", leaves: [] },
      { id: "pungent", labelKey: "wheel.pungent", color: "#734864", leaves: [] }
    ]
  },
  {
    key: "nutty",
    labelKey: "flavors.nutty.label",
    color: "#9a7b79",
    weight: 5,
    children: [
      { id: "nut", labelKey: "wheel.nut", color: "#b59287", leaves: ["peanut", "hazelnut", "almond"] },
      { id: "cacao", labelKey: "wheel.cacao", color: "#b37122", leaves: ["cocoa", "darkChocolate"] }
    ]
  },
  {
    key: "sweet",
    labelKey: "flavors.sweet.label",
    color: "#f36421",
    weight: 8,
    children: [
      { id: "brownSugar", labelKey: "wheel.brownSugar", color: "#ce7c92", leaves: ["molasses", "maple", "caramel", "honey"] },
      { id: "vanilla", labelKey: "wheel.vanilla", color: "#f6997d", leaves: [] },
      { id: "vanillin", labelKey: "wheel.vanillin", color: "#f38088", leaves: [] },
      { id: "overallSweet", labelKey: "wheel.overallSweet", color: "#de707a", leaves: [] },
      { id: "sweetAroma", labelKey: "wheel.sweetAroma", color: "#ce3e6c", leaves: [] }
    ]
  }
];

export const wheelShortLabelsVi: Record<string, string> = {
  floral: "HOA",
  fruity: "TRÁI CÂY",
  sourFermented: "LÊN MEN CHUA",
  green: "TƯƠI XANH / THỰC VẬT",
  other: "MÙI VỊ KHÁC",
  roasted: "RANG",
  spicy: "GIA VỊ",
  nutty: "CA CAO & HẠT",
  sweet: "NGỌT"
};

export const wheelShortLabelsEn: Record<string, string> = {
  floral: "FLORAL",
  fruity: "FRUITY",
  sourFermented: "SOUR / FERMENTED",
  green: "GREEN / VEG",
  other: "OTHER",
  roasted: "ROASTED",
  spicy: "SPICES",
  nutty: "NUTTY / COCOA",
  sweet: "SWEET"
};

export const childShortLabelsVi: Record<string, string> = {
  flower: "HOA",
  berryFruit: "QUẢ MỌNG",
  driedFruit: "QUẢ KHÔ",
  otherFruit: "CÁC LOẠI QUẢ KHÁC",
  citrusFruit: "QUẢ CÓ MÚI",
  sour: "CHUA",
  fermented: "LÊN MEN RƯỢU",
  green: "TƯƠI XANH / THỰC VẬT",
  oliveOil: "DẦU Ô LIU",
  raw: "TƯƠI SỐNG",
  beany: "ĐẬU (HẠT)",
  earth: "GIẤY / MỘC",
  animal: "ĐỘNG VẬT",
  bitter: "VỊ ĐẮNG",
  salty: "VỊ MẶN",
  chemical: "HÓA CHẤT",
  tobacco: "THUỐC LÁ",
  pipeTobacco: "THUỐC LÀO",
  roasted: "RANG / NƯỚNG",
  cereal: "NGŨ CỐC",
  drySpice: "GIA VỊ KHÔ",
  pepper: "TIÊU ĐEN",
  pungent: "HĂNG CAY",
  nut: "HẠT",
  cacao: "CA CAO",
  brownSugar: "ĐƯỜNG NÂU",
  vanilla: "QUẢ VA-NI KHÔ",
  vanillin: "KẸO VA-NI",
  overallSweet: "NGỌT",
  sweetAroma: "NGỌT NGÀO",
  blackTea: "TRÀ ĐEN"
};

export const childShortLabelsEn: Record<string, string> = {
  flower: "FLOWER",
  berryFruit: "BERRY",
  driedFruit: "DRIED FRUIT",
  otherFruit: "OTHER FRUIT",
  citrusFruit: "CITRUS FRUIT",
  sour: "SOUR",
  fermented: "ALCOHOL / FERMENTED",
  green: "GREEN / VEG",
  oliveOil: "OLIVE OIL",
  raw: "RAW",
  beany: "BEANY",
  earth: "PAPERY/MUSTY",
  animal: "ANIMALIC",
  bitter: "BITTER",
  salty: "SALTY",
  chemical: "CHEMICAL",
  tobacco: "TOBACCO",
  pipeTobacco: "PIPE TOBACCO",
  roasted: "ROASTED",
  cereal: "CEREAL",
  drySpice: "BROWN SPICE",
  pepper: "PEPPER",
  pungent: "PUNGENT",
  nut: "NUTTY",
  cacao: "COCOA",
  brownSugar: "BROWN SUGAR",
  vanilla: "VANILLA",
  vanillin: "VANILLIN",
  overallSweet: "OVERALL SWEET",
  sweetAroma: "SWEET AROMATICS",
  blackTea: "BLACK TEA"
};

/** Every flavor key that can be recorded/queried (groups + families + leaves). */
export const ALL_FLAVOR_KEYS: string[] = (() => {
  const keys = new Set<string>();
  for (const group of wheelGroups) {
    keys.add(group.key);
    for (const child of group.children) {
      keys.add(child.id);
      for (const leaf of child.leaves) keys.add(leaf);
    }
  }
  return [...keys];
})();
