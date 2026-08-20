import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [1, 1.12], {
    extrapolateRight: "clamp",
  });

  const translateX = interpolate(frame, [0, durationInFrames], [0, -25], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const vignetteIntensity = interpolate(frame, [0, durationInFrames], [0.4, 0.55], {
    extrapolateRight: "clamp",
  });

  // Text fade in
  const textOpacity = interpolate(frame, [fps * 0.8, fps * 1.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [fps * 0.8, fps * 1.5], [30, 0], {
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
          src={staticFile("images/broll-01-homework-struggle.png")}
          style={{
            width: width * 1.2,
            height: height * 1.2,
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${translateX}px)`,
            transformOrigin: "center center",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,${vignetteIntensity}) 100%),
            linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)
          `,
        }}
      />

      {/* Emotional text overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 100,
          right: 100,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 300,
            color: "rgba(255,255,255,0.9)",
            fontFamily: "Inter, -apple-system, sans-serif",
            lineHeight: 1.3,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          Every night, millions of parents
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "Inter, -apple-system, sans-serif",
            lineHeight: 1.3,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            marginTop: 8,
          }}
        >
          watch their child struggle with math...
        </div>
      </div>
    </AbsoluteFill>
  );
};
