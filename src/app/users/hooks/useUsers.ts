'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: 'ADMIN' | 'USER' | 'PROVIDER'
  vehicles?: Vehicle[]
}

interface Vehicle {
  id: number
  brand: string
  model: string
  year: number
  registration: string
  userId: number
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const API_URL = process.env.NEXT_PUBLIC_APP_URL

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/users`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs')
      }

      const data = await response.json()

      setUsers(data)

      return data
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Impossible de charger les utilisateurs. Veuillez réessayer plus tard.')

      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch current user (usually used in client-side components)
  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/users/me`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil utilisateur')
      }

      const data = await response.json()

      setCurrentUser(data)

      return data
    } catch (err) {
      console.error('Error fetching current user:', err)
      setError('Impossible de charger votre profil. Veuillez réessayer plus tard.')

      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch vehicles for a specific user
  const fetchUserVehicles = async (userId?: number) => {
    try {
      setIsLoading(true)
      setError(null)

      // If userId is not provided, try to get vehicles for the current user
      const endpoint = userId ? `${API_URL}/vehicles/user/${userId}` : `${API_URL}/vehicles/me`

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des véhicules')
      }

      const data = await response.json()

      setUserVehicles(data)

      return data
    } catch (err) {
      console.error('Error fetching user vehicles:', err)
      setError('Impossible de charger les véhicules. Veuillez réessayer plus tard.')

      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Get vehicle by ID
  const getVehicleById = (vehicleId: number) => {
    return userVehicles.find(vehicle => vehicle.id === vehicleId) || null
  }

  // Get user by ID
  const getUserById = (userId: number) => {
    return users.find(user => user.id === userId) || null
  }

  useEffect(() => {
    // Optionally fetch current user on hook initialization
    // fetchCurrentUser()
  }, [])

  return {
    users,
    currentUser,
    userVehicles,
    isLoading,
    error,
    fetchUsers,
    fetchCurrentUser,
    fetchUserVehicles,
    getVehicleById,
    getUserById
  }
}

export default useUsers
