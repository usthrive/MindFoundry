import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { CelebrationProvider } from '@/contexts/CelebrationContext'
import { NavigationGuardProvider } from '@/contexts/NavigationGuardContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import BottomNav from '@/components/navigation/BottomNav'
import { CelebrationModal } from '@/components/celebrations'
import DevTierPanel from '@/components/dev/DevTierPanel'
import AdminRoute from '@/components/auth/AdminRoute'
import AuthPage from '@/pages/AuthPage'
import AdminPage from '@/pages/AdminPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import OnboardingPage from '@/pages/OnboardingPage'
import ChildSelectPage from '@/pages/ChildSelectPage'
import StudyPage from '@/pages/StudyPage'
import ProgressDashboard from '@/pages/ProgressDashboard'
import TestLevelsPage from '@/pages/TestLevelsPage'
import AnimationTestPage from '@/pages/AnimationTestPage'
import TestConceptsPage from '@/pages/TestConceptsPage'
import TestTTSPage from '@/pages/TestTTSPage'
import VideoLibraryPage from '@/pages/VideoLibraryPage'
import VideoCategoryPage from '@/pages/VideoCategoryPage'
import VideoWatchPage from '@/pages/VideoWatchPage'
import HomeworkPage from '@/pages/HomeworkPage'
import HomeworkHelperPage from '@/pages/HomeworkHelperPage'
import ExamPrepPage from '@/pages/ExamPrepPage'
import PracticeModulesPage from '@/pages/PracticeModulesPage'
import SchoolHelpPage from '@/pages/SchoolHelpPage'

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
      <CelebrationProvider>
      <BrowserRouter>
        <NavigationGuardProvider>
        <div className="min-h-screen pb-24"> {/* Add padding for bottom nav (96px for nav + progress indicator) */}
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
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PracticeModulesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-help"
            element={
              <ProtectedRoute>
                <SchoolHelpPage />
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
          {/* Video Library Routes */}
          <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <VideoLibraryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos/category/:categoryId"
            element={
              <ProtectedRoute>
                <VideoCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos/watch/:videoId"
            element={
              <ProtectedRoute>
                <VideoWatchPage />
              </ProtectedRoute>
            }
          />
          {/* Homework Helper & Exam Prep Routes */}
          <Route
            path="/homework"
            element={
              <ProtectedRoute>
                <HomeworkPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/homework/helper"
            element={
              <ProtectedRoute>
                <HomeworkHelperPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/homework/helper/:sessionId"
            element={
              <ProtectedRoute>
                <HomeworkHelperPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/homework/exam-prep"
            element={
              <ProtectedRoute>
                <ExamPrepPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/homework/exam-prep/:sessionId"
            element={
              <ProtectedRoute>
                <ExamPrepPage />
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="/test-levels" element={<TestLevelsPage />} />
          <Route path="/test-animations" element={<AnimationTestPage />} />
          <Route path="/test-concepts" element={<TestConceptsPage />} />
          <Route path="/test-tts" element={<ProtectedRoute><TestTTSPage /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <BottomNav />
          {/* Global celebration modal - renders on top of everything */}
          <CelebrationModal />
          {/* Dev-only tier testing panel - only visible in development */}
          <DevTierPanel />
        </div>
        </NavigationGuardProvider>
      </BrowserRouter>
      </CelebrationProvider>
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App
