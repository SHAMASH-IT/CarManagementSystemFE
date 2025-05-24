'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Box, Container, Drawer, IconButton, Typography, Divider } from '@mui/material';
import Sidebar from '../../common/Sidebar';
import Navbar from '../../common/Navbar';
import UserManagement from '../components/UserManagement';
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

export default function AdminPage() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box component="main" sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
      {/* Sidebar desktop uniquement */}
      <Box className="hidden md:flex">
        <Sidebar />
      </Box>
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
      <Box
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Navbar sticky + hamburger mobile */}
        <Box className="sticky top-0 z-20">
          <Box className="flex items-center px-2 py-2 bg-white border-b border-gray-200 md:hidden">
            <IconButton onClick={() => setDrawerOpen(true)} size="large" edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <span className="ml-2 font-bold text-lg">Gestion Utilisateurs</span>
          </Box>
          <Navbar />
        </Box>
        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: { xs: 1, md: 2 },
            px: { xs: 1, md: 2 },
            bgcolor: '#F4F6F8',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              backgroundColor: '#F4F6F8',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#CBD5E0',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#A0AEC0',
              },
            },
          }}
        >
          <Container 
            maxWidth={false}
            disableGutters
            sx={{
              height: '100%',
              maxWidth: '100%',
              px: { xs: 1, md: 2 },
            }}
          >
            <UserManagement />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
