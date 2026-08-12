import { AbsoluteFill, Audio, Sequence, useVideoConfig, staticFile } from "remotion";
import { HookScene } from "./components/HookScene";
import { ProblemCost } from "./components/ProblemCost";
import { ProblemGap } from "./components/ProblemGap";
import { SolutionIntro } from "./components/SolutionIntro";
import { SolutionMethod } from "./components/SolutionMethod";
import { DemoPractice } from "./components/DemoPractice";
import { DemoCelebrate } from "./components/DemoCelebrate";
import { FeatureDashboard } from "./components/FeatureDashboard";
import { FeatureHomework } from "./components/FeatureHomework";
import { FeatureLibrary } from "./components/FeatureLibrary";
import { ProofNumbers } from "./components/ProofNumbers";
import { ProofFamily } from "./components/ProofFamily";
import { CTAScene } from "./components/CTAScene";

export const PromoVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Real audio durations from ElevenLabs + pause after each scene
  const audioDurations = {
    hook: 10.37 + 0.5,
    problemCost: 11.19 + 0.3,
    problemGap: 7.50 + 1.0,       // Dramatic pause before solution
    solutionIntro: 4.71 + 0.5,
    solutionMethod: 11.17 + 0.3,
    demoPractice: 11.58 + 0.3,
    demoCelebrate: 6.80 + 0.3,
    featureDashboard: 11.35 + 0.3,
    featureHomework: 9.68 + 0.3,
    featureLibrary: 5.97 + 0.3,
    proofNumbers: 11.97 + 0.5,
    proofFamily: 10.77 + 0.5,
    cta: 8.66 + 2.0,              // Extra for fade out
  };

  const toFrames = (seconds: number) => Math.round(seconds * fps);

  // Calculate cumulative scene timings
  let currentFrame = 0;
  const scenes = {
    hook: {
      start: currentFrame,
      duration: toFrames(audioDurations.hook),
    },
    problemCost: {
      start: (currentFrame += toFrames(audioDurations.hook)),
      duration: toFrames(audioDurations.problemCost),
    },
    problemGap: {
      start: (currentFrame += toFrames(audioDurations.problemCost)),
      duration: toFrames(audioDurations.problemGap),
    },
    solutionIntro: {
      start: (currentFrame += toFrames(audioDurations.problemGap)),
      duration: toFrames(audioDurations.solutionIntro),
    },
    solutionMethod: {
      start: (currentFrame += toFrames(audioDurations.solutionIntro)),
      duration: toFrames(audioDurations.solutionMethod),
    },
    demoPractice: {
      start: (currentFrame += toFrames(audioDurations.solutionMethod)),
      duration: toFrames(audioDurations.demoPractice),
    },
    demoCelebrate: {
      start: (currentFrame += toFrames(audioDurations.demoPractice)),
      duration: toFrames(audioDurations.demoCelebrate),
    },
    featureDashboard: {
      start: (currentFrame += toFrames(audioDurations.demoCelebrate)),
      duration: toFrames(audioDurations.featureDashboard),
    },
    featureHomework: {
      start: (currentFrame += toFrames(audioDurations.featureDashboard)),
      duration: toFrames(audioDurations.featureHomework),
    },
    featureLibrary: {
      start: (currentFrame += toFrames(audioDurations.featureHomework)),
      duration: toFrames(audioDurations.featureLibrary),
    },
    proofNumbers: {
      start: (currentFrame += toFrames(audioDurations.featureLibrary)),
      duration: toFrames(audioDurations.proofNumbers),
    },
    proofFamily: {
      start: (currentFrame += toFrames(audioDurations.proofNumbers)),
      duration: toFrames(audioDurations.proofFamily),
    },
    cta: {
      start: (currentFrame += toFrames(audioDurations.proofFamily)),
      duration: toFrames(audioDurations.cta),
    },
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Voiceover narration */}
      <Audio src={staticFile("audio/narration.mp3")} volume={1} />

      {/* Scene 1: Hook */}
      <Sequence from={scenes.hook.start} durationInFrames={scenes.hook.duration}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Problem - Cost */}
      <Sequence from={scenes.problemCost.start} durationInFrames={scenes.problemCost.duration}>
        <ProblemCost />
      </Sequence>

      {/* Scene 3: Problem - Gap */}
      <Sequence from={scenes.problemGap.start} durationInFrames={scenes.problemGap.duration}>
        <ProblemGap />
      </Sequence>

      {/* Scene 4: Solution Intro */}
      <Sequence from={scenes.solutionIntro.start} durationInFrames={scenes.solutionIntro.duration}>
        <SolutionIntro />
      </Sequence>

      {/* Scene 5: Solution Method */}
      <Sequence from={scenes.solutionMethod.start} durationInFrames={scenes.solutionMethod.duration}>
        <SolutionMethod />
      </Sequence>

      {/* Scene 6: Demo Practice */}
      <Sequence from={scenes.demoPractice.start} durationInFrames={scenes.demoPractice.duration}>
        <DemoPractice />
      </Sequence>

      {/* Scene 7: Demo Celebrate */}
      <Sequence from={scenes.demoCelebrate.start} durationInFrames={scenes.demoCelebrate.duration}>
        <DemoCelebrate />
      </Sequence>

      {/* Scene 8: Feature Dashboard */}
      <Sequence from={scenes.featureDashboard.start} durationInFrames={scenes.featureDashboard.duration}>
        <FeatureDashboard />
      </Sequence>

      {/* Scene 9: Feature Homework */}
      <Sequence from={scenes.featureHomework.start} durationInFrames={scenes.featureHomework.duration}>
        <FeatureHomework />
      </Sequence>

      {/* Scene 10: Feature Library */}
      <Sequence from={scenes.featureLibrary.start} durationInFrames={scenes.featureLibrary.duration}>
        <FeatureLibrary />
      </Sequence>

      {/* Scene 11: Proof Numbers */}
      <Sequence from={scenes.proofNumbers.start} durationInFrames={scenes.proofNumbers.duration}>
        <ProofNumbers />
      </Sequence>

      {/* Scene 12: Proof Family */}
      <Sequence from={scenes.proofFamily.start} durationInFrames={scenes.proofFamily.duration}>
        <ProofFamily />
      </Sequence>

      {/* Scene 13: CTA */}
      <Sequence from={scenes.cta.start} durationInFrames={scenes.cta.duration}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
