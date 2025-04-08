'use client'
import { useState, useEffect } from 'react'
import { stockService } from '../services/stockService'
import { Stock } from '../../types'

interface CreateStockData {
  name: string
  stock: number
  threshold: number
  price: number
  categoryId: number
}

interface Category {
  id: number
  name: string
}

export const useStock = () => {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStocks = async () => {
    setIsLoading(true)
    try {
      const data = await stockService.getAllStocks()
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
      const data = await stockService.getAllCategories()
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
      const newStock = await stockService.addStock(stockData)
      setStocks(prev => [...prev, newStock])
      setError(null)
      return true
    } catch (err) {
      setError('Erreur lors de l\'ajout')
      console.error(err)
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
    fetchStocks,
    fetchCategories,
    addStock,
    updateStock,
    deleteStock
  }
}
