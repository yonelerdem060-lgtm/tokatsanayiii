import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #0f2748 0%, #1e4b8f 55%, #163a73 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.85, letterSpacing: 4, textTransform: "uppercase" }}>
          Tokat Sanayi Sitesi
        </div>
        <div style={{ marginTop: 18, fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          Dükkân ve Usta Rehberi
        </div>
        <div style={{ marginTop: 24, fontSize: 28, opacity: 0.9, maxWidth: 900 }}>
          Merkez, Erbaa, Turhal, Niksar ve tüm Tokat ilçeleri için oto tamir, yedek parça ve
          mobilya esnafı
        </div>
      </div>
    ),
    { ...size },
  );
}
