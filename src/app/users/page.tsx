'use client'
import { useState } from 'react'

import { ToastContainer } from 'react-toastify'

import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'
import CalendarManager from './components/CalendarManager'
import type { CalendarEvent } from '../types/index'
import  ProtectRoute  from '@/protectRoute/protect'

export default function CalendarPage() {
  const [events] = useState<CalendarEvent[]>([])

  return (
    <div className='flex flex-row h-screen'>
    
      <Sidebar />
    
      <div className='flex flex-col flex-1'>
     
        <Navbar />
      
        
        <div className='flex flex-1'>
          <div className='flex-1 overflow-hidden relative'>
           
          
            <CalendarManager initialEvents={events} />
         
          </div>
        </div>
      </div>
      <ToastContainer />
     
    </div>
  )
}
