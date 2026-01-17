import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Feedback from '@/components/feedback/Feedback'
import NumberPad from '@/components/input/NumberPad'
import InputDisplay from '@/components/input/InputDisplay'
import TapToSelect from '@/components/input/TapToSelect'
import ProblemDisplay from '@/components/problem/ProblemDisplay'
import SequenceDisplay from '@/components/ui/SequenceDisplay'
import Timer from '@/components/session/Timer'
import SessionProgress from '@/components/session/SessionProgress'
import WorksheetInfo from '@/components/session/WorksheetInfo'
import ParentModeChallenge from '@/components/auth/ParentModeChallenge'
import WorksheetView, { type WorksheetViewRef } from '@/components/worksheet/WorksheetView'
import WorksheetNumberPad from '@/components/worksheet/WorksheetNumberPad'
import { MicroHint, VisualHint, FullTeaching } from '@/components/hints'
import { getProblemsPerPage, usesTapToSelect } from '@/utils/worksheetConfig'
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
import type { KumonLevel, HintLevel } from '@/types'
import type { Problem } from '@/services/generators/types'
import type { ProblemAttemptData } from '@/components/worksheet/WorksheetView'

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
  // Detailed attempt tracking for scorecard
  const [firstTryCorrect, setFirstTryCorrect] = useState(0)    // Correct on 1st attempt
  const [withHintsCorrect, setWithHintsCorrect] = useState(0)  // Correct after hints
  const [totalIncorrect, setTotalIncorrect] = useState(0)      // Never got correct
  const [currentLevel, setCurrentLevel] = useState<KumonLevel>('A')
  const [currentWorksheet, setCurrentWorksheet] = useState(1)
  const [sessionActive, setSessionActive] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now())
  const [parentMode, setParentMode] = useState(false)
  const [showParentChallenge, setShowParentChallenge] = useState(false)
  const [loading, setLoading] = useState(true)
  const [worksheetMode, setWorksheetMode] = useState(true) // Multi-problem view mode
  const [canSubmitWorksheet, setCanSubmitWorksheet] = useState(false) // All questions answered
  const worksheetViewRef = useRef<WorksheetViewRef>(null)

  // Hint system state for single-problem mode
  const [attemptCount, setAttemptCount] = useState(0)  // Wrong attempts for current problem
  const [currentHintLevel, setCurrentHintLevel] = useState<HintLevel | null>(null)
  const [showTeaching, setShowTeaching] = useState(false)  // Full teaching modal visible

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

  // Check if current problem uses tap-to-select (Pre-K levels 7A, 6A)
  const isTapToSelectProblem = () => {
    return currentProblem?.interactionType === 'match' && Array.isArray(currentProblem?.operands)
  }

  // Check if level should use worksheet mode (multiple problems per page)
  const shouldUseWorksheetMode = () => {
    // Pre-K levels with TapToSelect don't use worksheet mode
    if (usesTapToSelect(currentLevel)) return false
    // Levels with 1 problem per page don't need worksheet mode
    if (getProblemsPerPage(currentLevel) === 1) return false
    // Otherwise use worksheet mode if enabled
    return worksheetMode
  }

  // Check if negative numbers are supported (Level G+ introduces integers)
  const supportsNegatives = () => {
    return ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'].includes(currentLevel)
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

  // Keyboard input support - handles both single-problem and worksheet modes
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!sessionActive) return

      const worksheetModeActive = shouldUseWorksheetMode()

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        if (worksheetModeActive) {
          handleWorksheetInput(parseInt(e.key))
        } else {
          handleNumberClick(parseInt(e.key))
        }
      } else if (e.key === '.' && supportsDecimals()) {
        e.preventDefault()
        if (worksheetModeActive) {
          handleWorksheetInput('decimal')
        } else if (!inputValue.includes('.')) {
          setInputValue(prev => prev === '' ? '0.' : prev + '.')
        }
      } else if (e.key === '/' && supportsFractions()) {
        e.preventDefault()
        if (worksheetModeActive) {
          handleWorksheetInput('fraction')
        } else if (!inputValue.includes('/')) {
          setInputValue(prev => prev + '/')
        }
      } else if (e.key === '-' && supportsNegatives()) {
        e.preventDefault()
        if (worksheetModeActive) {
          handleWorksheetInput('negative')
        } else {
          // Toggle negative sign at start of input
          setInputValue(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev)
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (worksheetModeActive) {
          handleWorksheetInput('enter')  // Navigate to next question or submit if all answered
        } else {
          handleSubmit()
        }
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        if (worksheetModeActive) {
          handleWorksheetInput('backspace')
        } else {
          handleBackspace()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        if (worksheetModeActive) {
          handleWorksheetInput('clear')
        } else {
          handleClear()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [inputValue, currentProblem, sessionActive, worksheetMode, currentLevel])

  const handleNumberClick = (num: number) => {
    if (num === -1) { // Negative sign signal (Level G+)
      if (supportsNegatives()) {
        // Toggle negative sign at start of input
        setInputValue(prev => {
          if (prev.startsWith('-')) {
            return prev.slice(1) // Remove negative sign
          }
          return '-' + prev // Add negative sign
        })
      }
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

  // Handler for TapToSelect component (Pre-K levels)
  const handleTapToSelect = async (value: number) => {
    if (!sessionActive || !currentProblem || !currentChild || !sessionId) return

    const isCorrect = value === currentProblem.correctAnswer
    const problemTimeSpent = Math.floor((Date.now() - sessionStartTime) / 1000)

    // Save problem attempt to database with hints tracking
    await saveProblemAttempt(
      sessionId,
      currentChild.id,
      currentProblem,
      String(value),
      isCorrect,
      problemTimeSpent,
      {
        attemptsCount: attemptCount + 1,
        firstAttemptCorrect: attemptCount === 0,
        hintLevelReached: currentHintLevel
      }
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
          message: `Great job! You got ${newCorrect} out of 10 correct!`,
          show: true
        })

        setTimeout(() => {
          handleSessionComplete(newCorrect, newCompleted)
        }, 3000)
        return
      }

      setFeedback({ type: 'success', message: 'Great job!', show: true })

      // Brief pause before next problem
      setTimeout(() => {
        setCurrentProblem(generateProblem(currentLevel, currentWorksheet))
        setSessionStartTime(Date.now())
        setFeedback({ ...feedback, show: false })
      }, 1000)
    } else {
      const newCompleted = problemsCompleted + 1
      setProblemsCompleted(newCompleted)

      if (newCompleted >= 10) {
        setSessionActive(false)
        setFeedback({
          type: 'success',
          message: `Good try! You got ${problemsCorrect} out of 10 correct!`,
          show: true
        })

        setTimeout(() => {
          handleSessionComplete(problemsCorrect, newCompleted)
        }, 3000)
        return
      }

      setFeedback({ type: 'incorrect', message: `The answer is ${currentProblem.correctAnswer}`, show: true })

      // Longer pause for incorrect to learn
      setTimeout(() => {
        setCurrentProblem(generateProblem(currentLevel, currentWorksheet))
        setFeedback({ ...feedback, show: false })
        setSessionStartTime(Date.now())
      }, 2000)
    }
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

    // Save problem attempt to database with hints tracking
    await saveProblemAttempt(
      sessionId,
      currentChild.id,
      currentProblem,
      submittedAnswer,
      isCorrect,
      problemTimeSpent,
      {
        attemptsCount: attemptCount + 1,
        firstAttemptCorrect: attemptCount === 0,
        hintLevelReached: currentHintLevel
      }
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

      // Reset hint state and move to next problem
      setTimeout(() => {
        setInputValue('')
        setSequenceAnswers({})
        setAttemptCount(0)  // Reset attempt count for new problem
        setCurrentHintLevel(null)
        setCurrentProblem(generateProblem(currentLevel, currentWorksheet))
        setSessionStartTime(Date.now())
        setFeedback({ ...feedback, show: false })
      }, 300)
    } else {
      // Wrong answer - implement graduated hint system
      const newAttemptCount = attemptCount + 1
      setAttemptCount(newAttemptCount)

      if (newAttemptCount === 1) {
        // 1st wrong answer: Show micro-hint, allow retry
        setCurrentHintLevel('micro')
        setFeedback({ type: 'hint', message: 'Try again with a hint!', show: true })
        setInputValue('')  // Clear input for retry
      } else if (newAttemptCount === 2) {
        // 2nd wrong answer: Show visual hint, allow retry
        setCurrentHintLevel('visual')
        setFeedback({ type: 'hint', message: 'Watch the hint carefully!', show: true })
        setInputValue('')  // Clear input for retry
      } else {
        // 3rd wrong answer: Show full teaching, then move on
        setCurrentHintLevel('teaching')
        setShowTeaching(true)
        setFeedback({ type: 'incorrect', message: 'Let me teach you!', show: true })
        setInputValue('')

        // Mark problem as completed (incorrect) and move on after teaching
        const newCompleted = problemsCompleted + 1
        setProblemsCompleted(newCompleted)

        // Check if session is complete
        if (newCompleted >= 10) {
          // Will handle session complete after teaching modal closes
        }
      }
    }
  }

  // Handle completing full teaching (after 3rd wrong in single-problem mode)
  const handleSingleProblemTeachingComplete = () => {
    setShowTeaching(false)
    setCurrentHintLevel(null)
    setAttemptCount(0)
    setFeedback({ ...feedback, show: false })

    // Check if session is complete
    if (problemsCompleted >= 10) {
      setSessionActive(false)
      setFeedback({
        type: 'success',
        message: `🎉 Session Complete! You got ${problemsCorrect} out of 10 correct!`,
        show: true
      })

      setTimeout(() => {
        handleSessionComplete(problemsCorrect, problemsCompleted)
      }, 2000)
      return
    }

    // Move to next problem
    setTimeout(() => {
      setInputValue('')
      setSequenceAnswers({})
      setCurrentProblem(generateProblem(currentLevel, currentWorksheet))
      setSessionStartTime(Date.now())
    }, 500)
  }

  // Dismiss hint (for micro/visual hints in single-problem mode)
  const dismissHint = () => {
    setCurrentHintLevel(null)
    setFeedback({ ...feedback, show: false })
  }

  const handleSessionComplete = async (score: number, totalProblems: number) => {
    if (!currentChild || !sessionId) return

    const totalTimeSpent = Math.floor((Date.now() - sessionStartTime) / 1000)

    // Run independent database operations in parallel for faster completion
    await Promise.all([
      completePracticeSession(sessionId, totalProblems, score, totalTimeSpent, currentChild.id),
      updateWorksheetProgress(currentChild.id, currentLevel, currentWorksheet, score, totalProblems),
      updateChildStats(currentChild.id, totalProblems, score),
    ])

    // Check and award any new badges (depends on stats being updated)
    const updatedChild = await getChildProfile(currentChild.id)
    if (updatedChild) {
      const newBadges = await checkAndAwardBadges(currentChild.id, {
        current_level: updatedChild.current_level,
        total_problems: updatedChild.total_problems,
        total_correct: updatedChild.total_correct,
        streak: updatedChild.streak
      })
      if (newBadges.length > 0) {
        console.log(`New badges earned: ${newBadges.map(b => b.display_name).join(', ')}`)
      }
    }

    // Move to next worksheet
    const nextWorksheet = currentWorksheet + 1
    await updateCurrentPosition(currentChild.id, currentLevel, nextWorksheet)

    // Reset local state and create new session
    setProblemsCompleted(0)
    setProblemsCorrect(0)
    setFirstTryCorrect(0)
    setWithHintsCorrect(0)
    setTotalIncorrect(0)
    setCurrentWorksheet(nextWorksheet)
    setSessionActive(true)
    setCurrentProblem(generateProblem(currentLevel, nextWorksheet))
    setFeedback({ ...feedback, show: false })

    const newSessionId = await createPracticeSession(currentChild.id, currentLevel)
    setSessionId(newSessionId)
    setSessionStartTime(Date.now())
  }

  // Handler for worksheet page completion (multi-problem view)
  const handleWorksheetPageComplete = async (results: {
    correct: number
    total: number
    answers: Record<number, string>
    problemAttempts: ProblemAttemptData[]
  }) => {
    setProblemsCorrect(prev => prev + results.correct)
    setProblemsCompleted(prev => prev + results.total)

    // Track detailed metrics for scorecard
    let pageFirstTry = 0
    let pageWithHints = 0
    let pageIncorrect = 0

    for (const attempt of results.problemAttempts) {
      if (attempt.isCorrect) {
        if (attempt.firstAttemptCorrect) {
          pageFirstTry++
        } else {
          pageWithHints++
        }
      } else {
        pageIncorrect++
      }
    }

    setFirstTryCorrect(prev => prev + pageFirstTry)
    setWithHintsCorrect(prev => prev + pageWithHints)
    setTotalIncorrect(prev => prev + pageIncorrect)

    // Save each problem attempt to database with hints/attempt tracking
    if (sessionId && currentChild) {
      for (const attempt of results.problemAttempts) {
        await saveProblemAttempt(
          sessionId,
          currentChild.id,
          attempt.problem,
          attempt.answer,
          attempt.isCorrect,
          0,  // timeSpent per problem not tracked in worksheet mode
          {
            attemptsCount: attempt.attemptsCount,
            firstAttemptCorrect: attempt.firstAttemptCorrect,
            hintLevelReached: attempt.hintLevelReached
          }
        )
      }
    }
  }

  // Handler for full worksheet completion (multi-problem view)
  const handleWorksheetComplete = async (totalCorrect: number, totalProblems: number) => {
    setSessionActive(false)

    // Build detailed scorecard message
    const scorecardLines = [
      `🎉 Worksheet Complete!`,
      ``,
      `✅ First Try: ${firstTryCorrect}/${totalProblems} (${Math.round((firstTryCorrect / totalProblems) * 100)}%)`,
      withHintsCorrect > 0 ? `🔄 With Hints: ${withHintsCorrect}/${totalProblems} (${Math.round((withHintsCorrect / totalProblems) * 100)}%)` : null,
      totalIncorrect > 0 ? `❌ Incorrect: ${totalIncorrect}/${totalProblems} (${Math.round((totalIncorrect / totalProblems) * 100)}%)` : null,
    ].filter(Boolean).join('\n')

    setFeedback({
      type: 'success',
      message: scorecardLines,
      show: true
    })

    // Wait briefly then handle session complete (reduced from 3000ms for faster transition)
    setTimeout(() => {
      handleSessionComplete(totalCorrect, totalProblems)
    }, 1500)
  }

  // Handler for worksheet number pad input
  const handleWorksheetInput = (value: number | string) => {
    worksheetViewRef.current?.handleInput(value)
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
    setFirstTryCorrect(0)
    setWithHintsCorrect(0)
    setTotalIncorrect(0)
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
    setFirstTryCorrect(0)
    setWithHintsCorrect(0)
    setTotalIncorrect(0)
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

  // Calculate if we need bottom padding for fixed numberpad
  const needsFixedNumberpad = shouldUseWorksheetMode()

  return (
    <div className={`min-h-screen bg-background p-4 sm:p-8 max-w-full overflow-x-hidden ${needsFixedNumberpad ? 'pb-[180px] sm:pb-[200px]' : ''}`}>
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

          {/* Worksheet Mode: Multi-problem view with fixed numberpad */}
          {shouldUseWorksheetMode() ? (
            <>
              <h2 className="mb-6 text-center text-xl sm:text-2xl font-semibold text-gray-700">
                Solve the problems:
              </h2>

              <WorksheetView
                ref={worksheetViewRef}
                level={currentLevel}
                worksheetNumber={currentWorksheet}
                onPageComplete={handleWorksheetPageComplete}
                onWorksheetComplete={handleWorksheetComplete}
                onAllAnsweredChange={setCanSubmitWorksheet}
                sessionActive={sessionActive}
              />

              {/* Fixed Worksheet NumberPad at bottom of viewport */}
              <WorksheetNumberPad
                onInput={handleWorksheetInput}
                allowDecimal={supportsDecimals()}
                allowFraction={supportsFractions()}
                allowNegative={supportsNegatives()}
                disabled={!sessionActive}
                submitDisabled={!canSubmitWorksheet}
                fixed={true}
                collapsible={true}
              />
            </>
          ) : (
            <>
              {/* Single Problem Mode: Original view */}
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

              {/* Graduated Hints for Single-Problem Mode */}
              {currentProblem && currentHintLevel === 'micro' && currentProblem.graduatedHints?.micro && (
                <div className="mb-4">
                  <MicroHint
                    text={currentProblem.graduatedHints.micro.text}
                    show={true}
                    position="inline"
                    onDismiss={dismissHint}
                    autoDismiss={false}
                  />
                </div>
              )}

              {currentProblem && currentHintLevel === 'visual' && currentProblem.graduatedHints?.visual && (
                <div className="mb-4">
                  <VisualHint
                    text={currentProblem.graduatedHints.visual.text}
                    animationId={currentProblem.graduatedHints.visual.animationId}
                    show={true}
                    problemData={{
                      operands: currentProblem.operands,
                      operation: currentProblem.type,
                    }}
                    onDismiss={dismissHint}
                  />
                </div>
              )}

              {/* Full Teaching Modal for Single-Problem Mode */}
              {currentProblem && showTeaching && (() => {
                const questionStr = typeof currentProblem.question === 'string'
                  ? currentProblem.question
                  : currentProblem.question?.text || ''
                const answerValue = typeof currentProblem.correctAnswer === 'object'
                  ? 'numerator' in currentProblem.correctAnswer
                    ? `${currentProblem.correctAnswer.numerator}/${currentProblem.correctAnswer.denominator}`
                    : (currentProblem.correctAnswer as { text?: string }).text || ''
                  : currentProblem.correctAnswer

                return (
                  <FullTeaching
                    text={currentProblem.graduatedHints?.teaching?.text || "Let's work through this step by step."}
                    animationId={currentProblem.graduatedHints?.teaching?.animationId}
                    show={showTeaching}
                    problemData={{
                      question: questionStr,
                      operands: currentProblem.operands,
                      operation: currentProblem.type,
                      correctAnswer: answerValue,
                    }}
                    onComplete={handleSingleProblemTeachingComplete}
                    duration={30}
                    minViewTime={10}
                  />
                )
              })()}

              {/* Input controls: TapToSelect for Pre-K, NumberPad for others */}
              {!isSequenceProblem() && (
                <div className="flex flex-col items-center gap-6">
                  {isTapToSelectProblem() && currentProblem?.operands ? (
                    // Pre-K levels (7A, 6A): Tap-to-select UI for young children
                    <TapToSelect
                      options={currentProblem.operands}
                      onSelect={handleTapToSelect}
                      correctAnswer={currentProblem.correctAnswer as number}
                      disabled={!sessionActive}
                      showFeedback={true}
                      size="auto"
                    />
                  ) : (
                    // Regular levels: NumberPad with typed input
                    <>
                      <InputDisplay value={inputValue} size="xl" />
                      <NumberPad
                        onNumberClick={handleNumberClick}
                        onBackspace={handleBackspace}
                        onClear={handleClear}
                        onSubmit={handleSubmit}
                        allowDecimal={supportsDecimals()}
                        allowFraction={supportsFractions()}
                        allowNegative={supportsNegatives()}
                      />
                    </>
                  )}
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
            </>
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

          {/* View Mode Toggle - Only visible in Parent Mode */}
          {parentMode && !usesTapToSelect(currentLevel) && (
            <div className="mt-4 border-t border-gray-200 pt-4 text-center">
              <p className="mb-2 text-xs sm:text-sm font-medium text-gray-600">
                View Mode:
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  variant={worksheetMode ? 'primary' : 'ghost'}
                  onClick={() => setWorksheetMode(true)}
                >
                  Multi-Problem
                </Button>
                <Button
                  size="sm"
                  variant={!worksheetMode ? 'primary' : 'ghost'}
                  onClick={() => setWorksheetMode(false)}
                >
                  Single Problem
                </Button>
              </div>
            </div>
          )}

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
