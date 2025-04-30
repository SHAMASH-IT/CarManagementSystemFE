export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
  newPassword?: string;
}

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const response = await fetch(`http://localhost:3005/users/${userId}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du profil');
  }
  return response.json();
};

export const updateUserProfile = async (userId: number, data: UpdateProfileDto): Promise<void> => {
  const response = await fetch(`http://localhost:3005/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour du profil');
  }
}; 