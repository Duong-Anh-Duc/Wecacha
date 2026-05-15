import type {ExploreCard} from "./types";
import {imageLibrary} from "./images";

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
