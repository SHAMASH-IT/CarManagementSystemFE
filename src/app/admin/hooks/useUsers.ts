import { useState, useEffect } from 'react';
import { userService, User, CreateUserDto, UpdateUserDto } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      // S'assurer que data est un tableau avant de le définir
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Les données reçues ne sont pas un tableau:', data);
        setUsers([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors du chargement des utilisateurs: ${errorMessage}`);
      console.error('Erreur détaillée:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouvel utilisateur
  const createUser = async (userData: CreateUserDto) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await userService.createUser(userData);
      setUsers(prevUsers => [...prevUsers, newUser]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la création de l'utilisateur: ${errorMessage}`);
      console.error('Erreur détaillée:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un utilisateur
  const updateUser = async (id: number, userData: UpdateUserDto) => {
    try {
      setLoading(true);
      setError(null);
      await userService.updateUser(id, userData);
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === id ? { ...user, ...userData } : user)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la mise à jour de l'utilisateur: ${errorMessage}`);
      console.error('Erreur détaillée:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await userService.deleteUser(id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la suppression de l'utilisateur: ${errorMessage}`);
      console.error('Erreur détaillée:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    loadUsers
  };
}; 