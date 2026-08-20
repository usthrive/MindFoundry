import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const DemoPractice: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phone mockup slide in
  const phoneSlide = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const phoneX = interpolate(phoneSlide, [0, 1], [200, 0], {
    extrapolateRight: "clamp",
  });

  // Left text
  const textOpacity = interpolate(frame, [fps * 0.5, fps * 1.2], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Hint bubble appears later
  const hintOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const hintScale = spring({
    frame: frame - fps * 3,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // Subtle phone float
  const floatY = Math.sin(frame / 20) * 5;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0D1117 0%, #0a1a1a 100%)",
      }}
    >
      {/* Left side: description */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 700,
          opacity: textOpacity,
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
          }}
        >
          Daily Practice
        </div>
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
          Solve problems at their own pace
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "Inter, -apple-system, sans-serif",
            marginTop: 20,
            lineHeight: 1.5,
          }}
        >
          When stuck, Ms. Guide steps in with hints
          that build thinking, not dependency.
        </div>
      </div>

      {/* Right side: phone with study page screenshot */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: "50%",
          transform: `translateY(calc(-50% + ${floatY}px)) translateX(${phoneX}px)`,
        }}
      >
        {/* Phone frame */}
        <div
          style={{
            width: 340,
            height: 700,
            background: "#1a1a1a",
            borderRadius: 40,
            padding: 8,
            boxShadow: "0 20px 80px rgba(13, 148, 136, 0.3), 0 0 0 1px rgba(255,255,255,0.1)",
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
              src={staticFile("screenshots/study-page.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Ms. Guide hint bubble */}
        <div
          style={{
            position: "absolute",
            left: -200,
            top: 200,
            opacity: hintOpacity,
            transform: `scale(${Math.max(0, hintScale)})`,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              borderRadius: 20,
              padding: "16px 24px",
              maxWidth: 220,
              boxShadow: "0 8px 30px rgba(139, 92, 246, 0.4)",
            }}
          >
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontFamily: "Inter, sans-serif" }}>
              Ms. Guide says:
            </div>
            <div style={{ fontSize: 18, color: "#FFFFFF", fontWeight: 600, fontFamily: "Inter, sans-serif", marginTop: 4 }}>
              "Try adding the ones first!"
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
