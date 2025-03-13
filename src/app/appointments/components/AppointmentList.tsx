'use client'
import React from 'react'

import Sidebar from '../../common/Sidebar'

import type { AppointmentListProps } from '../../types/index'

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ padding: '16px', flexGrow: 1 }}>
        <ul>
          {appointments.map(appointment => (
            <li key={appointment.id}>- {appointment.date}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AppointmentList
