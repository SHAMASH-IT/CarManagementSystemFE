'use client';

import React, { useState, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { User, CreateUserDto, UpdateUserDto } from '../services/userService';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  InputAdornment,
  TablePagination,
  CircularProgress,
  SelectChangeEvent,
  Grid,
  Tooltip,
  Divider,
  Stack,
  Switch,
  FormControlLabel,
  Menu,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Popover,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FilterList as FilterListIcon,
  GetApp as ExportIcon,
  Print as PrintIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(5px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const UserManagement = () => {
  const { users, loading, error, createUser, updateUser, deleteUser, loadUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    sortBy: 'name'
  });
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [formData, setFormData] = useState<CreateUserDto>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CLIENT'
  });
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Statistiques des utilisateurs
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    providers: users.filter(u => u.role === 'PROVIDER').length,
    suppliers: users.filter(u => u.role === 'SUPPLIER').length,
    clients: users.filter(u => u.role === 'CLIENT').length
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = Object.values(user).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    return matchesSearch && matchesRole;
  });

  // Trier les utilisateurs
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'role':
        return a.role.localeCompare(b.role);
      default:
        return 0;
    }
  });

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          newPassword: formData.password || undefined
        });
        setSnackbar({ open: true, message: 'Utilisateur mis à jour avec succès', severity: 'success' });
      } else {
        await createUser(formData);
        setSnackbar({ open: true, message: 'Utilisateur créé avec succès', severity: 'success' });
      }
      handleCloseDialog();
      loadUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erreur: ' + (err instanceof Error ? err.message : 'Une erreur est survenue'),
        severity: 'error'
      });
    }
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['Nom', 'Email', 'Téléphone', 'Rôle'],
      ...filteredUsers.map(user => [user.name, user.email, user.phone, user.role])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    event.stopPropagation();
    setDeleteAnchorEl(event.currentTarget);
    setUserToDelete(userId);
  };

  const handleDeleteCancel = () => {
    setDeleteAnchorEl(null);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete);
      setSnackbar({ open: true, message: 'Utilisateur supprimé avec succès', severity: 'success' });
      loadUsers();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: 'Erreur lors de la suppression: ' + (err instanceof Error ? err.message : 'Une erreur est survenue'), 
        severity: 'error' 
      });
    } finally {
      setDeleteAnchorEl(null);
      setUserToDelete(null);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone,
        role: user.role
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'CLIENT'
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'CLIENT'
    });
    setShowPassword(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'PROVIDER':
        return 'warning';
      case 'SUPPLIER':
        return 'info';
      default:
        return 'success';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <SecurityIcon />;
      case 'PROVIDER':
        return <GroupIcon />;
      case 'SUPPLIER':
        return <GroupIcon />;
      default:
        return <AccountCircleIcon />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'PROVIDER':
        return 'Prestataire';
      case 'SUPPLIER':
        return 'Fournisseur';
      case 'CLIENT':
        return 'Client';
      default:
        return role;
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: '#F4F6F8',
      minHeight: '100vh',
    }}>
      {/* En-tête avec statistiques et résumé */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ 
          mb: 1, 
          color: '#2D3748',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <GroupIcon sx={{ fontSize: 28 }} />
          Gestion des Utilisateurs
        </Typography>
        <Typography variant="body2" sx={{ color: '#718096', mb: 2, fontSize: '0.98rem' }}>
          Gérez les comptes utilisateurs, les rôles et les permissions
        </Typography>

        <Grid container spacing={3}>
          {/* Administrateurs */}
          <Grid item xs={12} sm={6} md={3} lg={3} sx={{ display: 'flex' }}>
            <Card 
              sx={{ 
                p: 2,
                background: '#FFFFFF',
                color: '#c62828',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                minHeight: 140,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon sx={{ fontSize: 24, color: '#ef5350' }} />
                <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600, color: '#c62828' }}>
                  Administrateurs
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700, color: '#d32f2f' }}>
                {userStats.admins}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ef5350' }}>
                {userStats.total > 0 ? ((userStats.admins / userStats.total) * 100).toFixed(1) : 0}% des utilisateurs
              </Typography>
            </Card>
          </Grid>

          {/* Prestataires */}
          <Grid item xs={12} sm={6} md={3} lg={3} sx={{ display: 'flex' }}>
            <Card 
              sx={{ 
                p: 2,
                background: '#FFFFFF',
                color: '#f57f17',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                minHeight: 140,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountCircleIcon sx={{ fontSize: 24, color: '#ffd54f' }} />
                <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600, color: '#f57f17' }}>
                  Prestataires
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700, color: '#ffa000' }}>
                {userStats.providers}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ffd54f' }}>
                {userStats.total > 0 ? ((userStats.providers / userStats.total) * 100).toFixed(1) : 0}% des utilisateurs
              </Typography>
            </Card>
          </Grid>

          {/* Clients */}
          <Grid item xs={12} sm={6} md={3} lg={3} sx={{ display: 'flex' }}>
            <Card 
              sx={{ 
                p: 2,
                background: '#FFFFFF',
                color: '#2e7d32',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                minHeight: 140,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GroupIcon sx={{ fontSize: 24, color: '#66bb6a' }} />
                <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600, color: '#2e7d32' }}>
                  Clients
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700, color: '#388e3c' }}>
                {userStats.clients}
              </Typography>
              <Typography variant="caption" sx={{ color: '#66bb6a' }}>
                {userStats.total > 0 ? ((userStats.clients / userStats.total) * 100).toFixed(1) : 0}% des utilisateurs
              </Typography>
            </Card>
          </Grid>

          {/* Fournisseurs */}
          <Grid item xs={12} sm={6} md={3} lg={3} sx={{ display: 'flex' }}>
            <Card 
              sx={{ 
                p: 2,
                background: '#FFFFFF',
                color: '#1976d2',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                minHeight: 140,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GroupIcon sx={{ fontSize: 24, color: '#2196f3' }} />
                <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600, color: '#1976d2' }}>
                  Fournisseurs
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700, color: '#1565c0' }}>
                {userStats.suppliers}
              </Typography>
              <Typography variant="caption" sx={{ color: '#2196f3' }}>
                {userStats.total > 0 ? ((userStats.suppliers / userStats.total) * 100).toFixed(1) : 0}% des utilisateurs
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Barre d'outils améliorée */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2.5, 
          mb: 3, 
          borderRadius: '12px',
          background: '#FFFFFF',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        }}
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2.5} 
          alignItems="center" 
          justifyContent="space-between"
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flex={1}>
            <TextField
              size="medium"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#5c6bc0' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  bgcolor: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(92, 107, 192, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(92, 107, 192, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#5c6bc0',
                  }
                }
              }}
              sx={{ 
                minWidth: 300,
                flex: 1,
                maxWidth: 500
              }}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                sx={{
                  borderRadius: '12px',
                  borderColor: 'rgba(92, 107, 192, 0.5)',
                  color: '#5c6bc0',
                  px: 3,
                  '&:hover': {
                    borderColor: '#5c6bc0',
                    bgcolor: 'rgba(92, 107, 192, 0.08)',
                  }
                }}
              >
                Filtres
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => loadUsers()}
                sx={{
                  borderRadius: '12px',
                  borderColor: 'rgba(92, 107, 192, 0.5)',
                  color: '#5c6bc0',
                  px: 3,
                  '&:hover': {
                    borderColor: '#5c6bc0',
                    bgcolor: 'rgba(92, 107, 192, 0.08)',
                  }
                }}
              >
                Actualiser
              </Button>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: '12px',
              bgcolor: '#5c6bc0',
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(92, 107, 192, 0.2)',
              '&:hover': {
                bgcolor: '#3f51b5',
                boxShadow: '0 6px 16px rgba(92, 107, 192, 0.3)',
              }
            }}
          >
            Nouvel Utilisateur
          </Button>
        </Stack>
      </Paper>

      {/* Menu des filtres */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            borderRadius: '12px',
            minWidth: 280,
            overflow: 'visible',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: '#FFFFFF',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          }
        }}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
            Filtres de recherche
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Rôle</InputLabel>
            <Select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              label="Rôle"
              size="small"
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="ADMIN">Administrateurs</MenuItem>
              <MenuItem value="PROVIDER">Prestataires</MenuItem>
              <MenuItem value="SUPPLIER">Fournisseurs</MenuItem>
              <MenuItem value="CLIENT">Clients</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Trier par</InputLabel>
            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              label="Trier par"
              size="small"
            >
              <MenuItem value="name">Nom</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="role">Rôle</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Menu>

      {/* Liste des utilisateurs */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : viewMode === 'table' ? (
        <TableContainer 
          component={Paper} 
          elevation={0} 
          sx={{ 
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#FFFFFF',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            '& .MuiTableCell-root': {
              borderColor: '#E2E8F0',
            },
            '& .MuiTableHead-root': {
              bgcolor: '#F8FAFC',
              '& .MuiTableCell-root': {
                color: '#2D3748',
                fontWeight: 600,
                borderBottom: '2px solid #E2E8F0',
              }
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7ff' }}>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Téléphone</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }}>Rôle</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1a237e' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(92, 107, 192, 0.04)',
                      }
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar 
                          sx={{ 
                            bgcolor: 'rgba(92, 107, 192, 0.1)',
                            color: '#5c6bc0',
                            fontWeight: 600
                          }}
                        >
                          {user.name[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MailIcon sx={{ fontSize: 18, color: '#5c6bc0' }} />
                        <Typography>{user.email}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon sx={{ fontSize: 18, color: '#5c6bc0' }} />
                        <Typography>{user.phone}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={getRoleLabel(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{ 
                          borderRadius: '8px',
                          '& .MuiChip-icon': {
                            fontSize: 16
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Modifier l'utilisateur" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(user)}
                            sx={{
                              color: '#5c6bc0',
                              bgcolor: 'rgba(92, 107, 192, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(92, 107, 192, 0.2)',
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer l'utilisateur" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => handleDeleteClick(e, user.id)}
                            sx={{
                              color: '#ef5350',
                              bgcolor: 'rgba(239, 83, 80, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(239, 83, 80, 0.2)',
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(92, 107, 192, 0.1)',
            bgcolor: '#f5f7ff'
          }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems="center" 
              justifyContent="space-between"
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total: {sortedUsers.length} utilisateurs
              </Typography>
              <TablePagination
                component="div"
                count={sortedUsers.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                labelRowsPerPage="Lignes par page"
                rowsPerPageOptions={[5]}
                sx={{
                  '.MuiTablePagination-select': {
                    borderRadius: '8px',
                    bgcolor: 'white',
                  },
                  '.MuiTablePagination-selectIcon': {
                    color: '#5c6bc0',
                  }
                }}
              />
            </Stack>
          </Box>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {sortedUsers
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Avatar
                        sx={{ width: 80, height: 80, fontSize: '2rem' }}
                      >
                        {user.name[0]}
                      </Avatar>
                    </Box>
                    <Typography variant="h6" align="center" gutterBottom>
                      {user.name}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MailIcon fontSize="small" />
                        <Typography variant="body2">{user.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2">{user.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Chip
                          icon={getRoleIcon(user.role)}
                          label={getRoleLabel(user.role)}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                  <Divider />
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => handleDeleteClick(e, user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            ))}
          <Grid item xs={12}>
            <TablePagination
              component="div"
              count={sortedUsers.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Lignes par page"
              rowsPerPageOptions={[5]}
            />
          </Grid>
        </Grid>
      )}

      {/* Remplacer le Dialog par ce Popover */}
      <Popover
        open={Boolean(deleteAnchorEl)}
        anchorEl={deleteAnchorEl}
        onClose={handleDeleteCancel}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            p: 0,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1,
            bgcolor: 'transparent',
            '& .MuiAvatar-root': {
              width: 24,
              height: 24,
              bgcolor: 'transparent',
            },
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderTop: '1px solid',
              borderLeft: '1px solid',
              borderColor: 'rgba(0,0,0,0.08)',
            }
          }}
        >
          <Box
            sx={{
              animation: `${slideIn} 0.2s ease-out`,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1.5,
                pr: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: 'error.lighter',
                  color: 'error.main',
                }}
              >
                <WarningIcon fontSize="small" />
              </Avatar>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                }}
              >
                Supprimer l'utilisateur
              </Typography>
            </Box>
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                p: 1,
                bgcolor: 'grey.50',
              }}
            >
              <Button
                size="small"
                onClick={handleDeleteCancel}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'background.paper',
                  }
                }}
              >
                Annuler
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={handleDeleteConfirm}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    bgcolor: 'error.dark',
                  }
                }}
              >
                Supprimer
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>

      {/* Dialog pour création/modification */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ 
            borderBottom: '1px solid #E2E8F0',
            px: 3,
            py: 2,
            bgcolor: '#F8FAFC'
          }}>
            <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
              {selectedUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Nom"
                name="name"
                value={formData.name}
                onChange={handleTextFieldChange}
                required
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#5c6bc0',
                    },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleTextFieldChange}
                required
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#5c6bc0',
                    },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleTextFieldChange}
                required
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#5c6bc0',
                    },
                  }
                }}
              />
              <TextField
                fullWidth
                label={selectedUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleTextFieldChange}
                required={!selectedUser}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#718096' }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '8px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#5c6bc0',
                    },
                  }
                }}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel>Rôle</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  label="Rôle"
                  required
                  sx={{
                    borderRadius: '8px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#5c6bc0',
                    },
                  }}
                >
                  <MenuItem value="CLIENT">Client</MenuItem>
                  <MenuItem value="PROVIDER">Prestataire</MenuItem>
                  <MenuItem value="SUPPLIER">Fournisseur</MenuItem>
                  <MenuItem value="ADMIN">Administrateur</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ 
            p: 3, 
            borderTop: '1px solid #E2E8F0',
            bgcolor: '#F8FAFC'
          }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{ 
                color: '#718096',
                '&:hover': {
                  bgcolor: 'rgba(113, 128, 150, 0.08)',
                }
              }}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                bgcolor: '#5c6bc0',
                color: 'white',
                borderRadius: '8px',
                px: 4,
                '&:hover': {
                  bgcolor: '#3f51b5',
                }
              }}
            >
              {selectedUser ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar amélioré */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as 'success' | 'error'}
          variant="filled"
          sx={{
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '300px',
            '& .MuiAlert-icon': {
              fontSize: '24px'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;