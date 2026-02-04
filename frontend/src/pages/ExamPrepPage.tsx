/**
 * Exam Prep Flow Page
 *
 * Multi-step flow for the Exam Prep feature:
 * 1. Upload images (5-30)
 * 2. View extracted problems (no selection)
 * 3. Configure test (count, timer)
 * 4. Take the practice test
 * 5. View results
 * 6. Review wrong answers with Ms. Guide
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageUploader, ProblemExtraction, MsGuideCard, ChatInterface } from '@/components/homework';
import type {
  ExtractedProblem,
  GeneratedProblem,
  MsGuideExplanation,
  ChatMessage,
  EvaluationResult,
} from '@/types/homework';
import { getAIService } from '@/services/ai';

type FlowStep = 'upload' | 'review' | 'configure' | 'test' | 'results' | 'explain';

interface TestConfig {
  problemCount: number;
  timerEnabled: boolean;
  timeLimit: number; // in minutes
}

interface TestAnswer {
  problemIndex: number;
  answer: string;
  timeSpent: number;
}

export default function ExamPrepPage() {
  const navigate = useNavigate();
  const { sessionId: _sessionId } = useParams<{ sessionId?: string }>();
  const aiService = getAIService();

  // Flow state
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [extractedProblems, setExtractedProblems] = useState<ExtractedProblem[]>([]);
  const [generatedProblems, setGeneratedProblems] = useState<GeneratedProblem[]>([]);
  const [testConfig, setTestConfig] = useState<TestConfig>({
    problemCount: 10,
    timerEnabled: false,
    timeLimit: 30,
  });

  // Test taking state
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, TestAnswer>>(new Map());
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [problemStartTime, setProblemStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Results state
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  const [wrongAnswerIndices, setWrongAnswerIndices] = useState<number[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [explanations, setExplanations] = useState<Map<number, MsGuideExplanation>>(new Map());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Loading states
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!testConfig.timerEnabled || !testStartTime || currentStep !== 'test') {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - testStartTime.getTime()) / 1000 / 60;
      const remaining = Math.max(0, testConfig.timeLimit - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        handleSubmitTest();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [testConfig.timerEnabled, testStartTime, currentStep, testConfig.timeLimit]);

  // Handle images change
  const handleImagesChange = useCallback((files: File[]) => {
    setUploadedImages(files);
  }, []);

  // Handle extraction start
  const handleStartExtraction = useCallback(async () => {
    if (uploadedImages.length < 5) return;

    setIsExtracting(true);

    try {
      const imageUrls = uploadedImages.map((file) => URL.createObjectURL(file));
      const problems = await aiService.extractProblems(imageUrls);
      setExtractedProblems(problems);
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
      setCurrentStep('review');
    } catch (error) {
      console.error('Failed to extract problems:', error);
    } finally {
      setIsExtracting(false);
    }
  }, [uploadedImages, aiService]);

  // Handle test configuration and generation
  const handleStartTest = useCallback(async () => {
    setIsGenerating(true);

    try {
      const generated = await aiService.generatePracticeTest(
        extractedProblems,
        testConfig.problemCount,
        {
          topicDistribution: {},
          difficultyPreference: 'balanced',
          includeWarmups: false,
          includeChallenges: false,
        }
      );
      setGeneratedProblems(generated);
      setCurrentTestIndex(0);
      setAnswers(new Map());
      setTestStartTime(new Date());
      setProblemStartTime(new Date());
      setCurrentStep('test');
    } catch (error) {
      console.error('Failed to generate test:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [extractedProblems, testConfig, aiService]);

  // Handle answer submission for a single problem
  const handleSubmitAnswer = useCallback(() => {
    const timeSpent = problemStartTime
      ? Math.floor((Date.now() - problemStartTime.getTime()) / 1000)
      : 0;

    setAnswers((prev) => {
      const updated = new Map(prev);
      updated.set(currentTestIndex, {
        problemIndex: currentTestIndex,
        answer: currentAnswer.trim(),
        timeSpent,
      });
      return updated;
    });

    // Move to next problem or finish
    if (currentTestIndex < generatedProblems.length - 1) {
      setCurrentTestIndex((prev) => prev + 1);
      setCurrentAnswer('');
      setProblemStartTime(new Date());
    } else {
      handleSubmitTest();
    }
  }, [currentTestIndex, currentAnswer, problemStartTime, generatedProblems.length]);

  // Handle test submission
  const handleSubmitTest = useCallback(async () => {
    // Save any current answer first
    if (currentAnswer.trim()) {
      const timeSpent = problemStartTime
        ? Math.floor((Date.now() - problemStartTime.getTime()) / 1000)
        : 0;

      answers.set(currentTestIndex, {
        problemIndex: currentTestIndex,
        answer: currentAnswer.trim(),
        timeSpent,
      });
    }

    setIsEvaluating(true);

    try {
      const studentAnswers = generatedProblems.map((_, i) => answers.get(i)?.answer || '');
      const batchResult = await aiService.evaluateAnswers(generatedProblems, studentAnswers);

      setEvaluationResults(batchResult.evaluations);

      // Find wrong answers
      const wrongIndices = batchResult.evaluations
        .map((r, i) => (!r.is_correct ? i : -1))
        .filter((i) => i !== -1);
      setWrongAnswerIndices(wrongIndices);

      setCurrentStep('results');
    } catch (error) {
      console.error('Failed to evaluate test:', error);
    } finally {
      setIsEvaluating(false);
    }
  }, [answers, currentAnswer, currentTestIndex, problemStartTime, generatedProblems, aiService]);

  // Start review of wrong answers
  const handleStartReview = useCallback(async () => {
    if (wrongAnswerIndices.length === 0) return;

    setCurrentReviewIndex(0);
    setChatHistory([]);
    setCurrentStep('explain');

    await generateExplanation(wrongAnswerIndices[0]);
  }, [wrongAnswerIndices]);

  // Generate explanation for a wrong answer
  const generateExplanation = useCallback(async (problemIndex: number) => {
    if (explanations.has(problemIndex)) return;

    setIsExplaining(true);

    try {
      const problem = generatedProblems[problemIndex];
      const studentAnswer = answers.get(problemIndex)?.answer || '';

      const explanation = await aiService.explainConcept(
        {
          problem_number: String(problemIndex + 1),
          problem_text: problem.problem_text,
          problem_type: problem.problem_type,
          difficulty: problem.difficulty,
          grade_level: '3',
          confidence: 1,
        },
        studentAnswer,
        problem.answer,
        '3'
      );

      setExplanations((prev) => new Map(prev).set(problemIndex, explanation));
    } catch (error) {
      console.error('Failed to generate explanation:', error);
    } finally {
      setIsExplaining(false);
    }
  }, [generatedProblems, answers, evaluationResults, explanations, aiService]);

  // Handle chat message in review
  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      role: 'student',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsChatting(true);

    try {
      const problemIndex = wrongAnswerIndices[currentReviewIndex];
      const problem = generatedProblems[problemIndex];
      const studentAnswer = answers.get(problemIndex)?.answer || '';

      const response = await aiService.chat(
        [...chatHistory, userMessage],
        message,
        {
          problem_text: problem.problem_text,
          student_answer: studentAnswer,
          correct_answer: problem.answer,
          grade_level: '3',
          previous_explanation: explanations.get(problemIndex),
        }
      );

      const assistantMessage: ChatMessage = {
        role: 'ms_guide',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get chat response:', error);
    } finally {
      setIsChatting(false);
    }
  }, [chatHistory, wrongAnswerIndices, currentReviewIndex, generatedProblems, answers, explanations, aiService]);

  // Navigate between review items
  const handleNextReview = useCallback(async () => {
    const nextIndex = currentReviewIndex + 1;
    if (nextIndex < wrongAnswerIndices.length) {
      setCurrentReviewIndex(nextIndex);
      setChatHistory([]);
      await generateExplanation(wrongAnswerIndices[nextIndex]);
    }
  }, [currentReviewIndex, wrongAnswerIndices, generateExplanation]);

  const handlePrevReview = useCallback(() => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex((prev) => prev - 1);
      setChatHistory([]);
    }
  }, [currentReviewIndex]);

  // Format time remaining
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate score
  const calculateScore = () => {
    if (evaluationResults.length === 0) return 0;
    const correct = evaluationResults.filter((r) => r.is_correct).length;
    return Math.round((correct / evaluationResults.length) * 100);
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="p-4">
            <div className="mb-6">
              <button
                onClick={() => navigate('/homework')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Prep</h1>
            <p className="text-gray-600 mb-6">
              Upload your homework or study materials and get a practice test based on similar problems!
            </p>

            <ImageUploader
              maxImages={30}
              minImages={5}
              files={uploadedImages}
              onImagesChange={handleImagesChange}
              isUploading={isExtracting}
            />

            {uploadedImages.length >= 5 && !isExtracting && (
              <div className="mt-6">
                <button
                  onClick={handleStartExtraction}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Analyze Materials
                </button>
              </div>
            )}

            {isExtracting && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-blue-600">Ms. Guide is analyzing your materials...</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="p-4">
            <div className="mb-6">
              <button
                onClick={() => setCurrentStep('upload')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Problems Found</h2>
            <p className="text-gray-600 mb-4">
              We found {extractedProblems.length} problems. Your practice test will include similar questions.
            </p>

            <ProblemExtraction
              problems={extractedProblems}
              selectionEnabled={false}
            />

            <div className="mt-6">
              <button
                onClick={() => setCurrentStep('configure')}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Configure Practice Test
              </button>
            </div>
          </div>
        );

      case 'configure':
        return (
          <div className="p-4">
            <div className="mb-6">
              <button
                onClick={() => setCurrentStep('review')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6">Test Settings</h2>

            {/* Problem count */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Problems
              </label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    onClick={() => setTestConfig((prev) => ({ ...prev, problemCount: count }))}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      testConfig.problemCount === count
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer toggle */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Timer</p>
                  <p className="text-sm text-gray-500">Set a time limit for your test</p>
                </div>
                <button
                  onClick={() => setTestConfig((prev) => ({ ...prev, timerEnabled: !prev.timerEnabled }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    testConfig.timerEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      testConfig.timerEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {testConfig.timerEnabled && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <div className="flex gap-2">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setTestConfig((prev) => ({ ...prev, timeLimit: mins }))}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                          testConfig.timeLimit === mins
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {mins}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Start button */}
            <button
              onClick={handleStartTest}
              disabled={isGenerating}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Test...
                </span>
              ) : (
                'Start Practice Test'
              )}
            </button>
          </div>
        );

      case 'test':
        const currentProblem = generatedProblems[currentTestIndex];
        return (
          <div className="p-4">
            {/* Header with progress and timer */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-600">
                Problem {currentTestIndex + 1} of {generatedProblems.length}
              </span>
              {testConfig.timerEnabled && timeRemaining !== null && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  timeRemaining <= 5 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  ⏱️ {formatTime(timeRemaining)}
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${((currentTestIndex + 1) / generatedProblems.length) * 100}%` }}
              />
            </div>

            {/* Problem */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
              <p className="text-lg text-gray-900">{currentProblem?.problem_text}</p>
            </div>

            {/* Answer input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer
              </label>
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                autoFocus
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim()}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {currentTestIndex < generatedProblems.length - 1 ? 'Next Problem' : 'Finish Test'}
            </button>

            {/* Skip button */}
            <button
              onClick={() => {
                setCurrentAnswer('');
                handleSubmitAnswer();
              }}
              className="w-full mt-2 py-3 text-gray-600 font-medium hover:text-gray-800"
            >
              Skip
            </button>
          </div>
        );

      case 'results':
        const score = calculateScore();
        const correctCount = evaluationResults.filter((r) => r.is_correct).length;

        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Test Complete!</h2>

            {/* Score display */}
            <div className={`text-center py-8 rounded-2xl mb-6 ${
              score >= 80 ? 'bg-green-50' : score >= 60 ? 'bg-yellow-50' : 'bg-red-50'
            }`}>
              <div className={`text-6xl font-bold mb-2 ${
                score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score}%
              </div>
              <p className="text-gray-600">
                {correctCount} of {evaluationResults.length} correct
              </p>
              <div className="text-4xl mt-4">
                {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
              </div>
            </div>

            {/* Results breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Results</h3>
              </div>
              <div className="divide-y">
                {evaluationResults.map((result, index) => (
                  <div key={index} className="p-4 flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      result.is_correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {result.is_correct ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 truncate">
                        {generatedProblems[index]?.problem_text}
                      </p>
                      {!result.is_correct && (
                        <p className="text-xs text-gray-500">
                          Your answer: {answers.get(index)?.answer || '(skipped)'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {wrongAnswerIndices.length > 0 && (
                <button
                  onClick={handleStartReview}
                  className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Review Wrong Answers with Ms. Guide
                </button>
              )}
              <button
                onClick={() => {
                  setCurrentStep('configure');
                  setAnswers(new Map());
                  setEvaluationResults([]);
                }}
                className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Take Another Test
              </button>
              <button
                onClick={() => navigate('/homework')}
                className="w-full py-3 text-gray-600 font-medium hover:text-gray-800"
              >
                Done
              </button>
            </div>
          </div>
        );

      case 'explain':
        const reviewProblemIndex = wrongAnswerIndices[currentReviewIndex];
        const reviewProblem = generatedProblems[reviewProblemIndex];
        const reviewExplanation = explanations.get(reviewProblemIndex);
        const studentAnswer = answers.get(reviewProblemIndex)?.answer || '(skipped)';

        return (
          <div className="p-4">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep('results')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Results
              </button>

              <span className="text-sm text-gray-500">
                Review {currentReviewIndex + 1} of {wrongAnswerIndices.length}
              </span>
            </div>

            {/* Problem and answer context */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
              <p className="text-sm text-gray-500 mb-1">Problem</p>
              <p className="text-gray-900 font-medium mb-3">{reviewProblem?.problem_text}</p>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Your answer: </span>
                  <span className="text-red-600 font-medium">{studentAnswer}</span>
                </div>
                <div>
                  <span className="text-gray-500">Correct: </span>
                  <span className="text-green-600 font-medium">{reviewProblem?.answer}</span>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <MsGuideCard
              explanation={reviewExplanation!}
              isLoading={isExplaining}
              showAudio={true}
            />

            {/* Chat section */}
            {!isExplaining && reviewExplanation && (
              <div className="mt-4 bg-white rounded-xl border border-gray-200">
                <div className="p-3 border-b">
                  <h4 className="font-medium text-gray-900">Ask Ms. Guide</h4>
                </div>
                <div className="h-64">
                  <ChatInterface
                    messages={chatHistory}
                    onSendMessage={handleSendMessage}
                    isLoading={isChatting}
                    maxMessages={10}
                    placeholder="Ask about this problem..."
                    context={reviewProblem ? {
                      problem_text: reviewProblem.problem_text,
                      student_answer: studentAnswer || '',
                      correct_answer: reviewProblem.answer || '',
                      grade_level: reviewProblem.grade_level || '3',
                      previous_explanation: reviewExplanation,
                    } : undefined}
                    showContextBanner={false}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={handlePrevReview}
                disabled={currentReviewIndex === 0}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNextReview}
                disabled={currentReviewIndex >= wrongAnswerIndices.length - 1}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isEvaluating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-900 font-medium">Ms. Guide is checking your answers...</p>
          </div>
        </div>
      )}
      {renderStep()}
    </div>
  );
}
