import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const FeatureHomework: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phone from right
  const phoneSlide = spring({
    frame: frame - 5,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const phoneX = interpolate(phoneSlide, [0, 1], [200, 0], {
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [fps * 0.5, fps * 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Step indicators
  const steps = [
    { icon: "1", text: "Snap a photo of the problem", delay: fps * 1 },
    { icon: "2", text: "AI extracts the math", delay: fps * 1.8 },
    { icon: "3", text: "Ms. Guide explains step by step", delay: fps * 2.6 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0D1117 0%, #1a0a2a 100%)",
        opacity,
      }}
    >
      {/* Left: Text + steps */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 750,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#8B5CF6",
            fontFamily: "Inter, -apple-system, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 16,
            opacity: textOpacity,
          }}
        >
          Homework Helper
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "Inter, -apple-system, sans-serif",
            lineHeight: 1.2,
            marginBottom: 50,
            opacity: textOpacity,
            letterSpacing: "-0.02em",
          }}
        >
          Snap a photo.{"\n"}
          <span style={{ color: "#8B5CF6" }}>Get expert help</span> in seconds.
        </div>

        {steps.map((step, i) => {
          const stepOpacity = interpolate(frame, [step.delay, step.delay + fps * 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });
          const stepX = interpolate(frame, [step.delay, step.delay + fps * 0.4], [40, 0], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 24,
                opacity: stepOpacity,
                transform: `translateX(${stepX}px)`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontFamily: "Inter, sans-serif",
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              <div
                style={{
                  fontSize: 30,
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                {step.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Phone with school help screenshot */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: "50%",
          transform: `translateY(-50%) translateX(${phoneX}px)`,
        }}
      >
        <div
          style={{
            width: 340,
            height: 700,
            background: "#1a1a1a",
            borderRadius: 40,
            padding: 8,
            boxShadow: "0 20px 80px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255,255,255,0.1)",
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
              src={staticFile("screenshots/school-help.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
