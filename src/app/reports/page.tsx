'use client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReportsDashboard from './components/ReportsDashboard'

const queryClient = new QueryClient()

export default function ReportsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6">Rapports et Statistiques</h1>
          <ReportsDashboard />
        </div>
      </div>
    </QueryClientProvider>
  )
} 