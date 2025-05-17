import React from 'react'
import { SentimentAnalysis } from '../types'

interface SentimentAnalysisCardProps {
  data: SentimentAnalysis[] | null | undefined
  isLoading: boolean
}

const SentimentAnalysisCard: React.FC<SentimentAnalysisCardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-500">Aucune analyse de sentiment disponible</div>
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-4">
      {data.map((analysis) => (
        <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className={`font-medium ${getSentimentColor(analysis.sentiment)}`}>
              {analysis.sentiment}
            </p>
            <p className="text-sm text-gray-500">
              Score: {analysis.score.toFixed(2)}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(analysis.date).toLocaleDateString('fr-FR')}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SentimentAnalysisCard 