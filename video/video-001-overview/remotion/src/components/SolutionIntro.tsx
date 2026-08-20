import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const SolutionIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const subtitleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 160 },
  });

  const glowOpacity = interpolate(frame, [fps * 0.3, fps * 1.5], [0, 0.7], {
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 500], {
    extrapolateRight: "clamp",
  });

  // Gradient animation
  const gradientAngle = interpolate(frame, [0, fps * 4], [135, 155], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, #0a1a1a 0%, #0D1117 50%, #0a0a1a 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Teal glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, #0D9488 0%, transparent 70%)",
          opacity: glowOpacity,
          filter: "blur(80px)",
        }}
      />

      {/* Brand name */}
      <div
        style={{
          fontSize: 110,
          fontWeight: 800,
          color: "#FFFFFF",
          fontFamily: "Inter, -apple-system, sans-serif",
          transform: `scale(${titleProgress})`,
          textShadow: "0 0 60px rgba(13, 148, 136, 0.6)",
          letterSpacing: "-0.02em",
        }}
      >
        MindFoundry
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 500,
          color: "#0D9488",
          fontFamily: "Inter, -apple-system, sans-serif",
          marginTop: 16,
          transform: `scale(${Math.max(0, subtitleProgress)})`,
          opacity: Math.max(0, subtitleProgress),
          textShadow: "0 0 20px rgba(13, 148, 136, 0.3)",
        }}
      >
        Your child's personal AI math tutor
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: lineWidth,
          height: 4,
          background: "linear-gradient(90deg, transparent, #0D9488, #F97316, transparent)",
          marginTop: 36,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};
