import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background Ken Burns on celebration image
  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.1], {
    extrapolateRight: "clamp",
  });

  // Title spring
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // Free trial text
  const trialOpacity = interpolate(frame, [fps * 0.8, fps * 1.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Button animation
  const buttonScale = spring({
    frame: frame - fps * 1.5,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // No credit card text
  const noCCOpacity = interpolate(frame, [fps * 2.5, fps * 3.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Final fade out
  const fadeOut = interpolate(frame, [durationInFrames - fps * 1.5, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background gradient animation
  const gradientShift = interpolate(frame, [0, durationInFrames], [0, 20], {
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowPulse = Math.sin(frame / 15) * 0.15 + 0.85;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + gradientShift}deg, #0D1117 0%, #0a1a1a 40%, #0a0a1a 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Teal glow behind content */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(13, 148, 136, 0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: glowPulse,
        }}
      />

      {/* Main CTA text */}
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: "#FFFFFF",
          fontFamily: "Inter, -apple-system, sans-serif",
          transform: `scale(${titleScale})`,
          textAlign: "center",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        Start your{" "}
        <span style={{ color: "#0D9488" }}>free 60-day</span>
        {"\n"}trial today
      </div>

      {/* CTA Button */}
      <div
        style={{
          marginTop: 50,
          transform: `scale(${Math.max(0, buttonScale)})`,
          opacity: trialOpacity,
        }}
      >
        <div
          style={{
            padding: "22px 56px",
            background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
            borderRadius: 16,
            fontSize: 32,
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "Inter, -apple-system, sans-serif",
            boxShadow: `0 4px 30px rgba(13, 148, 136, ${0.3 * glowPulse}), 0 0 60px rgba(13, 148, 136, ${0.15 * glowPulse})`,
            letterSpacing: "-0.01em",
          }}
        >
          Try MindFoundry Free
        </div>
      </div>

      {/* No credit card */}
      <div
        style={{
          marginTop: 24,
          fontSize: 24,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "Inter, -apple-system, sans-serif",
          opacity: noCCOpacity,
        }}
      >
        No credit card required
      </div>

      {/* URL */}
      <div
        style={{
          marginTop: 50,
          fontSize: 30,
          fontWeight: 600,
          color: "#F97316",
          fontFamily: "Inter, -apple-system, sans-serif",
          opacity: noCCOpacity,
          letterSpacing: "0.02em",
        }}
      >
        mindfoundry.app
      </div>

      {/* Floating particles */}
      {Array.from({ length: 35 }).map((_, i) => {
        const speed = 0.4 + (i % 3) * 0.25;
        const particleY = interpolate(
          (frame * speed + i * 15) % (fps * 7),
          [0, fps * 7],
          [1200, -100],
          { extrapolateRight: "clamp" }
        );
        const particleX = Math.sin((frame + i * 25) / 45) * 12;
        const size = 2 + (i % 4);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${4 + (i * 2.7) % 92}%`,
              top: particleY,
              transform: `translateX(${particleX}px)`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#0D9488" : i % 3 === 1 ? "#F97316" : "#8B5CF6",
              opacity: 0.2 + (i % 3) * 0.1,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
