import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";

// Total audio duration from ElevenLabs voiceover + pauses
// Sum of all scene durations from scene-durations.json + SCENE_PAUSES
const TOTAL_AUDIO_DURATION =
  (10.37 + 0.5) +   // hook
  (11.19 + 0.3) +   // problemCost
  (7.50 + 1.0) +    // problemGap (dramatic pause)
  (4.71 + 0.5) +    // solutionIntro
  (11.17 + 0.3) +   // solutionMethod
  (11.58 + 0.3) +   // demoPractice
  (6.80 + 0.3) +    // demoCelebrate
  (11.35 + 0.3) +   // featureDashboard
  (9.68 + 0.3) +    // featureHomework
  (5.97 + 0.3) +    // featureLibrary
  (11.97 + 0.5) +   // proofNumbers
  (10.77 + 0.5) +   // proofFamily
  (8.66 + 2.0);     // cta (extra for fade)
// Total: ~128.5 seconds

const FPS = 30;
const TOTAL_FRAMES = Math.ceil(TOTAL_AUDIO_DURATION * FPS);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
