import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const SolutionMethod: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Left side - world map image
  const imageScale = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  // Right side text stagger
  const line1Opacity = interpolate(frame, [fps * 0.3, fps * 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const line2Opacity = interpolate(frame, [fps * 1, fps * 1.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Counter for countries
  const countryCount = Math.round(
    interpolate(frame, [fps * 0.5, fps * 1.5], [0, 50], {
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Split layout */}
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* Left: World map image */}
        <div
          style={{
            width: "45%",
            height: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Img
            src={staticFile("images/broll-03-world-map.png")}
            style={{
              width: "120%",
              height: "120%",
              objectFit: "cover",
              transform: `scale(${imageScale})`,
              transformOrigin: "center center",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, transparent 60%, #0D1117 100%)",
            }}
          />
        </div>

        {/* Right: Method text */}
        <div
          style={{
            width: "55%",
            height: "100%",
            background: "#0D1117",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#0D9488",
              fontFamily: "Inter, -apple-system, sans-serif",
              opacity: line1Opacity,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}
          >
            The Kumon Method
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: "Inter, -apple-system, sans-serif",
              opacity: line1Opacity,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Proven in {countryCount}+ countries
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Inter, -apple-system, sans-serif",
              marginTop: 24,
              opacity: line2Opacity,
              lineHeight: 1.4,
            }}
          >
            Combined with AI that teaches thinking —{" "}
            <span style={{ color: "#F97316", fontWeight: 600 }}>
              never just gives answers
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
