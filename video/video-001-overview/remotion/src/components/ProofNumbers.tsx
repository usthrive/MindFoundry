import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const ProofNumbers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  const stats = [
    { value: 26, suffix: "", label: "Mastery Levels", color: "#0D9488", delay: fps * 0.3 },
    { value: 5200, suffix: "", label: "Worksheets", color: "#F97316", delay: fps * 1 },
    { value: 52000, suffix: "", label: "Problems", color: "#8B5CF6", delay: fps * 1.8 },
  ];

  // Bottom tagline
  const taglineOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0D1117 0%, #0a0a1a 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 100,
          alignItems: "center",
        }}
      >
        {stats.map((stat, i) => {
          const count = Math.round(
            interpolate(frame, [stat.delay, stat.delay + fps * 1.5], [0, stat.value], {
              extrapolateRight: "clamp",
            })
          );

          const itemOpacity = interpolate(frame, [stat.delay, stat.delay + fps * 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });

          const itemScale = interpolate(frame, [stat.delay, stat.delay + fps * 0.3], [0.8, 1], {
            extrapolateRight: "clamp",
          });

          const formatted = count >= 1000
            ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
            : `${count}`;

          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                opacity: itemOpacity,
                transform: `scale(${itemScale})`,
              }}
            >
              <div
                style={{
                  fontSize: 100,
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: "Inter, -apple-system, sans-serif",
                  letterSpacing: "-0.03em",
                  textShadow: `0 0 40px ${stat.color}40`,
                }}
              >
                {formatted}{stat.suffix}
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "Inter, -apple-system, sans-serif",
                  marginTop: 8,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 60,
          fontSize: 40,
          fontWeight: 500,
          color: "rgba(255,255,255,0.85)",
          fontFamily: "Inter, -apple-system, sans-serif",
          opacity: taglineOpacity,
          textAlign: "center",
        }}
      >
        From counting to calculus
      </div>

      {/* Level progression bar */}
      <div
        style={{
          marginTop: 30,
          display: "flex",
          gap: 4,
          opacity: taglineOpacity,
        }}
      >
        {["7A", "6A", "5A", "4A", "3A", "2A", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"].map((level, i) => {
          const barWidth = interpolate(
            frame,
            [fps * 3.5 + i * 2, fps * 3.5 + i * 2 + fps * 0.3],
            [0, 1],
            { extrapolateRight: "clamp" }
          );

          return (
            <div
              key={level}
              style={{
                width: 50,
                height: 8,
                borderRadius: 4,
                background: `linear-gradient(90deg, #0D9488, #F97316)`,
                opacity: 0.3 + barWidth * 0.7,
                transform: `scaleX(${barWidth})`,
                transformOrigin: "left",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
