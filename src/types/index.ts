// 神戸池澤クリニック シフト管理システム TypeScript型定義

// スタッフ関連
export interface Staff {
  id: string
  name: string
  role: '医師' | '看護師' | '医療事務' | '放射線技師' | '美容スタッフ'
  employmentType: '常勤' | '非常勤'
  qualifications: string[]
  workingHours: {
    weeklyHours: number
    desiredHolidaysPerMonth: number
  }
  email: string
  phone?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// シフトパターン
export interface ShiftPattern {
  id: string
  name: string
  startTime: string // HH:mm format
  endTime: string
  breakMinutes: number
  isActive: boolean
  createdAt: Date
}

// 標準シフトパターン
export const STANDARD_SHIFT_PATTERNS: Omit<ShiftPattern, 'id' | 'createdAt'>[] = [
  { name: '早番', startTime: '08:30', endTime: '17:30', breakMinutes: 60, isActive: true },
  { name: '遅番', startTime: '10:00', endTime: '19:00', breakMinutes: 60, isActive: true },
  { name: '通常', startTime: '09:00', endTime: '18:00', breakMinutes: 60, isActive: true },
  { name: '土曜午前', startTime: '09:00', endTime: '13:00', breakMinutes: 0, isActive: true },
  { name: '土曜終日', startTime: '09:00', endTime: '17:00', breakMinutes: 60, isActive: true }
]

// シフト
export interface Shift {
  id: string
  staffId: string
  date: Date
  shiftPatternId?: string
  startTime: string
  endTime: string
  breakMinutes: number
  status: '確定' | '仮' | '申請中' | 'キャンセル'
  createdBy?: string
  approvedBy?: string
  createdAt: Date
  updatedAt: Date
}

// 希望休申請
export interface LeaveRequest {
  id: string
  staffId: string
  date: Date
  priority: '必須' | '希望'
  reason?: string
  status: '申請中' | '承認' | '却下' | '取消'
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// シフト交代申請
export interface ShiftSwapRequest {
  id: string
  requesterId: string
  targetStaffId: string
  requesterShiftId: string
  targetShiftId: string
  reason?: string
  status: '申請中' | '承認待ち' | '承認' | '却下' | '取消'
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// 最低人員要件
export interface MinimumStaffingRequirement {
  id: string
  dayOfWeek?: number // 0-6 (日-土)
  timeSlot: '午前' | '午後' | '全日'
  role: Staff['role']
  minimumCount: number
  isActive: boolean
  createdAt: Date
}

// 特殊業務日
export interface SpecialDutyDay {
  id: string
  date: Date
  dutyType: string
  requiredQualifications: string[]
  requiredStaffCount: number
  createdAt: Date
}

// 通知
export interface Notification {
  id: string
  recipientId: string
  type: 'シフト確定' | '申請承認' | '申請却下' | 'シフト変更' | 'リマインダー'
  title: string
  message: string
  isRead: boolean
  readAt?: Date
  createdAt: Date
}

// バリデーションルール
export interface ValidationRules {
  // 労働基準法準拠
  maxConsecutiveWorkDays: number
  minMonthlyHolidays: number
  maxWeeklyHours: number
  maxDailyHours: number
  minRestHoursBetweenShifts: number
  
  // 医療機関特有
  minimumStaffing: {
    医師: number
    看護師: number
    医療事務: number
    放射線技師?: number
    美容スタッフ?: number
  }
  
  // 希望休制限
  maxLeaveRequestsPerMonth: number
  leaveRequestDeadlineDays: number
}

// デフォルトバリデーションルール
export const DEFAULT_VALIDATION_RULES: ValidationRules = {
  maxConsecutiveWorkDays: 6,
  minMonthlyHolidays: 8,
  maxWeeklyHours: 40,
  maxDailyHours: 8,
  minRestHoursBetweenShifts: 11,
  minimumStaffing: {
    医師: 1,
    看護師: 2,
    医療事務: 1
  },
  maxLeaveRequestsPerMonth: 3,
  leaveRequestDeadlineDays: 14
}

// バリデーション結果
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  type: string
  message: string
  details?: any
}

export interface ValidationWarning {
  type: string
  message: string
  details?: any
}

// ダッシュボード統計
export interface DashboardStats {
  totalStaff: number
  shiftsThisMonth: number
  pendingRequests: number
  understaffedDays: number
  averageWorkHours: number
  holidayUtilization: number
}

// シフト統計
export interface ShiftStats {
  staffId: string
  month: string
  totalWorkDays: number
  totalWorkHours: number
  totalHolidays: number
  overtimeHours: number
  nightShifts: number
  weekendShifts: number
}