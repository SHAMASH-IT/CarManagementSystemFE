"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import HistoryView from "./historyView"
import Sidebar from "../../common/Sidebar"
import Navbar from "../../common/Navbar"
import { Drawer, IconButton, Box, Typography, Divider } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { LayoutDashboard, ClipboardCheck, UserCog, Wrench, ParkingCircle, Warehouse, PackageCheck, History } from 'lucide-react';

const menuItems = [
  { icon: <LayoutDashboard size={22} className="text-pink-500" />, title: 'Dashboard', url: '/appointments/dashboard' },
  { icon: <ClipboardCheck size={22} className="text-green-500" />, title: 'Liste des Rendez-vous', url: '/appointments' },
  { icon: <UserCog size={22} className="text-indigo-500" />, title: 'Gestion Utilisateurs', url: '/admin/users' },
  { icon: <Wrench size={22} className="text-blue-500" />, title: 'Services', url: '/services' },
  { icon: <ParkingCircle size={22} className="text-orange-500" />, title: 'Stationnement', url: '/parking' },
  { icon: <Warehouse size={22} className="text-purple-500" />, title: 'Stock', url: '/stock' },
  { icon: <PackageCheck size={22} className="text-indigo-500" />, title: 'Commande', url: '/stock/order' },
  { icon: <Wrench size={22} className="text-red-500" />, title: 'Intervention', url: '/progress' },
  { icon: <History size={22} className="text-blue-500" />, title: 'Historique des interventions', url: '/history/historyProviderAdmin' }
];

export default function HistoryPage() {
  const router = useRouter()
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          // Si aucun token, rediriger vers la page de login
          router.push("/login")
          return
        }

        // Décodage du token JWT pour obtenir les informations de l'utilisateur
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        
        // Extraction des données utilisateur depuis le payload décodé
        const decodedUser = JSON.parse(jsonPayload)

        if (!decodedUser.sub) {
          // Si pas d'ID utilisateur, rediriger vers login
          router.push("/login")
          return
        }

        // Vérification du rôle utilisateur
        if (decodedUser.role === "ADMIN" || decodedUser.role === "PROVIDER") {
          const userData = {
            id: decodedUser.sub,
            email: decodedUser.email,
            role: decodedUser.role
          }
          setUserData(userData)
          setIsLoading(false)
        } else {
          // Si le rôle n'est pas autorisé, rediriger vers l'accueil
          router.push("/")
        }
      } catch (error) {
        // En cas d'erreur, rediriger vers login
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    // Affichage d'un loader pendant le chargement
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userData) {
    // Si pas de données utilisateur, ne rien afficher
    return null
  }

  // Layout principal : sidebar à gauche, contenu à droite
  // min-h-screen et h-screen pour occuper toute la hauteur de l'écran
  // Le scroll vertical ne concerne que le contenu principal (main)
  return (
    <div className="flex min-h-screen h-screen bg-gray-50">
      {/* Sidebar desktop uniquement */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      {/* Drawer mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '80vw', maxWidth: 320, p: 0 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
          <Typography fontWeight={700} fontSize={16}>Menu</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {menuItems.map((item) => (
            <a
              key={item.title}
              href={item.url}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium mb-1 transition-all ${
                pathname === item.url
                  ? 'bg-indigo-50 text-indigo-700 shadow'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              {item.icon}
              <span>{item.title}</span>
            </a>
          ))}
        </Box>
      </Drawer>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar avec bouton hamburger mobile */}
        <div className="sticky top-0 z-20">
          <div className="flex items-center px-2 py-2 bg-white border-b border-gray-200 md:hidden">
            <IconButton onClick={() => setDrawerOpen(true)} size="large" edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <span className="ml-2 font-bold text-lg">Historique des interventions</span>
          </div>
          <Navbar />
        </div>
        {/* Le contenu principal prend tout l'espace restant et est scrollable */}
        <main className="flex-1 flex flex-col overflow-y-auto p-2 sm:p-4">
          <HistoryView 
            userRole={userData.role} 
            userId={userData.id} 
          />
        </main>
      </div>
    </div>
  )
} 