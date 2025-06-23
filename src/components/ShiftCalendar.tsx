import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth } from 'date-fns'
import { ja } from 'date-fns/locale'
import clsx from 'clsx'

interface ShiftAssignment {
  staffName: string
  shiftType: string
  startTime: string
  endTime: string
  note?: string
}

interface DayShift {
  date: string
  dayOfWeek: string
  isHoliday: boolean
  specialDuty?: string
  staffAssignments: ShiftAssignment[]
}

interface ShiftCalendarProps {
  month: string
  shifts: DayShift[]
}

const shiftTypeColors: Record<string, string> = {
  '早番': 'bg-blue-100 text-blue-800',
  '遅番': 'bg-green-100 text-green-800',
  '通常': 'bg-gray-100 text-gray-800',
  '土曜午前': 'bg-purple-100 text-purple-800',
  '土曜終日': 'bg-indigo-100 text-indigo-800',
}

export default function ShiftCalendar({ month, shifts }: ShiftCalendarProps) {
  const [year, monthNum] = month.split('-').map(Number)
  const monthStart = startOfMonth(new Date(year, monthNum - 1))
  const monthEnd = endOfMonth(monthStart)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDayOfWeek = getDay(monthStart)
  const emptyDays = Array(startDayOfWeek).fill(null)

  const getDayShift = (date: Date): DayShift | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return shifts.find(shift => shift.date === dateStr)
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div
            key={day}
            className={clsx(
              'bg-gray-50 p-2 text-center text-sm font-medium',
              index === 0 && 'text-red-600',
              index === 6 && 'text-blue-600'
            )}
          >
            {day}
          </div>
        ))}

        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="bg-white p-2 h-32" />
        ))}

        {days.map((day) => {
          const dayShift = getDayShift(day)
          const dayOfWeek = getDay(day)
          const isHoliday = dayOfWeek === 0 || dayShift?.isHoliday

          return (
            <div
              key={day.toISOString()}
              className={clsx(
                'bg-white p-2 min-h-[8rem] border-t',
                isHoliday && 'bg-red-50'
              )}
            >
              <div className="flex items-start justify-between mb-1">
                <span
                  className={clsx(
                    'text-sm font-medium',
                    dayOfWeek === 0 && 'text-red-600',
                    dayOfWeek === 6 && 'text-blue-600'
                  )}
                >
                  {format(day, 'd')}
                </span>
                {dayShift?.specialDuty && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                    {dayShift.specialDuty}
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                {dayShift?.staffAssignments.slice(0, 3).map((assignment, index) => (
                  <div
                    key={`${assignment.staffName}-${index}`}
                    className={clsx(
                      'text-xs px-1 py-0.5 rounded truncate',
                      shiftTypeColors[assignment.shiftType] || 'bg-gray-100'
                    )}
                    title={`${assignment.staffName} (${assignment.startTime}-${assignment.endTime})`}
                  >
                    {assignment.staffName.split(' ')[0]}
                  </div>
                ))}
                {dayShift && dayShift.staffAssignments.length > 3 && (
                  <div className="text-xs text-gray-500 px-1">
                    他{dayShift.staffAssignments.length - 3}名
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}