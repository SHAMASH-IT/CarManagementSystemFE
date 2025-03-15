import { useState, useEffect } from 'react'

import type { User } from '../../types'
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/userService'

export const useUsers = () => {
  // Spécifiez explicitement le type User[] pour l'état
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchUsers()
      .then(setUsers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addUser = async (data: any) => {
    try {
      setLoading(true)
      const newUser = await createUser(data)

      setUsers(prev => [...prev, newUser])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateUserById = async (id: string, data: any) => {
    try {
      setLoading(true)

      // Convertir l'ID string en number pour l'API
      const numericId = parseInt(id, 10)
      const updatedUser = await updateUser(numericId, data)

      setUsers(prev => prev.map(user => (user.id === id ? updatedUser : user)))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteUserById = async (id: string) => {
    try {
      setLoading(true)

      // Convertir l'ID string en number pour l'API
      const numericId = parseInt(id, 10)

      await deleteUser(numericId)

      setUsers(prev => prev.filter(user => user.id !== id))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { users, addUser, updateUserById, deleteUserById, loading, error }
}
