import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const DemoCelebrate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Confetti particles
  const confettiColors = ["#F97316", "#0D9488", "#8B5CF6", "#FBBF24", "#EC4899", "#10B981"];

  // Title spring
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // Phone with dashboard screenshot
  const phoneScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Badge/streak counter
  const badgeOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const streakCount = Math.round(
    interpolate(frame, [fps * 2, fps * 3.5], [0, 100], {
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0D1117 0%, #1a0a2a 50%, #0a1a1a 100%)",
        opacity,
      }}
    >
      {/* Confetti particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const speed = 0.3 + (i % 4) * 0.2;
        const particleY = interpolate(
          (frame * speed + i * 20) % (fps * 8),
          [0, fps * 8],
          [-50, 1200],
          { extrapolateRight: "clamp" }
        );
        const particleX = Math.sin((frame + i * 30) / 30) * 20;
        const rotation = (frame * 3 + i * 45) % 360;
        const size = 6 + (i % 5) * 3;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${3 + (i * 3.3) % 94}%`,
              top: particleY,
              transform: `translateX(${particleX}px) rotate(${rotation}deg)`,
              width: size,
              height: size * 0.6,
              borderRadius: 2,
              background: confettiColors[i % confettiColors.length],
              opacity: 0.6,
            }}
          />
        );
      })}

      {/* Center content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "#FFFFFF",
            fontFamily: "Inter, -apple-system, sans-serif",
            transform: `scale(${titleScale})`,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          Every win gets{" "}
          <span style={{ color: "#FBBF24" }}>celebrated</span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 60,
            marginTop: 50,
            opacity: badgeOpacity,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, fontWeight: 800, color: "#F97316", fontFamily: "Inter, sans-serif" }}>
              {streakCount}
            </div>
            <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>
              Day Streak
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, fontWeight: 800, color: "#0D9488", fontFamily: "Inter, sans-serif" }}>
              10
            </div>
            <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>
              Badges Earned
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, fontWeight: 800, color: "#8B5CF6", fontFamily: "Inter, sans-serif" }}>
              97%
            </div>
            <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>
              Accuracy
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
