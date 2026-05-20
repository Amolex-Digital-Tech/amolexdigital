import { ImageResponse } from "next/og";

import { LOGO_ASSET_PATH, siteConfig } from "@/lib/site";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function TwitterImage() {
  const logoUrl = `${siteConfig.url}${LOGO_ASSET_PATH}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #103D2E 0%, #103D2E 48%, #B29267 100%)",
          color: "#F8FAFC",
          padding: "64px",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(16,61,46,0.4), transparent 32%), radial-gradient(circle at 80% 20%, rgba(178,146,103,0.32), transparent 25%), radial-gradient(circle at 70% 80%, rgba(16,61,46,0.24), transparent 24%)"
          }}
        />
        <div style={{ display: "flex", alignItems: "center", zIndex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Amolex Digital Tech" style={{ height: 80, width: "auto" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900, zIndex: 1 }}>
          <div style={{ fontSize: 76, lineHeight: 1.02, fontWeight: 700 }}>
            Engineering the Future of Digital Innovation
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: "#CBD5E1" }}>
            Startup-grade websites, AI systems, portfolio workflows, admin dashboards, and content operations.
          </div>
        </div>
      </div>
    ),
    size
  );
}
