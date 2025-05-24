'use client'

import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { FaSpinner, FaSave, FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard, FaCheck, FaInfoCircle, FaExclamationCircle, FaCar, FaWrench, FaTools, FaCog, FaShieldAlt, FaCamera, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../login/services/auth.service';

export default function ProfileForm() {
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'warning', message: string } | null>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const { profile, loading, error, isUpdating, updateProfile } = useProfile(userId ? parseInt(userId) : 0);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Récupérer l'ID de l'utilisateur authentifié
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const userData = JSON.parse(jsonPayload);
        console.log('Token décodé:', userData); // Debug log

        if (userData && userData.sub) {
          console.log('ID trouvé:', userData.sub); // Debug log
          setUserId(userData.sub.toString());
        } else {
          console.error('Token invalide: sub manquant dans', userData);
          setNotification({
            type: 'warning',
            message: 'Session invalide. Veuillez vous reconnecter.'
          });
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        setNotification({
          type: 'warning',
          message: 'Erreur lors de la récupération de vos informations. Veuillez vous reconnecter.'
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setNotification({
        type: 'warning',
        message: 'Vous devez être connecté pour accéder à cette page.'
      });
    }
  }, []);

  // Message de bienvenue unique
  useEffect(() => {
    if (profile && !hasShownWelcome) {
      setNotification({
        type: 'success',
        message: `Bienvenue ${profile.name} ! Vous pouvez modifier vos informations ci-dessous.`
      });
      setHasShownWelcome(true);
      setTimeout(() => setNotification(null), 5000);
    }
  }, [profile, hasShownWelcome]);

  // Mettre à jour les champs du formulaire quand le profil est chargé
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      }));
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showPasswordFields && formData.newPassword !== formData.confirmPassword) {
      setNotification({
        type: 'warning',
        message: 'Les mots de passe ne correspondent pas. Veuillez vérifier.'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    // Ne pas envoyer les champs vides
    const updateData: Record<string, string> = {};
    const changes: string[] = [];
    
    if (formData.name && formData.name !== profile?.name) {
      updateData.name = formData.name;
      changes.push('nom');
    }
    if (formData.email && formData.email !== profile?.email) {
      updateData.email = formData.email;
      changes.push('email');
    }
    if (formData.phone && formData.phone !== profile?.phone) {
      updateData.phone = formData.phone;
      changes.push('numéro de téléphone');
    }
    if (showPasswordFields && formData.newPassword) {
      updateData.newPassword = formData.newPassword;
      changes.push('mot de passe');
    }

    if (changes.length === 0) {
      return; // Ne pas afficher de message si aucune modification
    }

    try {
      await updateProfile(updateData);
      // Afficher un message spécifique pour chaque type de modification
      if (changes.includes('mot de passe')) {
        setNotification({
          type: 'success',
          message: 'Votre mot de passe a été modifié avec succès.'
        });
      } else {
        const isPlural = changes.length > 1;
        setNotification({
          type: 'success',
          message: `${isPlural ? 'Vos' : 'Votre'} ${changes.join(', ')} ${isPlural ? 'ont' : 'a'} été modifié${isPlural ? 's' : ''} avec succès`
        });
      }
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification({
        type: 'warning',
        message: 'Erreur lors de la mise à jour. Veuillez réessayer.'
      });
      setTimeout(() => setNotification(null), 5000);
    }
    
    // Réinitialiser les champs de mot de passe après la mise à jour
    if (showPasswordFields) {
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
      setShowPasswordFields(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6"
      >
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FaExclamationCircle className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-yellow-800">Non connecté</h3>
          </div>
          <p className="text-yellow-600 mb-4">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6"
      >
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FaUser className="text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800">Erreur</h3>
          </div>
          <p className="text-red-600 mb-4">Une erreur est survenue lors du chargement de votre profil.</p>
          <p className="text-sm text-red-500">Veuillez vérifier votre connexion et réessayer.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Section Photo avec Carrousel */}
            <div className="relative h-full min-h-[600px] overflow-hidden">
              <AnimatePresence mode="sync">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={images[currentImageIndex]}
                    alt="Services Automobile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-900/50"></div>
                </motion.div>
              </AnimatePresence>
              
              

              {/* Indicateurs de diapositives */}
              <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>

            {/* Section Formulaire */}
            <div className="p-8 lg:p-12">
              {/* En-tête du formulaire */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                    <FaUser className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Modifier le profil
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Mettez à jour vos informations personnelles
                    </p>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-6 p-4 rounded-lg ${
                    notification.type === 'success' ? 'bg-green-50 text-green-800' :
                    notification.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                    'bg-blue-50 text-blue-800'
                  }`}
                >
                  <div className="flex items-center">
                    {notification.type === 'success' ? <FaCheck className="mr-2" /> :
                     notification.type === 'warning' ? <FaExclamationCircle className="mr-2" /> :
                     <FaInfoCircle className="mr-2" />}
                    <p>{notification.message}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Informations personnelles */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-500 w-4 h-4" />
                    Informations personnelles
                  </h3>
                  
                  {/* Grille 2 colonnes pour les champs */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Nom */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                        Nom complet
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400 w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-8 w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400 w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-8 w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400 w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="pl-8 w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Votre numéro"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section mot de passe */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <FaLock className="text-blue-500 w-4 h-4" />
                      Mot de passe
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showPasswordFields ? 'Annuler' : 'Modifier le mot de passe'}
                    </button>
                  </div>

                  {showPasswordFields && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="newPassword" className="block text-xs font-medium text-gray-700 mb-1">
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400 w-4 h-4" />
                          </div>
                          <input
                            type="password"
                            id="newPassword"
                            value={formData.newPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="pl-8 w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Nouveau mot de passe"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                          Confirmer le mot de passe
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400 w-4 h-4" />
                          </div>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="pl-8 w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Confirmer le mot de passe"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bouton de soumission */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Enregistrer les modifications
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 