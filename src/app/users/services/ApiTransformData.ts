import type { ApiUser, User } from '../../types'

/**
 * Transforms API user data to frontend user format
 */
export const transformUserData = (apiUser: ApiUser): User => {
  return {
    id: String(apiUser.id),
    fullName: `${apiUser.firstName} ${apiUser.lastName}`,
    email: apiUser.email,
    phone: apiUser.phone || 'Non renseigné',
    role: mapRoleToFrontend(apiUser.role),
    createdAt: apiUser.createdAt
  }
}

/**
 * Maps backend role values to frontend role values
 */
export const mapRoleToFrontend = (backendRole: 'ADMIN' | 'USER' | 'PROVIDER'): string => {
  switch (backendRole) {
    case 'ADMIN':
      return 'ADMINISTRATEUR'
    case 'USER':
      return 'UTILISATEUR'
    case 'PROVIDER':
      return 'PRESTATAIRE'
    default:
      return 'UTILISATEUR'
  }
}

/**
 * Maps frontend role values to backend role values
 */
export const mapRoleToBackend = (frontendRole: string): 'ADMIN' | 'USER' | 'PROVIDER' => {
  switch (frontendRole) {
    case 'ADMINISTRATEUR':
      return 'ADMIN'
    case 'UTILISATEUR':
      return 'USER'
    case 'PRESTATAIRE':
      return 'PROVIDER'
    default:
      return 'USER'
  }
}
