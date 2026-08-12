import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const ProblemGap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const line1Opacity = interpolate(frame, [fps * 0.3, fps * 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const line2Opacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const line2Y = interpolate(frame, [fps * 1.5, fps * 2.5], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Fade out at end for dramatic pause
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: opacity * fadeOut,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 400,
            color: "rgba(255,255,255,0.8)",
            fontFamily: "Inter, -apple-system, sans-serif",
            lineHeight: 1.4,
            opacity: line1Opacity,
          }}
        >
          You can't see what they don't understand.
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "#F97316",
            fontFamily: "Inter, -apple-system, sans-serif",
            marginTop: 30,
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
            lineHeight: 1.3,
          }}
        >
          You just see the tears.
        </div>
      </div>
    </AbsoluteFill>
  );
};
