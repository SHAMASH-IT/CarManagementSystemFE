'use client'
import React from 'react';
import Sidebar from '../../common/Sidebar';
import Navbar from '../../common/Navbar';
import VehicleManager from './VehicleManager';

export default function VehiclePage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <VehicleManager />
        </main>
      </div>
    </div>
  );
}