import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Feedback from '@/components/feedback/Feedback'
import NumberPad from '@/components/input/NumberPad'
import InputDisplay from '@/components/input/InputDisplay'
import ProblemDisplay from '@/components/problem/ProblemDisplay'
import SequenceDisplay from '@/components/ui/SequenceDisplay'
import Timer from '@/components/session/Timer'
import SessionProgress from '@/components/session/SessionProgress'
import WorksheetInfo from '@/components/session/WorksheetInfo'
import ParentModeChallenge from '@/components/auth/ParentModeChallenge'
import { generateProblem, getWorksheetLabel } from '@/services/sessionManager'
import {
  getCurrentPosition,
  updateWorksheetProgress,
  updateCurrentPosition,
  createPracticeSession,
  completePracticeSession,
  saveProblemAttempt,
  updateChildStats,
  getChildProfile
} from '@/services/progressService'
import { checkAndAwardBadges } from '@/utils/badgeSystem'
import type { KumonLevel } from '@/types'
import type { Problem } from '@/services/generators/types'

export default function StudyPage() {
  const { user, currentChild, logout } = useAuth()
  const navigate = useNavigate()

  const [inputValue, setInputValue] = useState('')
  const [sequenceAnswers, setSequenceAnswers] = useState<Record<number, string>>({})
  const [feedback, setFeedback] = useState<{ type: 'success' | 'incorrect' | 'hint' | 'encouragement'; message: string; show: boolean }>({
    type: 'success',
    message: '',
    show: false,
  })
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [problemsCompleted, setProblemsCompleted] = useState(0)
  const [problemsCorrect, setProblemsCorrect] = useState(0)
  const [currentLevel, setCurrentLevel] = useState<KumonLevel>('A')
  const [currentWorksheet, setCurrentWorksheet] = useState(1)
  const [sessionActive, setSessionActive] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now())
  const [parentMode, setParentMode] = useState(false)
  const [showParentChallenge, setShowParentChallenge] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if current problem supports decimals
  const supportsDecimals = () => {
    // Level F worksheets 1-160 support decimal problems
    return currentLevel === 'F' && currentWorksheet <= 160
  }

  // Check if current problem supports fractions
  const supportsFractions = () => {
    // Levels D-F and higher have fraction problems
    return ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'].includes(currentLevel)
  }

  // Check if current problem is a sequence type with inline input
  const isSequenceProblem = () => {
    return currentProblem?.displayFormat === 'sequenceBoxes' && currentProblem?.sequenceData
  }

  // FIXED: Dynamic age group based on level (per Kumon requirements)
  const getAgeGroup = () => {
    if (['7A', '6A', '5A', '4A'].includes(currentLevel)) return 'preK'
    if (['3A', '2A', 'A', 'B'].includes(currentLevel)) return 'grade1_2'
    if (['C', 'D', 'E', 'F'].includes(currentLevel)) return 'grade3_5' // Fixed typo
    if (['G', 'H', 'I'].includes(currentLevel)) return 'grade5_6'
    return 'middle_school'
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else if (!currentChild) {
      navigate('/select-child')
    }
  }, [user, currentChild, navigate])

  // Load child's progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!currentChild) return

      setLoading(true)
      try {
        const position = await getCurrentPosition(currentChild.id)

        if (position) {
          setCurrentLevel(position.level)
          setCurrentWorksheet(position.worksheet)

          try {
            setCurrentProblem(generateProblem(position.level, position.worksheet))
          } catch (error) {
            console.error('Error generating problem for level', position.level, error)
            // Fallback to level 3A if current level fails
            setCurrentLevel('3A')
            setCurrentWorksheet(1)
            setCurrentProblem(generateProblem('3A', 1))
          }
        } else {
          // Default to child's current_level and current_worksheet
          const level = currentChild.current_level as KumonLevel
          const worksheet = currentChild.current_worksheet

          try {
            setCurrentLevel(level)
            setCurrentWorksheet(worksheet)
            setCurrentProblem(generateProblem(level, worksheet))
          } catch (error) {
            console.error('Error generating problem for level', level, error)
            // Fallback to level 3A if current level fails
            setCurrentLevel('3A')
            setCurrentWorksheet(1)
            setCurrentProblem(generateProblem('3A', 1))
          }
        }

        // Create new practice session - use fresh level from position or child data
        const levelToUse = position?.level || (currentChild.current_level as KumonLevel)
        const newSessionId = await createPracticeSession(
          currentChild.id,
          levelToUse
        )
        setSessionId(newSessionId)
        setSessionStartTime(Date.now())
      } catch (error) {
        console.error('Error loading practice session:', error)
        // Show error message to user
        setCurrentProblem({
          id: 'error',
          type: 'addition',
          correctAnswer: 0,
          level: '3A',
          displayFormat: 'horizontal',
          difficulty: 1,
          operands: [0, 0],
          worksheetNumber: 1,
          subtype: 'add_1_small',
          question: 'Error loading problem'
        })
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [currentChild])

  // Keyboard input support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!sessionActive) return

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        handleNumberClick(parseInt(e.key))
      } else if (e.key === '.' && supportsDecimals()) {
        e.preventDefault()
        if (!inputValue.includes('.')) {
          setInputValue(prev => prev === '' ? '0.' : prev + '.')
        }
      } else if (e.key === '/' && supportsFractions()) {
        e.preventDefault()
        if (!inputValue.includes('/')) {
          setInputValue(prev => prev + '/')
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        handleBackspace()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleClear()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [inputValue, currentProblem, sessionActive])

  const handleNumberClick = (num: number) => {
    if (num === -1) {
      setInputValue('')
    } else if (num === -2) { // Decimal point signal
      if (supportsDecimals() && !inputValue.includes('.')) {
        setInputValue(prev => prev === '' ? '0.' : prev + '.')
      }
    } else if (num === -3) { // Fraction slash signal
      if (supportsFractions() && !inputValue.includes('/')) {
        setInputValue(prev => prev + '/')
      }
    } else if (num >= 0) {
      setInputValue((prev) => prev + num.toString())
    }
  }

  const handleBackspace = () => {
    setInputValue((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setInputValue('')
  }

  const handleSubmit = async () => {
    if (!sessionActive || !currentProblem || !currentChild || !sessionId) return

    // For sequence problems, check sequence answers; for regular problems, check inputValue
    let isCorrect = false
    let submittedAnswer = inputValue

    if (isSequenceProblem() && currentProblem.sequenceData) {
      // For sequence problems, check each missing position
      const missingIndices = currentProblem.sequenceData
        .map((item, idx) => (item.isMissing ? idx : -1))
        .filter(idx => idx !== -1)

      // Get the correct answer for the first missing position
      const missingIdx = missingIndices[0]
      const userAnswer = parseInt(sequenceAnswers[missingIdx] || '', 10)
      submittedAnswer = sequenceAnswers[missingIdx] || ''

      isCorrect = userAnswer === currentProblem.correctAnswer
    } else {
      // Regular problem - must have input value
      if (!inputValue) return

      // FIXED: Support numeric, string, and Fraction answers per Kumon requirements
      const correctAnswer = currentProblem.correctAnswer

      if (typeof correctAnswer === 'string') {
        // String answer (exact match, case insensitive)
        isCorrect = inputValue.toLowerCase() === correctAnswer.toLowerCase()
      } else if (typeof correctAnswer === 'number') {
        // Numeric answer
        isCorrect = parseFloat(inputValue) === correctAnswer
      } else if (typeof correctAnswer === 'object' && correctAnswer !== null && 'numerator' in correctAnswer && 'denominator' in correctAnswer) {
        // Fraction answer { numerator, denominator }
        const frac = correctAnswer as { numerator: number; denominator: number }
        // Accept input like "5/8" or just "5" if denominator is 1
        if (frac.denominator === 1) {
          isCorrect = parseInt(inputValue, 10) === frac.numerator
        } else {
          // Parse student input as fraction "numerator/denominator"
          const parts = inputValue.split('/')
          if (parts.length === 2) {
            const studentNum = parseInt(parts[0].trim(), 10)
            const studentDen = parseInt(parts[1].trim(), 10)
            // Compare simplified fractions
            if (!isNaN(studentNum) && !isNaN(studentDen) && studentDen !== 0) {
              // Cross-multiply to check equality: a/b = c/d => a*d = b*c
              isCorrect = studentNum * frac.denominator === frac.numerator * studentDen
            }
          }
        }
      } else {
        // Fallback: compare as strings
        isCorrect = inputValue === String(correctAnswer)
      }
    }

    const problemTimeSpent = Math.floor((Date.now() - sessionStartTime) / 1000)

    // Save problem attempt to database
    await saveProblemAttempt(
      sessionId,
      currentChild.id,
      currentProblem,
      submittedAnswer,
      isCorrect,
      problemTimeSpent
    )

    if (isCorrect) {
      const newCompleted = problemsCompleted + 1
      const newCorrect = problemsCorrect + 1

      setProblemsCorrect(newCorrect)
      setProblemsCompleted(newCompleted)

      // Check if session is complete
      if (newCompleted >= 10) {
        setSessionActive(false)
        setFeedback({
          type: 'success',
          message: `🎉 Session Complete! You got ${newCorrect} out of 10 correct!`,
          show: true
        })
        setInputValue('')

        // Save session completion and advance
        setTimeout(() => {
          handleSessionComplete(newCorrect, newCompleted)
        }, 3000)
        return
      }

      // Quick checkmark for correct answers
      setFeedback({ type: 'success', message: '✓', show: true })

      // Very quick transition for correct answers (300ms)
      setTimeout(() => {
        setInputValue('')
        setSequenceAnswers({})
        setCurrentProblem(generateProblem(currentLevel, currentWorksheet))
        setSessionStartTime(Date.now())
        setFeedback({ ...feedback, show: false })
      }, 300)
    } else {
      const newCompleted = problemsCompleted + 1
      setProblemsCompleted(newCompleted)

      if (newCompleted >= 10) {
        setSessionActive(false)
        setFeedback({
          type: 'success',
          message: `🎉 Session Complete! You got ${problemsCorrect} out of 10 correct!`,
          show: true
        })
        setInputValue('')

        setTimeout(() => {
          handleSessionComplete(problemsCorrect, newCompleted)
        }, 3000)
        return
      }

      // Longer hold for incorrect answers
      setFeedback({ type: 'incorrect', message: 'Try again', show: true })

      // Longer pause for incorrect answers (1500ms)
      setTimeout(() => {
        setInputValue('')
        setSequenceAnswers({})
        setCurrentProblem(generateProblem(currentLevel, currentWorksheet))
        setFeedback({ ...feedback, show: false })
        setSessionStartTime(Date.now())
      }, 1500)
    }
  }

  const handleSessionComplete = async (score: number, totalProblems: number) => {
    if (!currentChild || !sessionId) return

    const totalTimeSpent = Math.floor((Date.now() - sessionStartTime) / 1000)

    // Save to database (pass childId to update daily practice and streak)
    await completePracticeSession(sessionId, totalProblems, score, totalTimeSpent, currentChild.id)
    await updateWorksheetProgress(currentChild.id, currentLevel, currentWorksheet, score, totalProblems)
    await updateChildStats(currentChild.id, totalProblems, score)

    // Check and award any new badges
    const updatedChild = await getChildProfile(currentChild.id)
    if (updatedChild) {
      const newBadges = await checkAndAwardBadges(currentChild.id, {
        current_level: updatedChild.current_level,
        total_problems: updatedChild.total_problems,
        total_correct: updatedChild.total_correct,
        streak: updatedChild.streak
      })
      if (newBadges.length > 0) {
        console.log(`🏅 New badges earned: ${newBadges.map(b => b.display_name).join(', ')}`)
      }
    }

    // Move to next worksheet
    const nextWorksheet = currentWorksheet + 1
    await updateCurrentPosition(currentChild.id, currentLevel, nextWorksheet)

    // Reset local state
    setProblemsCompleted(0)
    setProblemsCorrect(0)
    setCurrentWorksheet(nextWorksheet)
    setSessionActive(true)
    setCurrentProblem(generateProblem(currentLevel, nextWorksheet))
    setFeedback({ ...feedback, show: false })

    // Create new session
    const newSessionId = await createPracticeSession(currentChild.id, currentLevel)
    setSessionId(newSessionId)
    setSessionStartTime(Date.now())
  }

  const handleLevelChange = async (level: KumonLevel) => {
    if (!parentMode) {
      alert('⚠️ Parent Mode required to change levels.\n\nClick "🔓 Parent Controls" to enable.')
      return
    }

    if (!currentChild) return

    setCurrentLevel(level)
    setCurrentWorksheet(1)
    setInputValue('')
    setCurrentProblem(generateProblem(level, 1))
    setFeedback({ ...feedback, show: false })
    setProblemsCompleted(0)
    setProblemsCorrect(0)
    setSessionActive(true)

    // Update database
    await updateCurrentPosition(currentChild.id, level, 1)

    // Create new session
    const newSessionId = await createPracticeSession(currentChild.id, level)
    setSessionId(newSessionId)
    setSessionStartTime(Date.now())
  }

  const handleWorksheetJump = async (worksheetNum: number) => {
    if (!parentMode) {
      alert('⚠️ Parent Mode required to jump worksheets.\n\nClick "🔓 Parent Controls" to enable.')
      return
    }

    if (!currentChild) return

    setCurrentWorksheet(worksheetNum)
    setInputValue('')
    setCurrentProblem(generateProblem(currentLevel, worksheetNum))
    setFeedback({ ...feedback, show: false })
    setProblemsCompleted(0)
    setProblemsCorrect(0)
    setSessionActive(true)

    // Update database
    await updateCurrentPosition(currentChild.id, currentLevel, worksheetNum)

    // Create new session
    const newSessionId = await createPracticeSession(currentChild.id, currentLevel)
    setSessionId(newSessionId)
    setSessionStartTime(Date.now())
  }

  const toggleParentMode = () => {
    if (!parentMode) {
      // Show math challenge to enable parent mode
      setShowParentChallenge(true)
    } else {
      // Disable parent mode (no challenge needed)
      setParentMode(false)
    }
  }

  const handleParentChallengeSuccess = () => {
    setShowParentChallenge(false)
    setParentMode(true)
  }

  const handleParentChallengeCancel = () => {
    setShowParentChallenge(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleBackToChildSelect = () => {
    navigate('/select-child')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 max-w-full overflow-x-hidden">
      {/* Parent Mode Challenge Modal */}
      <ParentModeChallenge
        isOpen={showParentChallenge}
        onSuccess={handleParentChallengeSuccess}
        onCancel={handleParentChallengeCancel}
      />

      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left flex-1 w-full">
            <h1 className="mb-2 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">MindFoundry</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              {currentChild?.name} - Level {currentLevel}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <Button variant="ghost" size="sm" onClick={handleBackToChildSelect} className="flex-1 sm:flex-initial">
              Switch Child
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex-1 sm:flex-initial">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Parent Mode Banner */}
        {parentMode && (
          <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4 text-center">
            <p className="text-orange-800 font-semibold">
              ⚠️ Parent Mode Active - Navigation Unlocked
            </p>
          </div>
        )}

        {/* Feedback */}
        <Feedback
          type={feedback.type}
          message={feedback.message}
          show={feedback.show}
          onDismiss={() => setFeedback({ ...feedback, show: false })}
        />

        {/* Interactive Math Practice */}
        <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-blue-50 to-purple-50">
          {/* Worksheet Info */}
          <WorksheetInfo
            level={currentLevel}
            worksheetNumber={currentWorksheet}
            label={getWorksheetLabel(currentLevel, currentWorksheet)}
          />

          <div className="mb-6 flex items-center justify-between">
            <Timer isRunning={true} />
            <SessionProgress completed={problemsCompleted} total={10} correct={problemsCorrect} />
          </div>

          <h2 className="mb-6 text-center text-xl sm:text-2xl font-semibold text-gray-700">
            Solve the problem:
          </h2>

          {currentProblem && (
            <div className="mb-6 flex justify-center">
              {isSequenceProblem() && currentProblem.sequenceData ? (
                // Sequence problems use SequenceDisplay with inline input
                <SequenceDisplay
                  sequenceData={currentProblem.sequenceData}
                  onAnswerChange={setSequenceAnswers}
                  disabled={!sessionActive}
                  correctAnswers={[currentProblem.correctAnswer as number]}
                />
              ) : (
                // Regular problems use ProblemDisplay
                <ProblemDisplay
                  problem={currentProblem}
                  studentAnswer={inputValue}
                  ageGroup={getAgeGroup()}
                />
              )}
            </div>
          )}

          {/* Only show NumberPad and InputDisplay for non-sequence problems */}
          {!isSequenceProblem() && (
            <div className="flex flex-col items-center gap-6">
              <InputDisplay value={inputValue} size="xl" />
              <NumberPad
                onNumberClick={handleNumberClick}
                onBackspace={handleBackspace}
                onClear={handleClear}
                onSubmit={handleSubmit}
                allowDecimal={supportsDecimals()}
                allowFraction={supportsFractions()}
              />
            </div>
          )}

          {/* For sequence problems, show a submit button */}
          {isSequenceProblem() && (
            <div className="flex justify-center mt-4">
              <Button
                size="lg"
                variant="primary"
                onClick={handleSubmit}
                disabled={!sessionActive || Object.keys(sequenceAnswers).length === 0}
              >
                Check Answer
              </Button>
            </div>
          )}

          {/* Parent Mode Toggle */}
          <div className="mt-6 border-t border-gray-200 pt-4 text-center">
            <Button
              size="sm"
              variant={parentMode ? 'primary' : 'ghost'}
              onClick={toggleParentMode}
            >
              {parentMode ? '🔓 Parent Mode ON' : '🔒 Parent Controls'}
            </Button>
          </div>

          {/* Worksheet Jump Controls - Only visible in Parent Mode */}
          {parentMode && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="mb-2 text-center text-xs sm:text-sm font-medium text-gray-600">
                Jump to Worksheet Range:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleWorksheetJump(1)}>
                  Start (1-40)
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleWorksheetJump(50)}>
                  Early (41-80)
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleWorksheetJump(100)}>
                  Mid (81-120)
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleWorksheetJump(150)}>
                  Late (121-160)
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleWorksheetJump(180)}>
                  Advanced (161-200)
                </Button>
              </div>
            </div>
          )}

          {/* Level selector - Only visible in Parent Mode */}
          {parentMode && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="mb-3 text-center text-sm font-medium text-gray-600">
                Choose Level to Practice:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="sm" variant={currentLevel === '3A' ? 'primary' : 'secondary'} onClick={() => handleLevelChange('3A')}>
                  3A
                </Button>
                <Button size="sm" variant={currentLevel === '2A' ? 'primary' : 'secondary'} onClick={() => handleLevelChange('2A')}>
                  2A
                </Button>
                <Button size="sm" variant={currentLevel === 'A' ? 'primary' : 'secondary'} onClick={() => handleLevelChange('A')}>
                  A
                </Button>
                <Button size="sm" variant={currentLevel === 'B' ? 'primary' : 'secondary'} onClick={() => handleLevelChange('B')}>
                  B
                </Button>
                <Button size="sm" variant={currentLevel === 'C' ? 'primary' : 'secondary'} onClick={() => handleLevelChange('C')}>
                  C
                </Button>
                <Button size="sm" variant={currentLevel === 'D' ? 'primary' : 'secondary'} onClick={() => handleLevelChange('D')}>
                  D
                </Button>
                <Button size="sm" variant={currentLevel === 'E' ? 'primary' : 'secondary'} onClick={() => handleLevelChange('E')}>
                  E
                </Button>
                <Button size="sm" variant={currentLevel === 'F' ? 'primary' : 'secondary'} onClick={() => handleLevelChange('F')}>
                  F
                </Button>
              </div>
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}
