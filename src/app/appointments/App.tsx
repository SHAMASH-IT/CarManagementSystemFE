import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'
import AppointmentsPage from './page'

const App: React.FC = () => {
  return (
    <Router>
      <div className='flex h-screen'>
        <Sidebar />
        <div className='flex-grow'>
          <Navbar />
          <Routes>
            <Route path='/page' element={<AppointmentsPage />} />
            {/* Ajoutez d'autres routes ici si nécessaire */}
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
