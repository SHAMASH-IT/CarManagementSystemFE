import { Stock } from '../../types'
import axios from 'axios'

interface CreateStockData {
  name: string
  stock: number
  threshold: number
  price: number
  initialPrice: number
  marque: string
  categoryId: number
}

export class StockService {
  private API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

  // Récupérer toutes les catégories
  async getAllCategories(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.API_URL}/stock/categories`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
      throw new Error('Erreur lors de la récupération des catégories')
    }
  }

  // Récupérer tous les stocks
  async getAllStocks(): Promise<Stock[]> {
    try {
      const response = await axios.get(`${this.API_URL}/stock/pieces`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des stocks:', error)
      throw new Error('Erreur lors de la récupération des stocks')
    }
  }

  // Ajouter un stock
  async addStock(stockData: CreateStockData): Promise<Stock> {
    try {
      console.log('Données envoyées au serveur:', stockData)
      console.log('URL:', `${this.API_URL}/stock/pieces`)
      const response = await axios.post(`${this.API_URL}/stock/pieces`, stockData)
      console.log('Réponse du serveur:', response.data)
      return response.data
    } catch (error) {
      console.error('Erreur détaillée lors de l\'ajout du stock:', error)
      if (error.response) {
        console.error('Réponse d\'erreur:', error.response.data)
        console.error('Status:', error.response.status)
      }
      throw new Error('Erreur lors de l\'ajout du stock')
    }
  }

  // Mettre à jour un stock
  async updateStock(id: string, stockData: Partial<Stock>): Promise<Stock> {
    try {
      const response = await axios.put(`${this.API_URL}/stock/pieces/${id}`, stockData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error)
      throw new Error('Erreur lors de la mise à jour du stock')
    }
  }

  // Supprimer un stock
  async deleteStock(id: string): Promise<boolean> {
    try {
      await axios.delete(`${this.API_URL}/stock/pieces/${id}`)
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du stock:', error)
      throw new Error('Erreur lors de la suppression du stock')
    }
  }

  // Récupérer les pièces en dessous du seuil
  async getPiecesBelowThreshold(): Promise<Stock[]> {
    try {
      const response = await axios.get(`${this.API_URL}/stock/below-threshold`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des pièces en dessous du seuil:', error)
      throw new Error('Erreur lors de la récupération des pièces en dessous du seuil')
    }
  }
}

const stockService = new StockService()
export default stockService
