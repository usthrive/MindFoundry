import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const ProofFamily: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background image Ken Burns
  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  // Pricing card appears
  const cardScale = spring({
    frame: frame - fps * 0.5,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const discountOpacity = interpolate(frame, [fps * 2, fps * 3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phone with select-child screenshot
  const phoneOpacity = interpolate(frame, [fps * 1, fps * 1.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const phoneX = interpolate(frame, [fps * 1, fps * 1.8], [60, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Background */}
      <div style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden" }}>
        <Img
          src={staticFile("images/broll-04-happy-family.png")}
          style={{
            width: width * 1.2,
            height: height * 1.2,
            objectFit: "cover",
            transform: `scale(${bgScale})`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Left: pricing info */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 700,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "Inter, -apple-system, sans-serif",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          One account for the{" "}
          <span style={{ color: "#0D9488" }}>whole family</span>
        </div>

        {/* Pricing card */}
        <div
          style={{
            marginTop: 40,
            transform: `scale(${Math.max(0, cardScale)})`,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "30px 40px",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 72, fontWeight: 800, color: "#0D9488", fontFamily: "Inter, sans-serif" }}>
                $7.99
              </span>
              <span style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>
                /month
              </span>
            </div>
            <div
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.7)",
                fontFamily: "Inter, sans-serif",
                marginTop: 8,
              }}
            >
              First child included
            </div>
          </div>

          {/* Discount badge */}
          <div
            style={{
              marginTop: 16,
              opacity: discountOpacity,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #F97316, #EA580C)",
                borderRadius: 12,
                padding: "8px 16px",
                fontSize: 20,
                fontWeight: 700,
                color: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Up to 50% OFF
            </div>
            <span style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>
              for additional children
            </span>
          </div>
        </div>
      </div>

      {/* Right: phone with select-child */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: "50%",
          transform: `translateY(-50%) translateX(${phoneX}px)`,
          opacity: phoneOpacity,
        }}
      >
        <div
          style={{
            width: 300,
            height: 620,
            background: "#1a1a1a",
            borderRadius: 36,
            padding: 7,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ width: "100%", height: "100%", borderRadius: 29, overflow: "hidden" }}>
            <Img
              src={staticFile("screenshots/select-child.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
