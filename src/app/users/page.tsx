'use client'

import type React from 'react'

import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'

// eslint-disable-next-line import/no-named-as-default
import CalendarView from '../users/components/UserList'

// Initial events for the calendar
const initialEvents = [
  {
    service: 'Exemple de rendez-vous',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1))
  }
]

const Home: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <CalendarView initialEvents={initialEvents} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
