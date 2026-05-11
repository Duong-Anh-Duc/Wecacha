import {ImageResponse} from "next/og";
import type {NextRequest} from "next/server";

export const runtime = "edge";

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? "vi";
  const isEn = locale === "en";

  const brand = isEn ? "Wecacha · Son La Coffee" : "Wecacha · Sơn La Coffee";
  const title = isEn
    ? "Son La Coffee — the flavor of Vietnam's northwest mountains"
    : "Cà phê Sơn La, hương vị núi rừng Tây Bắc";

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
          background:
            "linear-gradient(135deg, #061f07 0%, #134A00 48%, #B56500 100%)"
        }}
      >
        <div
          style={{
            fontSize: 28,
            textTransform: "uppercase",
            letterSpacing: 0,
            color: "#f3a734"
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
            fontWeight: 600
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
