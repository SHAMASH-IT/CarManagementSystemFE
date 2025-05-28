'use client'
import { useState, useEffect } from 'react'
import stockService from '../services/stockService'
import { Stock } from '../../types'

interface CreateStockData {
  name: string
  stock: number
  threshold: number
  price: number
  initialPrice: number
  marque: string
  categoryId: number
}

interface Category {
  id: number
  name: string
  providerId: number // Ajout du providerId
}

export const useStock = () => {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [providerId, setProviderId] = useState<number | null>(null)

  // Fonction pour extraire le providerId du token JWT
  const getProviderIdFromToken = () => {
    const token = localStorage.getItem("token")
    if (!token) return null

    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )

      const userData = JSON.parse(jsonPayload)
      return userData?.sub ? parseInt(userData.sub) : null
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error)
      return null
    }
  }

  const fetchStocks = async () => {
    setIsLoading(true)
    try {
      const currentProviderId = getProviderIdFromToken()
      if (!currentProviderId) throw new Error("Provider non identifié")
      
      setProviderId(currentProviderId)
      // Utilisez la nouvelle méthode pour récupérer les pièces par providerId
      const data = await stockService.getPiecesByProviderId(currentProviderId)
      setStocks(data)
      setError(null)
    } catch (err) {
      setError('Erreur lors de la récupération des stocks')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const currentProviderId = getProviderIdFromToken()
      if (!currentProviderId) throw new Error("Provider non identifié")
      
      // Utilisez la méthode pour récupérer les catégories par providerId
      const data = await stockService.getCategoriesByProviderId(currentProviderId)
      setCategories(data)
      setError(null)
    } catch (err) {
      setError('Erreur lors de la récupération des catégories')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const addStock = async (stockData: CreateStockData) => {
    setIsLoading(true)
    try {
      console.log('Hook useStock - Données à envoyer:', stockData)
      const newStock = await stockService.addStock(stockData)
      console.log('Hook useStock - Réponse reçue:', newStock)
      setStocks(prev => [...prev, newStock])
      setError(null)
      return true
    } catch (err) {
      console.error('Hook useStock - Erreur:', err)
      setError('Erreur lors de l\'ajout')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateStock = async (id: string, stockData: Partial<Stock>) => {
    setIsLoading(true)
    try {
      const updatedStock = await stockService.updateStock(id, stockData)
      setStocks(prev =>
        prev.map(stock =>
          stock.id === id ? updatedStock : stock
        )
      )
      setError(null)
      return true
    } catch (err) {
      setError('Erreur lors de la mise à jour')
      console.error(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deleteStock = async (id: string) => {
    setIsLoading(true)
    try {
      await stockService.deleteStock(id)
      setStocks(prev => prev.filter(stock => stock.id !== id))
      setError(null)
      return true
    } catch (err) {
      setError('Erreur lors de la suppression')
      console.error(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStocks()
    fetchCategories()
  }, [])

  return {
    stocks,
    categories,
    isLoading,
    error,
     providerId,
    fetchStocks,
    fetchCategories,
    addStock,
    updateStock,
    deleteStock
  }
}
