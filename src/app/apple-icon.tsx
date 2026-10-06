import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS 홈 화면 아이콘 — 파비콘(icon.svg)과 같은 나침반 모티프 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #12A3A8 0%, #0E7C86 100%)",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.6" stroke="white" strokeWidth="1.6" opacity="0.6" />
          <path d="M15.6 8.4 13.7 13.7 8.4 15.6l1.9-5.3 5.3-1.9Z" fill="white" />
          <circle cx="12" cy="12" r="1.5" fill="#0C444B" />
        </svg>
      </div>
    ),
    size,
  );
}
