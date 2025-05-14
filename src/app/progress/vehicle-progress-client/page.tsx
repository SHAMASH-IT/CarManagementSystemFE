"use client"

import { VehicleProgressTracker } from "./vehicle-progress-tracker"
import Sidebar from "../../common/Sidebar"
import Navbar from "../../common/Navbar"

export default function VehicleProgressClientPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <VehicleProgressTracker />
          </div>
        </main>
      </div>
    </div>
  )
}
