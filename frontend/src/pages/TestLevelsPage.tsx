import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import VisualDisplay from '@/components/ui/VisualDisplay'
import SequenceDisplay from '@/components/ui/SequenceDisplay'
import MatchingProblem from '@/components/ui/MatchingProblem'
import { MathText } from '@/components/ui/MathRenderer'
import ScratchPad from '@/components/ui/ScratchPad'
import WorkPhotoUpload from '@/components/ui/WorkPhotoUpload'
import { generateProblem, type Problem, type MathExpression, type KumonLevel } from '@/services/generators'
import {
  LEVEL_CONFIGS,
  ELECTIVE_CONFIGS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getLevelsByCategory,
  type LevelConfig,
  type WorksheetRange,
} from '@/data/levelConfig'

export default function TestLevelsPage() {
  const navigate = useNavigate()
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null)
  const [selectedRange, setSelectedRange] = useState<WorksheetRange | null>(null)
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [sequenceAnswers, setSequenceAnswers] = useState<Record<number, string>>({})
  const [_matchingComplete, setMatchingComplete] = useState(false)
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, number>>({})
  const [feedback, setFeedback] = useState<{ correct: boolean; shown: boolean }>({ correct: false, shown: false })
  const [showWorkArea, setShowWorkArea] = useState(false)
  const [workMethod, setWorkMethod] = useState<'draw' | 'photo'>('draw')

  // Placeholder for tier-gating - will be replaced with actual user tier check
  const hasVisualRecognition = true // TODO: Replace with actual tier check

  const levelsByCategory = getLevelsByCategory()

  // Determine if current level needs advanced UI features
  const isAdvancedLevel = (level: string): boolean => {
    const advancedLevels = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'XV', 'XM', 'XP', 'XS']
    return advancedLevels.includes(level)
  }

  // Check if question contains LaTeX notation
  const hasLatex = (text: string): boolean => {
    return /\$.*\$|\\frac|\\int|\\sum|\\sqrt|\\[a-z]+/.test(text)
  }

  const handleLevelClick = (config: LevelConfig) => {
    setSelectedLevel(config)
    setSelectedRange(null)
    setCurrentProblem(null)
    setUserAnswer('')
    setFeedback({ correct: false, shown: false })
  }

  const handleRangeClick = (range: WorksheetRange) => {
    setSelectedRange(range)
    generateNewProblem(range)
  }

  const generateNewProblem = (range: WorksheetRange) => {
    if (!selectedLevel) return

    const worksheetNum = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start
    try {
      const problem = generateProblem(selectedLevel.level as KumonLevel, worksheetNum)
      setCurrentProblem(problem)
      setUserAnswer('')
      setSequenceAnswers({})
      setMatchingComplete(false)
      setMatchingAnswers({})
      setFeedback({ correct: false, shown: false })
    } catch (error) {
      console.error('Error generating problem:', error)
      setCurrentProblem(null)
    }
  }

  const getAnswerString = (answer: number | string | { numerator: number; denominator: number } | MathExpression): string => {
    if (typeof answer === 'number') return String(answer)
    if (typeof answer === 'string') return answer
    if ('numerator' in answer && 'denominator' in answer) {
      return `${answer.numerator}/${answer.denominator}`
    }
    if ('text' in answer) return answer.text
    return String(answer)
  }

  const checkAnswer = (userAns: string, correctAns: number | string | { numerator: number; denominator: number } | MathExpression): boolean => {
    const userTrimmed = userAns.trim().toLowerCase()
    const correctStr = getAnswerString(correctAns).toLowerCase()
    if (userTrimmed === correctStr) return true
    if (typeof correctAns === 'number') {
      const parsed = parseFloat(userTrimmed)
      if (!isNaN(parsed) && parsed === correctAns) return true
    }
    return false
  }

  const handleSubmit = () => {
    if (!currentProblem) return

    // Handle sequence problems
    if (currentProblem.interactionType === 'sequence' && currentProblem.sequenceData) {
      const missingIndices = currentProblem.sequenceData
        .map((item, idx) => (item.isMissing ? idx : -1))
        .filter(idx => idx !== -1)

      // For single missing number
      if (missingIndices.length === 1 && currentProblem.missingPosition !== undefined) {
        const userValue = sequenceAnswers[missingIndices[0]]
        const isCorrect = parseInt(userValue || '', 10) === currentProblem.correctAnswer
        setFeedback({ correct: isCorrect, shown: true })
        return
      }
    }

    // Handle matching problems
    if (currentProblem.interactionType === 'match' && currentProblem.matchingData) {
      const items = currentProblem.matchingData.items
      const allCorrect = items.every(item => matchingAnswers[item.id] === item.count)
      setFeedback({ correct: allCorrect, shown: true })
      return
    }

    // Default text input handling
    if (!userAnswer) return
    const isCorrect = checkAnswer(userAnswer, currentProblem.correctAnswer)
    setFeedback({ correct: isCorrect, shown: true })
  }

  const handleNextProblem = () => {
    if (selectedRange) {
      generateNewProblem(selectedRange)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (feedback.shown) {
        handleNextProblem()
      } else {
        handleSubmit()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Level Browser</h1>
            <p className="text-sm text-gray-500">Test all Kumon levels and worksheets</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/select-child')}>
            Back to App
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Level Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Level</h2>
              
              {Object.entries(levelsByCategory).map(([category, levels]) => (
                levels.length > 0 && (
                  <div key={category} className="mb-4">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      {CATEGORY_LABELS[category as LevelConfig['category']]}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {levels.map((config) => (
                        <button
                          key={config.level}
                          onClick={() => handleLevelClick(config)}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-semibold transition-all
                            ${selectedLevel?.level === config.level
                              ? 'bg-blue-500 text-white shadow-md scale-105'
                              : `${CATEGORY_COLORS[config.category]} border hover:scale-105`
                            }
                          `}
                        >
                          {config.level}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ))}

              {/* Electives */}
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Electives
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ELECTIVE_CONFIGS.map((config) => (
                    <button
                      key={config.name}
                      onClick={() => handleLevelClick(config)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-semibold transition-all
                        ${selectedLevel?.name === config.name
                          ? 'bg-blue-500 text-white shadow-md scale-105'
                          : `${CATEGORY_COLORS['elective']} border hover:scale-105`
                        }
                      `}
                    >
                      {config.name.replace('Level ', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Level Details */}
          <div className="lg:col-span-1">
            {selectedLevel ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedLevel.name}</h2>
                  <p className="text-sm text-gray-600">{selectedLevel.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>{selectedLevel.gradeRange}</span>
                    <span>SCT: {selectedLevel.sct}</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-700 mb-2">Worksheet Ranges</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedLevel.worksheetRanges.map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRangeClick(range)}
                      className={`
                        w-full text-left p-3 rounded-lg border transition-all
                        ${selectedRange === range
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {range.start}-{range.end}
                        </span>
                        <span className="text-xs text-blue-600">Try It</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{range.description}</p>
                      <p className="text-xs text-gray-400 mt-1 font-mono">{range.type}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
                <div className="text-4xl mb-3">👈</div>
                <p className="text-gray-500">Select a level to view worksheet ranges</p>
              </div>
            )}
          </div>

          {/* Right Column: Problem Preview */}
          <div className="lg:col-span-1">
            {currentProblem && selectedRange ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-gray-700">
                      {selectedLevel?.name} - Worksheet {selectedRange.start}-{selectedRange.end}
                    </h2>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${CATEGORY_COLORS[selectedLevel?.category || 'elementary-basic']}
                    `}>
                      {selectedRange.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{selectedRange.description}</p>
                </div>

                {/* Problem Display */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-4">
                  <div className="text-center">
                    {/* Visual Assets for Pre-K counting (only for non-matching/non-sequence) */}
                    {currentProblem.visualAssets && currentProblem.visualAssets.length > 0 &&
                     currentProblem.interactionType !== 'match' && currentProblem.interactionType !== 'sequence' && (
                      <VisualDisplay
                        visualAssets={currentProblem.visualAssets}
                        className="mb-4"
                      />
                    )}

                    {/* Sequence Display (Train Car Style) */}
                    {currentProblem.interactionType === 'sequence' && currentProblem.sequenceData ? (
                      <>
                        <div className="text-xl font-bold text-gray-800 mb-4">
                          {typeof currentProblem.question === 'string'
                            ? currentProblem.question
                            : currentProblem.question.text}
                        </div>
                        <SequenceDisplay
                          sequenceData={currentProblem.sequenceData}
                          onAnswerChange={setSequenceAnswers}
                          disabled={feedback.shown}
                          showFeedback={feedback.shown}
                          correctAnswers={typeof currentProblem.correctAnswer === 'number' ? [currentProblem.correctAnswer] : []}
                        />
                      </>
                    ) : currentProblem.interactionType === 'match' && currentProblem.matchingData ? (
                      /* Matching Problem Display */
                      <MatchingProblem
                        matchingData={currentProblem.matchingData}
                        onComplete={(matches) => {
                          setMatchingAnswers(matches)
                          setMatchingComplete(true)
                        }}
                        disabled={feedback.shown}
                        showFeedback={feedback.shown}
                      />
                    ) : currentProblem.displayFormat === 'vertical' && currentProblem.operands && currentProblem.operands.length >= 2 ? (
                      /* Vertical format */
                      <div className="inline-block text-right font-mono text-2xl mb-4">
                        <div className="text-gray-800">{currentProblem.operands[0]}</div>
                        <div className="text-gray-800 border-b-2 border-gray-800 pb-1">
                          {currentProblem.type === 'addition' ? '+' : currentProblem.type === 'subtraction' ? '−' : currentProblem.type === 'multiplication' ? '×' : '÷'} {currentProblem.operands[1]}
                        </div>
                        <div className="text-gray-400 pt-1">?</div>
                      </div>
                    ) : currentProblem.question ? (
                      <div className="text-xl font-bold text-gray-800 mb-4 whitespace-pre-wrap">
                        {typeof currentProblem.question === 'string'
                          ? hasLatex(currentProblem.question)
                            ? <MathText>{currentProblem.question}</MathText>
                            : currentProblem.question
                          : hasLatex(currentProblem.question.text)
                            ? <MathText>{currentProblem.question.text}</MathText>
                            : currentProblem.question.text}
                      </div>
                    ) : currentProblem.operands && currentProblem.operands.length >= 2 ? (
                      <p className="text-3xl font-bold text-gray-800 mb-4">
                        {currentProblem.operands[0]} {currentProblem.type === 'addition' ? '+' : currentProblem.type === 'subtraction' ? '−' : currentProblem.type === 'multiplication' ? '×' : '÷'} {currentProblem.operands[1]} = ?
                      </p>
                    ) : (
                      <p className="text-xl text-gray-800 mb-4">Problem type: {currentProblem.subtype}</p>
                    )}

                    {/* Answer Input (only for non-sequence/non-matching) */}
                    {currentProblem.interactionType !== 'sequence' && currentProblem.interactionType !== 'match' && (
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Your answer"
                        disabled={feedback.shown}
                        className={`
                          w-48 text-center text-xl font-bold p-3 rounded-xl border-2
                          focus:outline-none focus:ring-4
                          ${feedback.shown
                            ? feedback.correct
                              ? 'bg-green-100 border-green-400 text-green-700'
                              : 'bg-red-100 border-red-400 text-red-700'
                            : 'bg-white border-gray-300 focus:border-blue-400 focus:ring-blue-100'
                          }
                        `}
                      />
                    )}

                    {/* Show Your Work - Advanced Levels */}
                    {selectedLevel && isAdvancedLevel(selectedLevel.level) && (
                      <div className="mt-4">
                        <button
                          onClick={() => setShowWorkArea(!showWorkArea)}
                          className="text-sm text-purple-600 hover:text-purple-700 underline"
                        >
                          {showWorkArea ? 'Hide Work Area' : 'Show Your Work'}
                        </button>

                        {showWorkArea && (
                          <div className="mt-3">
                            {/* Work Method Tabs */}
                            <div className="flex justify-center gap-2 mb-3">
                              <button
                                onClick={() => setWorkMethod('draw')}
                                className={`
                                  px-4 py-2 text-sm rounded-lg border-2 transition-all
                                  ${workMethod === 'draw'
                                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                                    : 'border-gray-300 text-gray-600 hover:border-purple-300'
                                  }
                                `}
                              >
                                ✏️ Draw
                              </button>

                              {/* Photo tab - only if tier has visual recognition */}
                              {hasVisualRecognition && (
                                <button
                                  onClick={() => setWorkMethod('photo')}
                                  className={`
                                    px-4 py-2 text-sm rounded-lg border-2 transition-all
                                    ${workMethod === 'photo'
                                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                                      : 'border-gray-300 text-gray-600 hover:border-purple-300'
                                    }
                                  `}
                                >
                                  📷 Photo
                                </button>
                              )}
                            </div>

                            {/* Work Method Content */}
                            {workMethod === 'draw' && (
                              <ScratchPad
                                width={350}
                                height={200}
                                disabled={feedback.shown}
                                className="mx-auto"
                              />
                            )}

                            {workMethod === 'photo' && hasVisualRecognition && (
                              <WorkPhotoUpload
                                maxPhotos={2}
                                disabled={feedback.shown}
                                className="mx-auto max-w-sm"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Feedback */}
                    {feedback.shown && (
                      <div className={`mt-4 p-3 rounded-lg ${feedback.correct ? 'bg-green-100' : 'bg-red-100'}`}>
                        <p className={`text-lg font-semibold ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>
                          {feedback.correct ? '✓ Correct!' : `✗ Incorrect. Answer: ${getAnswerString(currentProblem.correctAnswer)}`}
                        </p>
                      </div>
                    )}

                    {/* Hints */}
                    {currentProblem.hints && currentProblem.hints.length > 0 && (
                      <div className="mt-4 text-left">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Hints:</p>
                        <ul className="text-xs text-gray-600 list-disc list-inside">
                          {currentProblem.hints.map((hint, idx) => (
                            <li key={idx}>{hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!feedback.shown ? (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!userAnswer}
                      className="flex-1"
                    >
                      Check Answer
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleNextProblem}
                      className="flex-1"
                    >
                      Next Problem
                    </Button>
                  )}
                </div>

                {/* Problem Details */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-xs font-semibold text-gray-600 mb-2">Problem Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>Type: <span className="font-mono">{currentProblem.type}</span></div>
                    <div>Subtype: <span className="font-mono">{currentProblem.subtype}</span></div>
                    <div>Format: {currentProblem.displayFormat}</div>
                    <div>Worksheet: {currentProblem.worksheetNumber}</div>
                    <div>Level: {currentProblem.level}</div>
                    <div>Difficulty: {currentProblem.difficulty}</div>
                  </div>
                </div>
              </div>
            ) : selectedRange ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
                <div className="text-4xl mb-3">⏳</div>
                <p className="text-gray-500">Loading problem...</p>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-gray-500">Select a worksheet range to try a problem</p>
              </div>
            )}
          </div>
        </div>

        {/* Level Summary Table */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Complete Level Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Level</th>
                  <th className="text-left py-2 px-3">Name</th>
                  <th className="text-left py-2 px-3">Grade</th>
                  <th className="text-left py-2 px-3">SCT</th>
                  <th className="text-left py-2 px-3">Skills</th>
                </tr>
              </thead>
              <tbody>
                {[...LEVEL_CONFIGS, ...ELECTIVE_CONFIGS].map((config) => (
                  <tr 
                    key={config.name} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleLevelClick(config)}
                  >
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${CATEGORY_COLORS[config.category]}`}>
                        {config.name.replace('Level ', '')}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium">{config.description}</td>
                    <td className="py-2 px-3 text-gray-500">{config.gradeRange}</td>
                    <td className="py-2 px-3 text-gray-500">{config.sct}</td>
                    <td className="py-2 px-3 text-gray-500 text-xs">
                      {config.worksheetRanges.slice(0, 3).map(r => r.description).join(', ')}
                      {config.worksheetRanges.length > 3 && '...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
