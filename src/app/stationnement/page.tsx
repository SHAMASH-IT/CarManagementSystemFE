'use client'

import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'
import StationnementList from './components/StationnementList'

export default function StationnementPage() {
  return (
    <div className='flex flex-row h-screen'>
      {/* Sidebar */}
      <Sidebar />
      <div className='flex flex-col flex-1'>
        {/* Navbar */}
        <Navbar />
        <div className='flex flex-1'>
          <div className='flex-1 overflow-hidden relative'>
            {/* Main content: StationnementList */}
            <StationnementList />
          </div>
        </div>
      </div>
    </div>
  )
}
