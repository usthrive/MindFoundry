import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CelebrationProvider } from '@/contexts/CelebrationContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import BottomNav from '@/components/navigation/BottomNav'
import { CelebrationModal } from '@/components/celebrations'
import AuthPage from '@/pages/AuthPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import OnboardingPage from '@/pages/OnboardingPage'
import ChildSelectPage from '@/pages/ChildSelectPage'
import StudyPage from '@/pages/StudyPage'
import ProgressDashboard from '@/pages/ProgressDashboard'
import TestLevelsPage from '@/pages/TestLevelsPage'

function App() {
  return (
    <AuthProvider>
      <CelebrationProvider>
      <BrowserRouter>
        <div className="min-h-screen pb-20"> {/* Add padding for bottom nav */}
          <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Navigate to="/select-child" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/select-child"
            element={
              <ProtectedRoute>
                <ChildSelectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study"
            element={
              <ProtectedRoute>
                <StudyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/test-levels" element={<TestLevelsPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <BottomNav />
          {/* Global celebration modal - renders on top of everything */}
          <CelebrationModal />
        </div>
      </BrowserRouter>
      </CelebrationProvider>
    </AuthProvider>
  )
}

export default App
