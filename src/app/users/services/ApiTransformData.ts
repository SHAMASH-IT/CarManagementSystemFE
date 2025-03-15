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
export const mapRoleToFrontend = (backendRole: 'ADMIN' | 'CLIENT' | 'MECHANIC'): string => {
  switch (backendRole) {
    case 'ADMIN':
      return 'ADMINISTRATEUR'
    case 'CLIENT':
      return 'CLIENT'
    case 'MECHANIC':
      return 'MÉCANICIEN'
    default:
      return 'CLIENT'
  }
}

/**
 * Maps frontend role values to backend role values
 */
export const mapRoleToBackend = (frontendRole: string): 'ADMIN' | 'CLIENT' | 'MECHANIC' => {
  switch (frontendRole) {
    case 'ADMINISTRATEUR':
      return 'ADMIN'
    case 'CLIENT':
      return 'CLIENT'
    case 'MÉCANICIEN':
      return 'MECHANIC'
    default:
      return 'CLIENT'
  }
}
