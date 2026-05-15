import type {StoryChapter, Journey} from "./types";
import {imageLibrary} from "./images";

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
