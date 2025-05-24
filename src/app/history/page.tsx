"use client"

import { InterventionHistory } from "./components/InterventionHistoryClient"
import Sidebar from "../common/Sidebar"
import Navbar from "../common/Navbar"

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-2 sm:p-4">
          <InterventionHistory />
        </main>
      </div>
    </div>
  )
} 