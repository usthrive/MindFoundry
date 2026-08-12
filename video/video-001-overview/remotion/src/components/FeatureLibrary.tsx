import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const FeatureLibrary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phone from center with scale
  const phoneScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const textOpacity = interpolate(frame, [fps * 0.5, fps * 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Counter
  const videoCount = Math.round(
    interpolate(frame, [fps * 0.3, fps * 1.5], [0, 200], {
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0D1117 0%, #0a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      {/* Center phone */}
      <div
        style={{
          transform: `scale(${phoneScale})`,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 380,
            height: 780,
            background: "#1a1a1a",
            borderRadius: 44,
            padding: 8,
            boxShadow: "0 20px 80px rgba(249, 115, 22, 0.2), 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 36,
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile("screenshots/video-library.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Video count badge */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -80,
            background: "linear-gradient(135deg, #F97316, #EA580C)",
            borderRadius: 20,
            padding: "12px 24px",
            boxShadow: "0 8px 30px rgba(249, 115, 22, 0.4)",
            opacity: textOpacity,
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 800, color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>
            {videoCount}+
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontFamily: "Inter, sans-serif" }}>
            videos
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          textAlign: "center",
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: "#FFFFFF",
            fontFamily: "Inter, -apple-system, sans-serif",
          }}
        >
          Instructional videos that{" "}
          <span style={{ color: "#F97316" }}>unlock as they progress</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
