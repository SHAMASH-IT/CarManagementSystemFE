"use client"

import { VehicleProgressTracker } from "./vehicle-progress-tracker"
import Sidebar from "../../common/Sidebar"
import Navbar from "../../common/Navbar"
import { usePathname } from 'next/navigation'
import { Drawer, IconButton, Typography, Divider, Box } from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'
import { LayoutDashboard, ClipboardCheck, UserCog, Wrench, ParkingCircle, Warehouse, PackageCheck, History,CalendarPlus, Car , Search } from 'lucide-react'
import React from 'react'

const menuItems = [
  { icon: <CalendarPlus size={22} className="text-yellow-500" />, title: 'Prendre un rendez-vous', url: '/users' },
  { icon: <Car size={22} className="text-blue-700" />, title: 'Ajouter un véhicule', url: '/users/vehicle' },
  { icon: <Search size={22} className="text-teal-500" />, title: 'Rechercher un rendez-vous', url: '/progress/vehicle-progress-client' },
  { icon: <History size={22} className="text-cyan-500" />, title: 'Historique des rendez-vous', url: '/history' }
];

export default function VehicleProgressClientPage() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar desktop uniquement (caché sur mobile) */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      {/* Drawer mobile (menu latéral avec hamburger) */}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar sticky + bouton hamburger mobile */}
        <div className="sticky top-0 z-20">
          {/* Barre supérieure mobile (hamburger + titre) */}
          <div className="flex items-center px-2 py-2 bg-white border-b border-gray-200 md:hidden">
            <IconButton onClick={() => setDrawerOpen(true)} size="large" edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <span className="ml-2 font-bold text-lg">Suivi véhicule</span>
          </div>
          <Navbar />
        </div>
        {/* Page Content : même structure qu'avant, max-w-7xl mx-auto p-4 */}
        <main className="flex-1 overflow-y-auto px-2 sm:px-6 py-4">
          <div className="w-full">
            <VehicleProgressTracker />
          </div>
        </main>
      </div>
    </div>
  )
}
