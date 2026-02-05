/**
 * Homework Helper Flow Page
 *
 * Multi-step flow for the Homework Helper feature:
 * 1. Upload images (1-4)
 * 2. View extracted problems & select which to get help with
 * 3. View explanations from Ms. Guide
 * 4. Chat for follow-up questions
 */

import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageUploader, ProblemExtraction, MsGuideCard, ChatInterface } from '@/components/homework';
import type {
  ExtractedProblem,
  MsGuideExplanation,
  ChatMessage,
} from '@/types/homework';
import { getAIService } from '@/services/ai';

type FlowStep = 'upload' | 'select' | 'explain' | 'chat';

export default function HomeworkHelperPage() {
  const navigate = useNavigate();
  const { sessionId: _sessionId } = useParams<{ sessionId?: string }>();
  const aiService = getAIService();

  // Flow state
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [extractedProblems, setExtractedProblems] = useState<ExtractedProblem[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [explanations, setExplanations] = useState<Map<number, MsGuideExplanation>>(new Map());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Loading states
  const [isExtracting, setIsExtracting] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  // Handle images change
  const handleImagesChange = useCallback((files: File[]) => {
    setUploadedImages(files);
  }, []);

  // Convert File to base64 data URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle extraction start
  const handleStartExtraction = useCallback(async () => {
    if (uploadedImages.length === 0) return;

    setIsExtracting(true);

    try {
      // Convert images to base64 data URLs for the Edge Function
      // (blob URLs don't work server-side)
      const imageUrls = await Promise.all(
        uploadedImages.map((file) => fileToBase64(file))
      );

      // Extract problems from images
      const problems = await aiService.extractProblems(imageUrls);
      setExtractedProblems(problems);

      // Move to selection step
      setCurrentStep('select');
    } catch (error) {
      console.error('Failed to extract problems:', error);
      // TODO: Show error state
    } finally {
      setIsExtracting(false);
    }
  }, [uploadedImages, aiService]);

  // Handle problem selection completion
  const handleSelectionComplete = useCallback(async () => {
    if (selectedIndices.length === 0) return;

    setCurrentStep('explain');
    setCurrentProblemIndex(0);

    // Start generating explanation for first selected problem
    await generateExplanation(selectedIndices[0]);
  }, [selectedIndices]);

  // Generate explanation for a problem
  const generateExplanation = useCallback(async (problemIndex: number) => {
    if (explanations.has(problemIndex)) return;

    setIsExplaining(true);

    try {
      const problem = extractedProblems[problemIndex];
      // For homework helper, we don't have a student answer yet
      // We're just explaining the concept/solution
      const explanation = await aiService.explainConcept(
        problem,
        '', // No student answer in helper mode
        '', // Correct answer will be determined by AI
        problem.grade_level
      );

      setExplanations((prev) => new Map(prev).set(problemIndex, explanation));
    } catch (error) {
      console.error('Failed to generate explanation:', error);
    } finally {
      setIsExplaining(false);
    }
  }, [extractedProblems, explanations, aiService]);

  // Handle chat message
  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      role: 'student',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsChatting(true);

    try {
      const currentProblem = extractedProblems[selectedIndices[currentProblemIndex]];
      const currentExplanation = explanations.get(selectedIndices[currentProblemIndex]);

      // Get student_answer from extracted problem (populated by verification if student wrote an answer)
      // Get correct_answer from the explanation (Ms. Guide determined the answer)
      const response = await aiService.chat(
        [...chatHistory, userMessage],
        message,
        {
          problem_text: currentProblem.problem_text,
          student_answer: currentProblem.student_answer || '',
          correct_answer: currentExplanation?.correct_answer || '',
          grade_level: currentProblem.grade_level,
          previous_explanation: currentExplanation,
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
  }, [chatHistory, extractedProblems, selectedIndices, currentProblemIndex, explanations, aiService]);

  // Navigate to next/previous problem
  const handleNextProblem = useCallback(async () => {
    const nextIndex = currentProblemIndex + 1;
    if (nextIndex < selectedIndices.length) {
      setCurrentProblemIndex(nextIndex);
      setChatHistory([]); // Clear chat for new problem
      await generateExplanation(selectedIndices[nextIndex]);
    }
  }, [currentProblemIndex, selectedIndices, generateExplanation]);

  const handlePrevProblem = useCallback(() => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex((prev) => prev - 1);
      setChatHistory([]); // Clear chat for new problem
    }
  }, [currentProblemIndex]);

  // Start chat for current problem
  const handleStartChat = useCallback(() => {
    setCurrentStep('chat');
  }, []);

  // Go back to explanations from chat
  const handleBackToExplanation = useCallback(() => {
    setCurrentStep('explain');
  }, []);

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

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Homework Helper</h1>
            <p className="text-gray-600 mb-6">
              Upload photos of your homework and Ms. Guide will help explain each problem!
            </p>

            <ImageUploader
              maxImages={4}
              minImages={1}
              files={uploadedImages}
              onImagesChange={handleImagesChange}
              isUploading={isExtracting}
            />

            {uploadedImages.length > 0 && !isExtracting && (
              <div className="mt-6">
                <button
                  onClick={handleStartExtraction}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Find Problems
                </button>
              </div>
            )}

            {isExtracting && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-blue-600">Ms. Guide is reading your homework...</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'select':
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

            <h2 className="text-xl font-bold text-gray-900 mb-2">Select Problems</h2>
            <p className="text-gray-600 mb-4">
              Choose which problems you'd like help with (up to 10)
            </p>

            <ProblemExtraction
              problems={extractedProblems}
              selectedIndices={selectedIndices}
              onSelectionChange={setSelectedIndices}
              selectionEnabled={true}
              maxSelection={10}
            />

            {selectedIndices.length > 0 && (
              <div className="fixed bottom-24 left-0 right-0 p-4 bg-white border-t">
                <button
                  onClick={handleSelectionComplete}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Get Help with {selectedIndices.length} Problem{selectedIndices.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        );

      case 'explain':
        const currentExplanation = explanations.get(selectedIndices[currentProblemIndex]);
        const currentProblem = extractedProblems[selectedIndices[currentProblemIndex]];

        return (
          <div className="p-4">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep('select')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <span className="text-sm text-gray-500">
                Problem {currentProblemIndex + 1} of {selectedIndices.length}
              </span>
            </div>

            {/* Problem context */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
              <p className="text-sm text-gray-500 mb-1">Problem</p>
              <p className="text-gray-900 font-medium">{currentProblem?.problem_text}</p>
            </div>

            {/* Explanation */}
            <MsGuideCard
              explanation={currentExplanation!}
              isLoading={isExplaining}
              showAudio={true}
            />

            {/* Actions */}
            <div className="mt-4 space-y-3">
              <button
                onClick={handleStartChat}
                disabled={isExplaining}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                Ask Ms. Guide a Question
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handlePrevProblem}
                  disabled={currentProblemIndex === 0}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextProblem}
                  disabled={currentProblemIndex >= selectedIndices.length - 1}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Next Problem
                </button>
              </div>
            </div>
          </div>
        );

      case 'chat':
        const chatProblem = extractedProblems[selectedIndices[currentProblemIndex]];
        const chatExplanation = explanations.get(selectedIndices[currentProblemIndex]);
        // Pass actual context values so Ms. Guide knows what problem is being discussed:
        // - student_answer: from extracted problem (if student wrote an answer)
        // - correct_answer: from Ms. Guide's explanation
        // - previous_explanation: for continuity in follow-up questions
        const chatContext = chatProblem ? {
          problem_text: chatProblem.problem_text,
          student_answer: chatProblem.student_answer || '',
          correct_answer: chatExplanation?.correct_answer || '',
          grade_level: chatProblem.grade_level,
          previous_explanation: chatExplanation,
        } : undefined;

        return (
          <div className="flex flex-col h-[calc(100vh-5rem)]">
            <div className="p-4 border-b bg-white">
              <button
                onClick={handleBackToExplanation}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Explanation
              </button>
            </div>

            <ChatInterface
              messages={chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isChatting}
              maxMessages={20}
              placeholder="Ask Ms. Guide anything about this problem..."
              context={chatContext}
              showContextBanner={true}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderStep()}
    </div>
  );
}
