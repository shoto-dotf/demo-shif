import { 
  Staff, 
  Shift, 
  ValidationRules, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning,
  DEFAULT_VALIDATION_RULES
} from '../types'

export class ShiftValidator {
  private rules: ValidationRules

  constructor(rules: ValidationRules = DEFAULT_VALIDATION_RULES) {
    this.rules = rules
  }

  // 連続勤務日数チェック
  checkConsecutiveWorkDays(
    staffId: string,
    shifts: Shift[],
    targetDate: Date
  ): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    const staffShifts = shifts
      .filter(s => s.staffId === staffId && s.status !== 'キャンセル')
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    let consecutiveDays = 0
    let maxConsecutive = 0

    for (let i = 0; i < staffShifts.length; i++) {
      if (i === 0) {
        consecutiveDays = 1
      } else {
        const prevDate = new Date(staffShifts[i - 1].date)
        const currDate = new Date(staffShifts[i].date)
        const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        
        if (dayDiff === 1) {
          consecutiveDays++
        } else {
          consecutiveDays = 1
        }
      }
      
      maxConsecutive = Math.max(maxConsecutive, consecutiveDays)
    }

    if (maxConsecutive > this.rules.maxConsecutiveWorkDays) {
      errors.push({
        type: 'CONSECUTIVE_WORK_DAYS_EXCEEDED',
        message: `連続勤務日数が${this.rules.maxConsecutiveWorkDays}日を超えています（${maxConsecutive}日）`,
        details: { staffId, consecutiveDays: maxConsecutive }
      })
    } else if (maxConsecutive === this.rules.maxConsecutiveWorkDays) {
      warnings.push({
        type: 'CONSECUTIVE_WORK_DAYS_AT_LIMIT',
        message: `連続勤務日数が上限の${this.rules.maxConsecutiveWorkDays}日に達しています`,
        details: { staffId, consecutiveDays: maxConsecutive }
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // 月間休日数チェック
  checkMonthlyHolidays(
    staffId: string,
    shifts: Shift[],
    year: number,
    month: number
  ): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    const daysInMonth = new Date(year, month, 0).getDate()
    const workDays = shifts.filter(s => 
      s.staffId === staffId && 
      s.status !== 'キャンセル' &&
      s.date.getMonth() === month - 1 &&
      s.date.getFullYear() === year
    ).length
    
    const holidays = daysInMonth - workDays

    if (holidays < this.rules.minMonthlyHolidays) {
      errors.push({
        type: 'INSUFFICIENT_HOLIDAYS',
        message: `月間休日数が${this.rules.minMonthlyHolidays}日未満です（${holidays}日）`,
        details: { staffId, holidays, required: this.rules.minMonthlyHolidays }
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // 週間労働時間チェック
  checkWeeklyHours(
    staffId: string,
    shifts: Shift[],
    weekStartDate: Date
  ): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    const weekEnd = new Date(weekStartDate)
    weekEnd.setDate(weekEnd.getDate() + 7)
    
    const weekShifts = shifts.filter(s => 
      s.staffId === staffId &&
      s.status !== 'キャンセル' &&
      s.date >= weekStartDate &&
      s.date < weekEnd
    )
    
    const totalHours = weekShifts.reduce((sum, shift) => {
      const start = new Date(`2000-01-01T${shift.startTime}`)
      const end = new Date(`2000-01-01T${shift.endTime}`)
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      const breakHours = shift.breakMinutes / 60
      return sum + hours - breakHours
    }, 0)

    if (totalHours > this.rules.maxWeeklyHours) {
      errors.push({
        type: 'WEEKLY_HOURS_EXCEEDED',
        message: `週間労働時間が${this.rules.maxWeeklyHours}時間を超えています（${totalHours}時間）`,
        details: { staffId, totalHours, maxHours: this.rules.maxWeeklyHours }
      })
    } else if (totalHours > this.rules.maxWeeklyHours * 0.9) {
      warnings.push({
        type: 'WEEKLY_HOURS_HIGH',
        message: `週間労働時間が上限の90%を超えています（${totalHours}時間）`,
        details: { staffId, totalHours }
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // 最低人員チェック
  checkMinimumStaffing(
    date: Date,
    shifts: Shift[],
    staff: Staff[]
  ): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    const dayShifts = shifts.filter(s => 
      s.date.toDateString() === date.toDateString() &&
      s.status === '確定'
    )
    
    const staffByRole = new Map<string, number>()
    
    dayShifts.forEach(shift => {
      const staffMember = staff.find(s => s.id === shift.staffId)
      if (staffMember) {
        const count = staffByRole.get(staffMember.role) || 0
        staffByRole.set(staffMember.role, count + 1)
      }
    })
    
    Object.entries(this.rules.minimumStaffing).forEach(([role, minCount]) => {
      const actualCount = staffByRole.get(role) || 0
      if (actualCount < minCount) {
        errors.push({
          type: 'INSUFFICIENT_STAFF',
          message: `${role}の人数が不足しています（必要: ${minCount}名, 実際: ${actualCount}名）`,
          details: { date, role, required: minCount, actual: actualCount }
        })
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // 資格要件チェック
  checkQualificationRequirements(
    date: Date,
    shifts: Shift[],
    staff: Staff[],
    requiredQualifications: string[]
  ): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    const dayShifts = shifts.filter(s => 
      s.date.toDateString() === date.toDateString() &&
      s.status === '確定'
    )
    
    const availableQualifications = new Set<string>()
    
    dayShifts.forEach(shift => {
      const staffMember = staff.find(s => s.id === shift.staffId)
      if (staffMember) {
        staffMember.qualifications.forEach(q => availableQualifications.add(q))
      }
    })
    
    requiredQualifications.forEach(qualification => {
      if (!availableQualifications.has(qualification)) {
        errors.push({
          type: 'MISSING_QUALIFICATION',
          message: `${qualification}の資格を持つスタッフが配置されていません`,
          details: { date, qualification }
        })
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // 休憩時間間隔チェック
  checkRestHoursBetweenShifts(
    staffId: string,
    shifts: Shift[]
  ): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    const staffShifts = shifts
      .filter(s => s.staffId === staffId && s.status !== 'キャンセル')
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    for (let i = 0; i < staffShifts.length - 1; i++) {
      const currentShift = staffShifts[i]
      const nextShift = staffShifts[i + 1]
      
      const currentEnd = new Date(`${currentShift.date.toISOString().split('T')[0]}T${currentShift.endTime}`)
      const nextStart = new Date(`${nextShift.date.toISOString().split('T')[0]}T${nextShift.startTime}`)
      
      const restHours = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60)
      
      if (restHours < this.rules.minRestHoursBetweenShifts) {
        errors.push({
          type: 'INSUFFICIENT_REST',
          message: `シフト間の休憩時間が${this.rules.minRestHoursBetweenShifts}時間未満です（${restHours}時間）`,
          details: { 
            staffId, 
            date1: currentShift.date, 
            date2: nextShift.date,
            restHours 
          }
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // 総合バリデーション
  validateShift(
    shift: Shift,
    allShifts: Shift[],
    staff: Staff[],
    specialRequirements?: {
      requiredQualifications?: string[]
    }
  ): ValidationResult {
    const allErrors: ValidationError[] = []
    const allWarnings: ValidationWarning[] = []
    
    // 各種チェックを実行
    const consecutiveCheck = this.checkConsecutiveWorkDays(shift.staffId, allShifts, shift.date)
    allErrors.push(...consecutiveCheck.errors)
    allWarnings.push(...consecutiveCheck.warnings)
    
    const weeklyHoursCheck = this.checkWeeklyHours(
      shift.staffId, 
      allShifts, 
      this.getWeekStartDate(shift.date)
    )
    allErrors.push(...weeklyHoursCheck.errors)
    allWarnings.push(...weeklyHoursCheck.warnings)
    
    const restHoursCheck = this.checkRestHoursBetweenShifts(shift.staffId, [...allShifts, shift])
    allErrors.push(...restHoursCheck.errors)
    allWarnings.push(...restHoursCheck.warnings)
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    }
  }

  private getWeekStartDate(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }
}