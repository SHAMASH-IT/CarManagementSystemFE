import type { CreateUserDto, UpdateUserDto, User, ApiUser } from '../../types/index'
import { transformUserData, mapRoleToBackend } from '../services/ApiTransformData'

const API_URL = process.env.NEXT_PUBLIC_APP_URL

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/users/all-users`)

  if (!res.ok) throw new Error('Failed to fetch users')

  const apiUsers: ApiUser[] = await res.json()

  return apiUsers.map(transformUserData)
}

export const createUser = async (data: CreateUserDto): Promise<User> => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) throw new Error('Failed to create user')

  const apiUser: ApiUser = await res.json()

  return transformUserData(apiUser)
}

export const updateUser = async (id: number, data: UpdateUserDto): Promise<User> => {
  // If role is included in data, map it to backend format
  if (data.role) {
    data.role = mapRoleToBackend(data.role)
  }

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) throw new Error('Failed to update user')

  const apiUser: ApiUser = await res.json()

  return transformUserData(apiUser)
}

export const deleteUser = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE'
  })

  if (!res.ok) throw new Error('Failed to delete user')
}
