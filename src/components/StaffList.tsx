import { Staff } from '../types'

interface StaffListProps {
  staff: Staff[]
}

const roleColors: Record<string, string> = {
  '医師': 'bg-red-100 text-red-800',
  '看護師': 'bg-blue-100 text-blue-800',
  '医療事務': 'bg-green-100 text-green-800',
  '放射線技師': 'bg-yellow-100 text-yellow-800',
  '美容スタッフ': 'bg-purple-100 text-purple-800',
}

export default function StaffList({ staff }: StaffListProps) {
  const staffByRole = staff.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = []
    }
    acc[member.role].push(member)
    return acc
  }, {} as Record<string, Staff[]>)

  return (
    <div className="space-y-4">
      {Object.entries(staffByRole).map(([role, members]) => (
        <div key={role}>
          <h4 className="text-sm font-medium text-gray-700 mb-2">{role}</h4>
          <div className="space-y-1">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{member.name}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      roleColors[member.role]
                    }`}
                  >
                    {member.employmentType}
                  </span>
                </div>
                {member.qualifications.length > 0 && (
                  <span className="text-xs text-gray-500" title={member.qualifications.join(', ')}>
                    資格有
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}