import { lazy, Suspense } from 'react'
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
import VideoLibraryPage from '@/pages/VideoLibraryPage'
import VideoCategoryPage from '@/pages/VideoCategoryPage'
import VideoWatchPage from '@/pages/VideoWatchPage'
import HomeworkPage from '@/pages/HomeworkPage'
import HomeworkHelperPage from '@/pages/HomeworkHelperPage'
import ExamPrepPage from '@/pages/ExamPrepPage'
import PracticeModulesPage from '@/pages/PracticeModulesPage'
import SchoolHelpPage from '@/pages/SchoolHelpPage'
import CohortPage from '@/pages/CohortPage'

// Best Brains-inspired module ("Foundry Method") — lazy chunk, route base /foundry
const FoundryRoutes = lazy(() => import('@/modules/best-brains/FoundryRoutes'))

// Developer and QA surfaces. No child ever opens these, so they have no business
// in the bundle every child downloads — and FoundryPreviewPage was the reason the
// whole Best Brains corpus sat in the main chunk despite /foundry being lazy: it
// imports generatePack directly, which pulls in every week template. Making it
// lazy puts the content back behind the boundary it was supposed to be behind,
// so authoring more weeks no longer grows the app shell.
const TestLevelsPage = lazy(() => import('@/pages/TestLevelsPage'))
const AnimationTestPage = lazy(() => import('@/pages/AnimationTestPage'))
const TestConceptsPage = lazy(() => import('@/pages/TestConceptsPage'))
const FoundryPreviewPage = lazy(() => import('@/pages/FoundryPreviewPage'))
const TestTTSPage = lazy(() => import('@/pages/TestTTSPage'))

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
      <CelebrationProvider>
      <BrowserRouter>
        <NavigationGuardProvider>
        <div className="min-h-screen pb-24"> {/* Add padding for bottom nav (96px for nav + progress indicator) */}
          {/* One boundary for every lazily-loaded route, so a chunk that is still
              arriving shows a waiting state rather than a blank screen. */}
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-lg text-gray-600">Loading…</p>
              </div>
            }
          >
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
          {/* Cohorts (Teams) */}
          <Route
            path="/cohort"
            element={
              <ProtectedRoute>
                <CohortPage />
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
          {/* Best Brains-inspired module (Foundry Method) */}
          <Route
            path="/foundry/*"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <div className="flex min-h-screen items-center justify-center bg-background">
                      <p className="text-lg text-gray-600">Setting up…</p>
                    </div>
                  }
                >
                  <FoundryRoutes />
                </Suspense>
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
          <Route path="/test-foundry" element={<FoundryPreviewPage />} />
          <Route path="/test-tts" element={<ProtectedRoute><TestTTSPage /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          </Suspense>
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
