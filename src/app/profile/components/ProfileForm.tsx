import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { FaSpinner, FaSave, FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard, FaCheck, FaInfoCircle, FaExclamationCircle, FaCar, FaWrench, FaTools, FaCog, FaShieldAlt, FaCamera, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileForm() {
  const [userId, setUserId] = useState<string>('1');
  const [isSearching, setIsSearching] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'warning', message: string } | null>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const { profile, loading, error, isUpdating, updateProfile } = useProfile(parseInt(userId));
  
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
    }, 5000); // Change d'image toutes les 5 secondes

    return () => clearInterval(interval);
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

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    setIsSearching(false);
  };

  const handleSearchUser = () => {
    if (userId.trim() === '') return;
    setIsSearching(true);
  };

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
          message: `${isPlural ? 'Tes' : 'Ton'} ${changes.join(', ')} ${isPlural ? 'ont' : 'a'} été modifié${isPlural ? 's' : ''} avec succès`
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

  if (loading || isSearching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-24 h-24 mb-6"
        >
          <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
          <div className="absolute inset-3 rounded-full border-2 border-dashed border-gray-200"></div>
          <div className="absolute inset-6 rounded-full bg-blue-100 flex items-center justify-center">
            <FaCar className="text-blue-600 text-2xl" />
          </div>
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 font-medium text-lg"
        >
          Recherche de l'utilisateur...
        </motion.p>
      </div>
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
            <h3 className="text-lg font-medium text-red-800">Utilisateur non trouvé</h3>
          </div>
          <p className="text-red-600 mb-4">L'utilisateur avec l'ID {userId} n'existe pas.</p>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="text-gray-400" />
              </div>
              <input
                type="number"
                value={userId}
                onChange={handleUserIdChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez un autre ID d'utilisateur"
                min="1"
              />
            </div>
          </div>
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
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profile?.name || 'Utilisateur'}
                </h2>
                <p className="text-blue-100 text-lg">Membre depuis 2024</p>
              </div>

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

              {/* Champ de recherche utilisateur */}
              <div className="mb-6">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="w-48">
                    <label htmlFor="userId" className="block text-xs font-medium text-gray-600 mb-1">
                      ID Utilisateur
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaIdCard className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="userId"
                        value={userId}
                        onChange={handleUserIdChange}
                        className="pl-8 w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="ID"
                        min="1"
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearchUser}
                    className="mt-5 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 h-[34px]"
                  >
                    <FaSearch className="w-3 h-3" />
                    Rechercher
                  </motion.button>
                </div>
              </div>

              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg flex items-center ${
                    notification.type === 'success' ? 'bg-green-50 border border-green-200' :
                    notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className={`p-2 rounded-full mr-3 ${
                    notification.type === 'success' ? 'bg-green-100' :
                    notification.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {notification.type === 'success' ? <FaCheck className="text-green-600" /> :
                     notification.type === 'warning' ? <FaExclamationCircle className="text-yellow-600" /> :
                     <FaInfoCircle className="text-blue-600" />}
                  </div>
                  <p className={`${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>{notification.message}</p>
                </motion.div>
              )}

              {/* Formulaire principal */}
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
                        Adresse email
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
                          placeholder="Votre email"
                        />
                      </div>
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                        Numéro de téléphone
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

                    {/* Espace réservé pour un futur champ si nécessaire */}
                    <div className="hidden md:block"></div>
                  </div>
                </div>

                {/* Section mot de passe */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <FaLock className="text-blue-500 w-4 h-4" />
                      Sécurité
                    </h3>
                    {!showPasswordFields && (
                      <motion.button
                        type="button"
                        onClick={() => setShowPasswordFields(true)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-2"
                      >
                        <FaShieldAlt className="w-4 h-4" />
                        Changer le mot de passe
                      </motion.button>
                    )}
                  </div>

                  {showPasswordFields && (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Nouveau mot de passe */}
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

                      {/* Confirmer mot de passe */}
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
                <div className="flex justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
                        <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="w-4 h-4 mr-2" />
                        <span>Enregistrer</span>
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