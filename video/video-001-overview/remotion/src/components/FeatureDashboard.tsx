import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const FeatureDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phone slides up
  const phoneY = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const phoneTranslateY = interpolate(phoneY, [0, 1], [100, 0], {
    extrapolateRight: "clamp",
  });

  // Text stagger
  const titleOpacity = interpolate(frame, [fps * 0.3, fps * 0.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const featureItems = [
    { text: "Accuracy trends", delay: fps * 1 },
    { text: "Time spent analysis", delay: fps * 1.5 },
    { text: "Focus metrics", delay: fps * 2 },
    { text: "Session history", delay: fps * 2.5 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0D1117 0%, #0a1a1a 100%)",
        opacity,
      }}
    >
      {/* Left: Phone with progress dashboard */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: `translateY(calc(-50% + ${phoneTranslateY}px))`,
        }}
      >
        <div
          style={{
            width: 360,
            height: 740,
            background: "#1a1a1a",
            borderRadius: 40,
            padding: 8,
            boxShadow: "0 20px 80px rgba(13, 148, 136, 0.25), 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 32,
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile("screenshots/progress-dashboard.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </div>
        </div>
      </div>

      {/* Right: Feature list */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 800,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#0D9488",
            fontFamily: "Inter, -apple-system, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 16,
            opacity: titleOpacity,
          }}
        >
          Parent Dashboard
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#FFFFFF",
            fontFamily: "Inter, -apple-system, sans-serif",
            lineHeight: 1.2,
            marginBottom: 40,
            opacity: titleOpacity,
            letterSpacing: "-0.02em",
          }}
        >
          You see{" "}
          <span style={{ color: "#F97316" }}>everything</span>
        </div>

        {featureItems.map((item, i) => {
          const itemOpacity = interpolate(frame, [item.delay, item.delay + fps * 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });
          const itemX = interpolate(frame, [item.delay, item.delay + fps * 0.4], [30, 0], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#0D9488",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: 32,
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontWeight: 400,
                }}
              >
                {item.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
