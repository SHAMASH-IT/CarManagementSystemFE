'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import { ServiceList } from './components/ServiceList';
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

export default function ServicesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const userData = JSON.parse(jsonPayload);
        if (userData.role !== 'ADMIN') {
          router.push('/appointments/dashboard');
          return;
        }
        setIsAuthorized(true);
      } catch (error) {
        console.error('Erreur lors de la vérification des autorisations:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar desktop */}
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
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
        {/* Navbar avec bouton hamburger mobile */}
        <div className="sticky top-0 z-20">
          <div className="flex items-center px-2 py-2 bg-white border-b border-gray-200 md:hidden">
            {/* Hamburger mobile uniquement */}
            <IconButton onClick={() => setDrawerOpen(true)} size="large" edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <span className="ml-2 font-bold text-lg">Gestion des Services</span>
          </div>
          <Navbar />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-2 md:p-6">
          <ServiceList />
        </main>
      </div>
    </div>
  );
} 