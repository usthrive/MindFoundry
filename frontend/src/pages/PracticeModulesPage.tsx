/**
 * Practice Modules Page
 *
 * Landing page after selecting a child, showing simplified practice modules:
 * - Kumon-Style Practice
 * - School Help (Homework & Exam Prep)
 * - Video Lessons
 * - My Progress (with tabs for Kumon and School Help)
 */

import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ModuleCardProps {
  title: string
  description: string
  icon: string
  path: string
  badge?: string
  badgeColor?: string
  onClick?: () => void
}

function ModuleCard({
  title,
  description,
  icon,
  path,
  badge,
  badgeColor = 'bg-blue-100 text-blue-700',
  onClick,
}: ModuleCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(path)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="relative w-full p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left border border-gray-100"
    >
      {/* Badge */}
      {badge && (
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
          {badge}
        </span>
      )}

      {/* Icon */}
      <div className="text-5xl mb-4">{icon}</div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>

      {/* Arrow indicator */}
      <div className="absolute bottom-6 right-6 text-gray-400">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}

function QuickStats({ streak, problemsToday }: { streak: number; problemsToday: number }) {
  return (
    <div className="flex gap-4 justify-center">
      <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
        <span className="text-xl">🔥</span>
        <span className="font-semibold text-orange-700">{streak} day streak</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
        <span className="text-xl">✅</span>
        <span className="font-semibold text-green-700">{problemsToday} today</span>
      </div>
    </div>
  )
}

function SwitchProfileButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/select-child')}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200"
    >
      <span>👤</span>
      <span>Switch Profile</span>
    </button>
  )
}

export default function PracticeModulesPage() {
  const { currentChild } = useAuth()

  // Default values if child data not available
  const childName = currentChild?.name || 'Learner'
  const streak = 0 // TODO: Get from progress stats
  const problemsToday = 0 // TODO: Get from session/stats

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Bar with Switch Profile */}
        <div className="flex justify-end mb-4">
          <SwitchProfileButton />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
              {currentChild?.avatar || '🧒'}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Hi, {childName}!
              </h1>
              <p className="text-gray-600">What would you like to practice today?</p>
            </div>
          </div>

          {/* Quick Stats */}
          <QuickStats streak={streak} problemsToday={problemsToday} />
        </div>

        {/* Module Grid - 3 Main Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Kumon-Style Practice */}
          <ModuleCard
            icon="📚"
            title="Daily Practice"
            description="Continue your Kumon-style math practice with adaptive problems"
            path="/study"
          />

          {/* School Help - Combines Homework & Exam Prep */}
          <ModuleCard
            icon="🏫"
            title="School Help"
            description="Get help with homework and prepare for tests with Ms. Guide"
            path="/school-help"
            badge="AI Powered"
            badgeColor="bg-purple-100 text-purple-700"
          />

          {/* Video Library */}
          <ModuleCard
            icon="📺"
            title="Video Lessons"
            description="Watch helpful math videos to learn new concepts"
            path="/videos"
          />
        </div>

        {/* Progress Card - Full Width */}
        <div className="mb-6">
          <ModuleCard
            icon="📊"
            title="My Progress"
            description="Track your achievements in Daily Practice and School Help"
            path="/progress"
          />
        </div>

        {/* Bottom encouragement */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            "Every problem you solve makes your brain stronger!" 🧠💪
          </p>
        </div>
      </div>
    </div>
  )
}
