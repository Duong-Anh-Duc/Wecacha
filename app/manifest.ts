import type {MetadataRoute} from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sơn La Coffee · Wecacha",
    short_name: "Wecacha",
    description: "Cà phê Sơn La rang thủ công, sinh trưởng giữa sương núi Tây Bắc 1.050m.",
    start_url: "/vi",
    display: "standalone",
    background_color: "#fffaf0",
    theme_color: "#134A00",
    lang: "vi",
    categories: ["food", "shopping"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "256x256",
        type: "image/x-icon"
      },
      {
        src: "/wecacha-favicon.png",
        sizes: "256x256",
        type: "image/png"
      },
      {
        src: "/image.png",
        sizes: "1143x1143",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
