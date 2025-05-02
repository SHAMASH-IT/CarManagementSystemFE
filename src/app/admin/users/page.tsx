'use client';

import { Box, Container } from '@mui/material';
import UserManagement from '../components/UserManagement';
import Sidebar from "../../common/Sidebar";
import Navbar from "../../common/Navbar";

export default function AdminPage() {
  return (
    <Box 
      component="main" 
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#F4F6F8',
      }}
    >
      <Sidebar />
      
      <Box 
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Navbar />
        
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
