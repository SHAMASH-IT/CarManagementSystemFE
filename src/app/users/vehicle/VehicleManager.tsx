import { useState, useEffect } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import type { Vehicle } from '../../types';
import { Car, Edit, Trash2, PlusCircle, ImagePlus, MoreVertical, Loader2, CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';

const userId = 1; // À remplacer par l'ID réel du client connecté

const initialForm: Partial<Vehicle & { image?: string }> = { brand: '', model: '', year: undefined, registration: '', image: '' };

function Drawer({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      {/* Drawer */}
      <div className="ml-auto h-full w-full max-w-md bg-white shadow-lg p-6 animate-slide-in-right relative z-50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Fermer"
        >
          &times;
        </button>
        {children}
      </div>
      <style jsx>{`
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function VehicleCard({ vehicle, onEdit, onDelete, isEditing, onChange, onSave, onCancel, editForm }: any) {
  const [showMenu, setShowMenu] = useState(false);
  let menuTimeout: NodeJS.Timeout;

  // Ouvre le menu au clic ou au survol
  const openMenu = () => {
    clearTimeout(menuTimeout);
    setShowMenu(true);
  };

  // Ferme le menu dès que le curseur quitte la carte ou le menu
  const closeMenu = () => {
    menuTimeout = setTimeout(() => setShowMenu(false), 150);
  };

  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition group border-2 border-dashed border-gray-200"
      style={{
        minHeight: 280,
        background: 'repeating-linear-gradient(90deg, #f3f4f6, #f3f4f6 40px, #e5e7eb 40px, #e5e7eb 44px)',
      }}
      onMouseLeave={closeMenu}
    >
      {/* Badge place */}
      <span className="absolute left-2 top-2 bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-500 shadow">
        Place #{vehicle.id}
      </span>
      {/* Menu contextuel */}
      <div className="absolute top-2 right-2" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
        <button
          onClick={openMenu}
          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          aria-label="Options"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-36 bg-white rounded shadow z-10 animate-fade-in border"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 w-full text-indigo-700 font-medium transition"
            >
              <Edit className="w-4 h-4" /> Modifier
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-red-600 font-medium transition"
            >
              <Trash2 className="w-4 h-4" /> Supprimer
            </button>
          </div>
        )}
      </div>
      {/* Avatar/photo */}
      <div className="w-24 h-24 mb-3 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-blue-200 shadow group-hover:scale-105 transition">
        {vehicle.image ? (
          <img src={vehicle.image} alt="Véhicule" className="object-cover w-full h-full" />
        ) : (
          <Car className="w-16 h-16 text-blue-400" />
        )}
      </div>
      {isEditing ? (
        <>
          <input name="brand" value={editForm.brand || ''} onChange={onChange} className="border p-1 rounded mb-1 text-center" />
          <input name="model" value={editForm.model || ''} onChange={onChange} className="border p-1 rounded mb-1 text-center" />
          <input name="year" value={editForm.year || ''} onChange={onChange} className="border p-1 rounded mb-1 text-center" />
          <input name="registration" value={editForm.registration || ''} onChange={onChange} className="border p-1 rounded mb-2 text-center" />
          <div className="flex gap-2">
            <button onClick={onSave} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Valider</button>
            <button onClick={onCancel} className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400">Annuler</button>
          </div>
        </>
      ) : (
        <>
          <div className="font-semibold text-lg text-center">{vehicle.brand} {vehicle.model}</div>
          <div className="text-sm text-gray-500">Année : <span className="font-medium">{vehicle.year}</span></div>
          <div className="text-xs text-gray-400 mb-2">Immatriculation : <span className="font-semibold">{vehicle.registration}</span></div>
        </>
      )}
    </div>
  );
}

interface BannerProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

function Banner({ message, type, onClose }: BannerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };

  const icons = {
    success: <CheckCircle2 className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 animate-slide-down`}>
      <div className={`${bgColors[type]} text-white px-6 py-4 shadow-lg`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icons[type]}
            <p className="text-lg font-medium">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
      <style jsx>{`
        .animate-slide-down {
          animation: slide-down 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default function GarageVehicleManager() {
  const { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle } = useVehicles(userId);
  const [form, setForm] = useState<Partial<Vehicle & { image?: string }>>(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [banner, setBanner] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  // Pour l'upload d'image (base64 temporaire)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, image: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setForm(initialForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEditDrawer = (v: Vehicle) => {
    setForm(v);
    setEditId(v.id);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setEditId(null);
    setForm(initialForm);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand || !form.model || !form.year || !form.registration) return;
    setShowValidation(true);
  };

  const handleConfirmSubmit = async () => {
    const vehicleToSend = {
      ...form,
      year: Number(form.year),
      userId
    } as Vehicle;
    try {
      if (editId) {
        await updateVehicle(editId, vehicleToSend);
        setBanner({ 
          message: `Le véhicule ${form.brand} ${form.model} a été modifié avec succès !`,
          type: 'success'
        });
      } else {
        await addVehicle(vehicleToSend);
        setBanner({ 
          message: `Le véhicule ${form.brand} ${form.model} a été ajouté avec succès !`,
          type: 'success'
        });
      }
      setShowModal(false);
      setShowDrawer(false);
      setShowValidation(false);
      setForm(initialForm);
      setEditId(null);
    } catch (err) {
      setBanner({ 
        message: `Une erreur est survenue lors de ${editId ? 'la modification' : "l'ajout"} du véhicule.`,
        type: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const vehicleToDelete = vehicles.find(v => v.id === deleteId);
        await deleteVehicle(deleteId);
        setBanner({ 
          message: `Le véhicule ${vehicleToDelete?.brand || ''} ${vehicleToDelete?.model || ''} a été supprimé avec succès !`,
          type: 'success'
        });
        setDeleteId(null);
      } catch (err) {
        setBanner({ 
          message: "Une erreur est survenue lors de la suppression du véhicule.",
          type: 'error'
        });
      }
    }
  };

  const handleDrawerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand || !form.model || !form.year || !form.registration) return;
    
    try {
      const vehicleToSend = {
        ...form,
        year: Number(form.year),
        userId
      } as Vehicle;

      if (editId !== null) {
        await updateVehicle(editId, vehicleToSend);
        setBanner({ 
          message: `Le véhicule ${form.brand} ${form.model} a été modifié avec succès !`,
          type: 'success'
        });
        setShowDrawer(false);
        setForm(initialForm);
        setEditId(null);
      }
    } catch (err) {
      setBanner({ 
        message: "Une erreur est survenue lors de la modification du véhicule.",
        type: 'error'
      });
    }
  };

  return (
    <>
      {banner && (
        <Banner
          message={banner.message}
          type={banner.type}
          onClose={() => setBanner(null)}
        />
      )}
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Gérer mes véhicules</h2>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition animate-bounce"
          >
            <PlusCircle className="w-5 h-5" /> Ajouter un véhicule
          </button>
        </div>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin w-10 h-10 text-blue-400" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <Car className="mx-auto w-12 h-12 mb-2 text-gray-300" />
            Aucun véhicule enregistré.<br />
            Cliquez sur <span className="font-semibold">Ajouter un véhicule</span> pour commencer.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {vehicles.map(v => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onEdit={() => openEditDrawer(v)}
                onDelete={() => setDeleteId(v.id)}
                isEditing={editId === v.id}
                onChange={handleChange}
                onSave={handleSubmitForm}
                onCancel={() => { setShowModal(false); setEditId(null); setForm(initialForm); }}
                editForm={form}
              />
            ))}
          </div>
        )}

        {/* Modal d'ajout/modification */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">{editId ? 'Modifier le véhicule' : 'Ajouter un véhicule'}</h3>
              <form onSubmit={handleSubmitForm} className="flex flex-col gap-3">
                <input 
                  name="brand" 
                  value={form.brand || ''} 
                  onChange={handleChange} 
                  placeholder="Marque" 
                  className="border p-2 rounded" 
                  required 
                />
                <input 
                  name="model" 
                  value={form.model || ''} 
                  onChange={handleChange} 
                  placeholder="Modèle" 
                  className="border p-2 rounded" 
                  required 
                />
                <input 
                  name="year" 
                  value={form.year || ''} 
                  onChange={handleChange} 
                  placeholder="Année" 
                  type="number" 
                  className="border p-2 rounded" 
                  required 
                />
                <input 
                  name="registration" 
                  value={form.registration || ''} 
                  onChange={handleChange} 
                  placeholder="Immatriculation" 
                  className="border p-2 rounded" 
                  required 
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button 
                    type="button" 
                    onClick={() => { 
                      setShowModal(false); 
                      setEditId(null); 
                      setForm(initialForm); 
                    }} 
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" /> 
                    {editId ? 'Modifier' : 'Valider'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de validation avant ajout/modification */}
        {showValidation && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
              <div className="flex items-center gap-3 text-blue-600 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Vérification des informations</h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-600 mb-2">Veuillez vérifier les informations suivantes :</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Marque :</span>
                    <span className="font-medium text-gray-800">{form.brand}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Modèle :</span>
                    <span className="font-medium text-gray-800">{form.model}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Année :</span>
                    <span className="font-medium text-gray-800">{form.year}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Immatriculation :</span>
                    <span className="font-medium text-gray-800">{form.registration}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                {editId ? 
                  "Confirmez-vous la modification de ce véhicule avec ces informations ?" :
                  "Confirmez-vous l'ajout de ce véhicule avec ces informations ?"}
              </p>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowValidation(false)} 
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  Modifier
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-colors flex items-center gap-2 group"
                >
                  <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation de suppression */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Confirmation de suppression</h3>
              </div>
              
              {/* Détails du véhicule à supprimer */}
              {vehicles.find(v => v.id === deleteId) && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-600 mb-2">Vous êtes sur le point de supprimer :</p>
                  <div className="font-medium text-gray-800">
                    <p className="text-lg">{vehicles.find(v => v.id === deleteId)?.brand} {vehicles.find(v => v.id === deleteId)?.model}</p>
                    <p className="text-sm text-gray-500">
                      Année : {vehicles.find(v => v.id === deleteId)?.year}<br />
                      Immatriculation : {vehicles.find(v => v.id === deleteId)?.registration}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-gray-600 mb-6">Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce véhicule ?</p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteId(null)} 
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-colors flex items-center gap-2 group"
                >
                  <Trash2 className="w-5 h-5 group-hover:animate-bounce" />
                  Confirmer la suppression
                </button>
              </div>
            </div>
          </div>
        )}

        <Drawer open={showDrawer} onClose={closeDrawer}>
          <div className="flex flex-col h-full relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Modifier le véhicule</h3>
                  <p className="text-sm text-gray-500">Mettez à jour les informations de votre véhicule</p>
                </div>
              </div>
              
              <form onSubmit={handleDrawerSubmit} className="flex flex-col gap-4">
                <div className="space-y-1 group">
                  <label className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Marque</label>
                  <div className="relative">
                    <input 
                      name="brand" 
                      value={form.brand || ''} 
                      onChange={handleChange} 
                      placeholder="Ex: Renault" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 group-hover:shadow-sm" 
                      required 
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 group">
                  <label className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Modèle</label>
                  <div className="relative">
                    <input 
                      name="model" 
                      value={form.model || ''} 
                      onChange={handleChange} 
                      placeholder="Ex: Clio" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 group-hover:shadow-sm" 
                      required 
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 group">
                  <label className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Année</label>
                  <div className="relative">
                    <input 
                      name="year" 
                      value={form.year || ''} 
                      onChange={handleChange} 
                      placeholder="Ex: 2020" 
                      type="number" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 group-hover:shadow-sm" 
                      required 
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 group">
                  <label className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Immatriculation</label>
                  <div className="relative">
                    <input 
                      name="registration" 
                      value={form.registration || ''} 
                      onChange={handleChange} 
                      placeholder="Ex: AB-123-CD" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 group-hover:shadow-sm" 
                      required 
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={closeDrawer} 
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all hover:shadow-sm flex items-center gap-2 group"
                  >
                    <span>Annuler</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-lg flex items-center gap-2 group"
                  >
                    <span>Enregistrer</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Drawer>
      </div>
    </>
  );
} 