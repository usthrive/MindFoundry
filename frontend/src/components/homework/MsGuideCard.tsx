/**
 * Ms. Guide Card Component
 *
 * Displays AI-generated explanations with the Ms. Guide persona.
 * Includes step-by-step explanations and audio playback.
 */

import { useState } from 'react';
import type { MsGuideExplanation, ExplanationStep } from '../../types/homework';
import { AudioButton } from './AudioButton';

interface MsGuideCardProps {
  /** The explanation to display */
  explanation: MsGuideExplanation;
  /** Whether to show audio button */
  showAudio?: boolean;
  /** Callback when audio is played */
  onAudioPlayed?: () => void;
  /** Whether the card is loading */
  isLoading?: boolean;
}

/**
 * Single explanation step display
 */
function StepCard({ step }: { step: ExplanationStep }) {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
          {step.step_number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 text-sm sm:text-base break-words">{step.instruction}</p>

          {step.visual && (
            <pre className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg font-mono text-xs sm:text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap break-words">
              {step.visual}
            </pre>
          )}

          {step.tip && (
            <div className="mt-2 flex items-start text-xs sm:text-sm text-amber-700 bg-amber-50 p-2 rounded-lg">
              <span className="mr-1 flex-shrink-0">💡</span>
              <span className="break-words">{step.tip}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for the card
 */
function LoadingSkeleton() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 sm:p-6 animate-pulse">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-24 bg-gray-200 rounded-xl" />
        <div className="h-24 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export function MsGuideCard({
  explanation,
  showAudio = true,
  onAudioPlayed,
  isLoading = false,
}: MsGuideCardProps) {
  const [expandedSteps, setExpandedSteps] = useState(true);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Build text for audio
  const buildAudioText = (): string => {
    const parts = [explanation.greeting];

    if (explanation.what_they_did_right) {
      parts.push(explanation.what_they_did_right);
    }

    parts.push(explanation.the_mistake);

    explanation.steps.forEach((step) => {
      parts.push(`Step ${step.step_number}: ${step.instruction}`);
    });

    parts.push(`The correct answer is ${explanation.correct_answer}.`);
    parts.push(explanation.encouragement);

    return parts.join(' ');
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 sm:p-6 shadow-lg overflow-hidden">
      {/* Header with Ms. Guide avatar */}
      <div className="flex items-start gap-3 sm:gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl sm:text-2xl">
            👩‍🏫
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-gray-900">Ms. Guide</h3>
            {showAudio && (
              <AudioButton
                text={buildAudioText()}
                onPlay={onAudioPlayed}
                size="small"
                voiceType="auto"
                label="Listen"
              />
            )}
          </div>
          <p className="text-gray-700 mt-1 text-sm sm:text-base break-words">{explanation.greeting}</p>
        </div>
      </div>

      {/* What they did right */}
      {explanation.what_they_did_right && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 mb-4">
          <div className="flex items-start">
            <span className="text-green-500 mr-2 text-lg sm:text-xl flex-shrink-0">✓</span>
            <div className="min-w-0">
              <p className="font-medium text-green-800 text-sm sm:text-base">What you did well:</p>
              <p className="text-green-700 text-sm sm:text-base break-words">{explanation.what_they_did_right}</p>
            </div>
          </div>
        </div>
      )}

      {/* The mistake */}
      <div className="bg-white rounded-xl p-3 sm:p-4 mb-4 border border-gray-100">
        <div className="flex items-start">
          <span className="text-blue-500 mr-2 text-lg sm:text-xl flex-shrink-0">💭</span>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-sm sm:text-base">Let's see what happened:</p>
            <p className="text-gray-700 mt-1 text-sm sm:text-base break-words">{explanation.the_mistake}</p>
          </div>
        </div>
      </div>

      {/* Steps toggle */}
      <button
        onClick={() => setExpandedSteps(!expandedSteps)}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">
          Step-by-step solution ({explanation.steps.length} steps)
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
            expandedSteps ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Steps - scrollable when many steps */}
      {expandedSteps && (
        <div className="space-y-2 sm:space-y-3 mt-2 max-h-[50vh] overflow-y-auto pr-1">
          {explanation.steps.map((step) => (
            <StepCard key={step.step_number} step={step} />
          ))}
        </div>
      )}

      {/* Correct answer */}
      <div className="mt-4 bg-blue-100 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-blue-900 text-sm sm:text-base">Correct Answer:</span>
          <span className="text-lg sm:text-xl font-bold text-blue-700 break-all">
            {explanation.correct_answer}
          </span>
        </div>
      </div>

      {/* Encouragement */}
      <div className="mt-4 text-center">
        <p className="text-gray-700 italic text-sm sm:text-base break-words">"{explanation.encouragement}"</p>
        <div className="mt-2 text-xl sm:text-2xl">🌟</div>
      </div>
    </div>
  );
}

export default MsGuideCard;
