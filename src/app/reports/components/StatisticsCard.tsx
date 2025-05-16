import React from 'react'

interface StatisticsCardProps {
  title: string
  value: number | undefined
  isLoading: boolean
  isRating?: boolean
  isCurrency?: boolean
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  isLoading,
  isRating,
  isCurrency
}) => {
  const formatValue = () => {
    if (isLoading) return '...'
    if (value === undefined) return 'Non disponible'
    if (isRating) {
      const numValue = Number(value)
      return isNaN(numValue) ? 'Non disponible' : `${numValue.toFixed(1)}/5`
    }
    if (isCurrency) {
      const numValue = Number(value)
      return isNaN(numValue) ? 'Non disponible' : `${numValue.toLocaleString('fr-FR')} €`
    }
    const numValue = Number(value)
    return isNaN(numValue) ? 'Non disponible' : numValue.toLocaleString('fr-FR')
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">
        {formatValue()}
      </p>
    </div>
  )
}

export default StatisticsCard 