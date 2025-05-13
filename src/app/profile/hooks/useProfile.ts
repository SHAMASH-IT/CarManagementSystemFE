import { useState, useEffect } from 'react';
import { UserProfile, UpdateProfileDto, getUserProfile, updateUserProfile } from '../services/profileService';

export const useProfile = (userId: number) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      // Ne pas faire l'appel API si userId est 0
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserProfile(userId);
        setProfile(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (data: UpdateProfileDto) => {
    if (!userId) {
      throw new Error('ID utilisateur non valide');
    }

    try {
      setIsUpdating(true);
      await updateUserProfile(userId, data);
      // Recharger les données du profil après la mise à jour
      const updatedProfile = await getUserProfile(userId);
      setProfile(updatedProfile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    loading,
    error,
    isUpdating,
    updateProfile,
  };
}; 