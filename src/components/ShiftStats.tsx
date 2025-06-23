interface ShiftStatsProps {
  month: string
  shifts: any[]
}

export default function ShiftStats({ month, shifts }: ShiftStatsProps) {
  const totalStaff = 14
  const workDays = shifts.filter(s => s.staffAssignments.length > 0).length
  const averageStaffPerDay = shifts.reduce((sum, day) => sum + day.staffAssignments.length, 0) / workDays || 0
  
  const stats = [
    { label: '稼働日数', value: `${workDays}日` },
    { label: '平均配置人数', value: `${averageStaffPerDay.toFixed(1)}人/日` },
    { label: '内視鏡検査日', value: '8日' },
    { label: '充足率', value: '95%' },
  ]

  return (
    <div className="space-y-3">
      {stats.map((stat) => (
        <div key={stat.label} className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{stat.label}</span>
          <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}