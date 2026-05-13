import {ImageResponse} from "next/og";
import type {NextRequest} from "next/server";

export const runtime = "edge";

async function loadVietnameseFont(): Promise<ArrayBuffer | null> {
  try {
    // Fetch Google Fonts CSS with a browser UA to get a TTF/OTF link
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700&subset=vietnamese",
      {headers: {["User-Agent"]: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}}
    ).then((r) => r.text());

    const url = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.(?:ttf|otf|woff))\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "vi";
  const isEn = locale === "en";

  const customTitle = request.nextUrl.searchParams.get("title");
  const customKicker = request.nextUrl.searchParams.get("kicker");

  const brand = customKicker ?? (isEn ? "Wecacha · Son La Coffee" : "Wecacha · Sơn La Coffee");
  const title = customTitle ?? (isEn
    ? "Son La Coffee — the flavor of Vietnam's northwest mountains"
    : "Cà phê Sơn La, hương vị núi rừng Tây Bắc");

  const fontData = await loadVietnameseFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "74px",
          color: "#fffaf0",
          background: "linear-gradient(135deg, #061f07 0%, #134A00 48%, #B56500 100%)"
        }}
      >
        <div
          style={{
            fontSize: 28,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#f3a734",
            fontFamily: fontData ? "Be Vietnam Pro" : "sans-serif"
          }}
        >
          {brand}
        </div>
        <div
          style={{
            marginTop: 22,
            maxWidth: 880,
            fontSize: 78,
            lineHeight: 0.96,
            fontWeight: 700,
            fontFamily: fontData ? "Be Vietnam Pro" : "sans-serif"
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [{name: "Be Vietnam Pro", data: fontData, weight: 700, style: "normal"}]
        : undefined
    }
  );
}
