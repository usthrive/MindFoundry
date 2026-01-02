import type { KumonLevel } from '@/types'

export interface WorksheetInfoProps {
  level: KumonLevel
  worksheetNumber: number
  label: string
}

const WorksheetInfo = ({ level, worksheetNumber, label }: WorksheetInfoProps) => {
  return (
    <div className="text-center mb-4 p-3 bg-white/60 rounded-lg border border-primary/20">
      <div className="text-sm sm:text-base font-semibold text-gray-700">
        Level {level} - Worksheet {worksheetNumber}/200
      </div>
      <div className="text-xs sm:text-sm text-gray-600 mt-1">
        {label}
      </div>
    </div>
  )
}

export default WorksheetInfo
