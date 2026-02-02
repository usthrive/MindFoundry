/**
 * Homework Entry Page
 *
 * Mode selection for Homework Helper vs Exam Prep.
 * Entry point for the AI homework assistance features.
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ModeCardProps {
  title: string;
  description: string;
  icon: string;
  imageCount: string;
  features: string[];
  onClick: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
}

function ModeCard({
  title,
  description,
  icon,
  imageCount,
  features,
  onClick,
  disabled,
  comingSoon,
}: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || comingSoon}
      className={`
        relative w-full p-6 rounded-2xl text-left transition-all duration-200
        ${disabled || comingSoon
          ? 'bg-gray-100 cursor-not-allowed opacity-75'
          : 'bg-white hover:bg-blue-50 hover:shadow-lg cursor-pointer shadow-md'
        }
        border-2 ${disabled || comingSoon ? 'border-gray-200' : 'border-transparent hover:border-blue-200'}
      `}
    >
      {comingSoon && (
        <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
          Coming Soon
        </span>
      )}

      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 mb-3">{description}</p>

          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
            {imageCount}
          </div>

          <ul className="space-y-1">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-gray-600">
                <span className="w-5 h-5 mr-2 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}

export function HomeworkEntryPage() {
  const navigate = useNavigate();
  const { currentChild } = useAuth();

  const handleHomeworkHelper = () => {
    navigate('/homework/helper');
  };

  const handleExamPrep = () => {
    navigate('/homework/exam-prep');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="px-6 py-4 border-b bg-white">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">AI Homework Help</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-2xl mx-auto">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👩‍🏫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Hi{currentChild ? `, ${currentChild.name}` : ''}!
          </h2>
          <p className="text-gray-600">
            I'm Ms. Guide, your math tutor. How can I help you today?
          </p>
        </div>

        {/* Mode Selection */}
        <div className="space-y-4">
          <ModeCard
            title="Homework Helper"
            description="Get help understanding tonight's math homework"
            icon="📝"
            imageCount="1-4 images"
            features={[
              'Take photos of homework problems',
              'Get step-by-step explanations',
              'Ask follow-up questions',
              'Listen to explanations (audio)',
            ]}
            onClick={handleHomeworkHelper}
          />

          <ModeCard
            title="Exam Prep"
            description="Practice for an upcoming test with similar problems"
            icon="📚"
            imageCount="5-30 images"
            features={[
              'Upload a unit worth of homework',
              'Get a personalized practice test',
              'Review wrong answers with Ms. Guide',
              'Track progress by topic',
            ]}
            onClick={handleExamPrep}
          />
        </div>

        {/* Tips Section */}
        <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
            <span className="mr-2">💡</span>
            Tips for best results
          </h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Use good lighting when taking photos</li>
            <li>• Make sure the whole problem is visible</li>
            <li>• Hold the camera steady to avoid blur</li>
            <li>• One page per photo works best</li>
          </ul>
        </div>

        {/* Privacy Note */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Your homework photos are automatically deleted within 24 hours.
          <br />
          We only save the math problems, not the images.
        </p>
      </main>
    </div>
  );
}

export default HomeworkEntryPage;
