import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const ProblemCost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [1.1, 1], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Price counter animation
  const priceValue = Math.round(
    interpolate(frame, [fps * 0.5, fps * 2], [0, 150], {
      extrapolateRight: "clamp",
    })
  );

  const priceOpacity = interpolate(frame, [fps * 0.3, fps * 0.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          opacity,
        }}
      >
        <Img
          src={staticFile("images/broll-02-erasing.png")}
          style={{
            width: width * 1.2,
            height: height * 1.2,
            objectFit: "cover",
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 100,
          transform: "translateY(-50%)",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: "#F97316",
            fontFamily: "Inter, -apple-system, sans-serif",
            opacity: priceOpacity,
            letterSpacing: "-0.03em",
          }}
        >
          ${priceValue}/hr
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 400,
            color: "rgba(255,255,255,0.85)",
            fontFamily: "Inter, -apple-system, sans-serif",
            marginTop: 20,
            opacity: textOpacity,
            lineHeight: 1.4,
          }}
        >
          Private tutoring is expensive.{"\n"}
          And even then — it's one-size-fits-all.
        </div>
      </div>
    </AbsoluteFill>
  );
};
