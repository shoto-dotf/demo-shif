import { useState } from 'react'
import ShiftCalendar from './components/ShiftCalendar'
import StaffList from './components/StaffList'
import ShiftStats from './components/ShiftStats'
import { sampleShifts, staffData } from './data/demoData'

function App() {
  const [selectedMonth] = useState('2025-06')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                神戸池澤クリニック シフト管理システム
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('ja-JP', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedMonth.replace('-', '年')}月のシフト表
                </h2>
              </div>
              <ShiftCalendar month={selectedMonth} shifts={sampleShifts[selectedMonth]} />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">スタッフ一覧</h3>
              <StaffList staff={staffData} />
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">統計情報</h3>
              <ShiftStats month={selectedMonth} shifts={sampleShifts[selectedMonth]} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App