/**
 * School Help Page
 *
 * Combined page for Homework Helper and Exam Prep with top tab navigation.
 * Provides a unified interface for AI-powered school assistance.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPastHomeworkForTestPrep,
  generateTestFromPastHomework,
  type PastHomeworkSummary,
  type TopicGroup,
} from '@/services/homeworkService';
import type { TestConfiguration } from '@/types/homework';

type TabType = 'homework' | 'exam';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: string;
}

function TabButton({ active, onClick, children, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-2 py-3 px-4 font-semibold transition-all duration-200
        ${active
          ? 'text-purple-700 border-b-3 border-purple-500 bg-purple-50'
          : 'text-gray-500 border-b-3 border-transparent hover:text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      <span>{icon}</span>
      <span>{children}</span>
    </button>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  features: string[];
  buttonText: string;
  onClick: () => void;
  highlight?: boolean;
}

function FeatureCard({ title, description, icon, features, buttonText, onClick, highlight }: FeatureCardProps) {
  return (
    <div className={`
      p-6 rounded-2xl border-2 transition-all duration-200
      ${highlight ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-100'}
    `}>
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center text-sm text-gray-600">
            <span className="w-5 h-5 mr-2 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onClick}
        className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}

// Past Homework Selection Component
interface PastHomeworkSelectorProps {
  topicGroups: TopicGroup[];
  selectedSessions: Set<string>;
  onToggleSession: (sessionId: string) => void;
  onSelectAll: (topic: string) => void;
  onDeselectAll: (topic: string) => void;
}

function PastHomeworkSelector({
  topicGroups,
  selectedSessions,
  onToggleSession,
  onSelectAll,
  onDeselectAll,
}: PastHomeworkSelectorProps) {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getSelectedCountForTopic = (group: TopicGroup) => {
    return group.sessions.filter((s) => selectedSessions.has(s.sessionId)).length;
  };

  return (
    <div className="space-y-3">
      {topicGroups.map((group) => {
        const isExpanded = expandedTopics.has(group.topic);
        const selectedCount = getSelectedCountForTopic(group);

        return (
          <div key={group.topic} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Topic Header */}
            <button
              onClick={() => toggleTopic(group.topic)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📐</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{group.topic}</p>
                  <p className="text-sm text-gray-500">
                    {group.sessionCount} session{group.sessionCount !== 1 ? 's' : ''} •{' '}
                    ~{Math.round(group.totalProblems)} problems
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedCount > 0 && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {selectedCount} selected
                  </span>
                )}
                <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>

            {/* Sessions List */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50 p-3">
                {/* Select All / Deselect All */}
                <div className="flex justify-end gap-2 mb-2">
                  <button
                    onClick={() => onSelectAll(group.topic)}
                    className="text-xs text-purple-600 hover:text-purple-800"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => onDeselectAll(group.topic)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Deselect All
                  </button>
                </div>

                {/* Session Items */}
                <div className="space-y-2">
                  {group.sessions.map((session) => {
                    const isSelected = selectedSessions.has(session.sessionId);
                    return (
                      <label
                        key={session.sessionId}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                          ${isSelected ? 'bg-purple-100 border border-purple-300' : 'bg-white border border-gray-200 hover:border-purple-200'}
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSession(session.sessionId)}
                          className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(session.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.problemCount} problem{session.problemCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SchoolHelpPage() {
  const navigate = useNavigate();
  const { currentChild } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('homework');

  // Past homework state
  const [showPastHomework, setShowPastHomework] = useState(false);
  const [pastHomeworkLoading, setPastHomeworkLoading] = useState(false);
  const [topicGroups, setTopicGroups] = useState<TopicGroup[]>([]);
  const [allSessions, setAllSessions] = useState<PastHomeworkSummary[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [generatingTest, setGeneratingTest] = useState(false);
  const [pastHomeworkError, setPastHomeworkError] = useState<string | null>(null);

  // Fetch past homework when opening the selector
  useEffect(() => {
    if (showPastHomework && currentChild && topicGroups.length === 0) {
      fetchPastHomework();
    }
  }, [showPastHomework, currentChild]);

  const fetchPastHomework = async () => {
    if (!currentChild) return;

    setPastHomeworkLoading(true);
    setPastHomeworkError(null);

    const { sessions, topicGroups: groups, error } = await getPastHomeworkForTestPrep(
      currentChild.id
    );

    if (error) {
      setPastHomeworkError(error);
    } else {
      setAllSessions(sessions);
      setTopicGroups(groups);
    }

    setPastHomeworkLoading(false);
  };

  const handleToggleSession = (sessionId: string) => {
    setSelectedSessions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  const handleSelectAllTopic = (topic: string) => {
    const group = topicGroups.find((g) => g.topic === topic);
    if (group) {
      setSelectedSessions((prev) => {
        const newSet = new Set(prev);
        group.sessions.forEach((s) => newSet.add(s.sessionId));
        return newSet;
      });
    }
  };

  const handleDeselectAllTopic = (topic: string) => {
    const group = topicGroups.find((g) => g.topic === topic);
    if (group) {
      setSelectedSessions((prev) => {
        const newSet = new Set(prev);
        group.sessions.forEach((s) => newSet.delete(s.sessionId));
        return newSet;
      });
    }
  };

  const getTotalSelectedProblems = () => {
    return allSessions
      .filter((s) => selectedSessions.has(s.sessionId))
      .reduce((sum, s) => sum + s.problemCount, 0);
  };

  const handleGenerateFromPast = async () => {
    if (!currentChild || selectedSessions.size === 0) return;

    setGeneratingTest(true);

    const config: TestConfiguration = {
      problemCount: Math.min(20, getTotalSelectedProblems()),
      difficultyPreference: 'balanced',
      timerEnabled: false,
      includeWarmups: true,
      includeChallenges: true,
    };

    const { test, error } = await generateTestFromPastHomework(
      currentChild.id,
      Array.from(selectedSessions),
      config
    );

    setGeneratingTest(false);

    if (test) {
      // Navigate to the exam prep page with the test
      navigate(`/homework/exam-prep/${test.session_id}`);
    } else if (error) {
      setPastHomeworkError(error);
    }
  };

  const handleStartHomeworkHelper = () => {
    navigate('/homework/helper');
  };

  const handleStartExamPrep = () => {
    navigate('/homework/exam-prep');
  };

  const handleViewProgress = () => {
    navigate('/progress?tab=school');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="px-4 py-4 bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">School Help</h1>
          <button
            onClick={handleViewProgress}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="View Progress"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto mt-2">
          <div className="flex border-b border-gray-200">
            <TabButton
              active={activeTab === 'homework'}
              onClick={() => setActiveTab('homework')}
              icon="📝"
            >
              Homework
            </TabButton>
            <TabButton
              active={activeTab === 'exam'}
              onClick={() => setActiveTab('exam')}
              icon="📚"
            >
              Exam Prep
            </TabButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Welcome Message */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">👩‍🏫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Hi{currentChild ? `, ${currentChild.name}` : ''}!
          </h2>
          <p className="text-gray-600">
            I'm Ms. Guide. Let me help you with your school work!
          </p>
        </div>

        {/* Tab Content */}
        {activeTab === 'homework' ? (
          <div className="space-y-4">
            <FeatureCard
              title="Get Homework Help"
              description="Stuck on a problem? Take a photo and I'll explain it step by step."
              icon="📷"
              features={[
                'Take photos of 1-4 homework problems',
                'Get clear, step-by-step explanations',
                'Ask follow-up questions if confused',
                'Listen to explanations with audio',
              ]}
              buttonText="Start Homework Help"
              onClick={handleStartHomeworkHelper}
              highlight
            />

            {/* Tips */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                <span className="mr-2">💡</span>
                Tips for best results
              </h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Use good lighting when taking photos</li>
                <li>• Make sure the whole problem is visible</li>
                <li>• Hold the camera steady to avoid blur</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <FeatureCard
              title="Prepare for a Test"
              description="Upload your homework or notes and get a personalized practice test."
              icon="✏️"
              features={[
                'Upload 5-30 images of study materials',
                'Get a custom practice test on those topics',
                'Review wrong answers with explanations',
                'Track your progress by topic',
              ]}
              buttonText="Start Exam Prep"
              onClick={handleStartExamPrep}
              highlight
            />

            {/* From Past Homework Section */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <button
                onClick={() => setShowPastHomework(!showPastHomework)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="mr-2 text-xl">🔄</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-blue-800">
                      Practice from Past Homework
                    </h3>
                    <p className="text-sm text-blue-600">
                      Saved problems from the last 12 months
                    </p>
                  </div>
                </div>
                <span className={`transform transition-transform text-blue-600 ${showPastHomework ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Expanded Past Homework Selector */}
              {showPastHomework && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  {pastHomeworkLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span className="ml-3 text-gray-600">Loading past homework...</span>
                    </div>
                  ) : pastHomeworkError ? (
                    <div className="text-center py-4">
                      <p className="text-red-600 mb-2">{pastHomeworkError}</p>
                      <button
                        onClick={fetchPastHomework}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Try again
                      </button>
                    </div>
                  ) : topicGroups.length === 0 ? (
                    <div className="text-center py-6">
                      <span className="text-4xl mb-3 block">📭</span>
                      <p className="text-gray-600 mb-2">No past homework found</p>
                      <p className="text-sm text-gray-500">
                        Use Homework Helper first to save problems for later!
                      </p>
                    </div>
                  ) : (
                    <>
                      <PastHomeworkSelector
                        topicGroups={topicGroups}
                        selectedSessions={selectedSessions}
                        onToggleSession={handleToggleSession}
                        onSelectAll={handleSelectAllTopic}
                        onDeselectAll={handleDeselectAllTopic}
                      />

                      {/* Selection Summary & Generate Button */}
                      {selectedSessions.size > 0 && (
                        <div className="mt-4 p-4 bg-purple-100 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-purple-900">
                                {selectedSessions.size} session{selectedSessions.size !== 1 ? 's' : ''} selected
                              </p>
                              <p className="text-sm text-purple-700">
                                ~{getTotalSelectedProblems()} problems available
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedSessions(new Set())}
                              className="text-sm text-purple-600 hover:text-purple-800"
                            >
                              Clear all
                            </button>
                          </div>
                          <button
                            onClick={handleGenerateFromPast}
                            disabled={generatingTest}
                            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            {generatingTest ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Generating Test...
                              </>
                            ) : (
                              <>
                                <span>✨</span>
                                Generate Practice Test
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                <span className="mr-2">💡</span>
                Exam prep tips
              </h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Upload all homework from the unit being tested</li>
                <li>• More problems = better practice test coverage</li>
                <li>• Take the practice test without help first</li>
              </ul>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Your photos are automatically deleted within 24 hours.
          <br />
          Problem content is saved for 12 months to help with future test prep.
        </p>
      </main>
    </div>
  );
}
