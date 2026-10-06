import { ImageResponse } from "next/og";

export const alt = "(sample) ExpertMatch — 전문가 상담·매칭 플랫폼";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * 링크 공유 미리보기 이미지 (빌드 시 생성).
 * 기본 내장 글꼴에는 한글이 없으므로 문구는 영문으로 구성한다.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #16294B 0%, #0C1B36 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: "#0E7C86",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            E
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>Expert Match</div>
          <div style={{ fontSize: 20, color: "#98ACC9", marginLeft: 6, letterSpacing: 4 }}>SAMPLE</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Find the right expert.
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: "#5FD3D0" }}>
            Book in 30 seconds.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#C5D1E4" }}>
          <div>Startup · Marketing · Investment · Tax · Legal</div>
          <div style={{ fontWeight: 700, color: "white" }}>by MIRAE AI LAB</div>
        </div>
      </div>
    ),
    size,
  );
}
