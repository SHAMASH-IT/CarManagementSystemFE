'use client';

import { useState } from 'react';
import { Box, Tab, Tabs, Container, CircularProgress } from '@mui/material';
import { CreateOrderSellForm } from './components/CreateOrderSellForm';
import { OrderSellList } from './components/OrderSellList';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import stockService from '../services/stockService';
import { Stock } from '../../types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Piece {
  id: number;
  name: string;
  price: number;
  stock: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function OrderSellContent() {
  const [tabValue, setTabValue] = useState(0);

  const { data: stockPieces, isLoading: isPiecesLoading, error: piecesError } = useQuery<Stock[]>({
    queryKey: ['pieces'],
    queryFn: () => stockService.getAllStocks(),
  });

  // Convertir les Stock en Piece
  const pieces: Piece[] = stockPieces?.map(stock => ({
    id: Number(stock.id), // Conversion de string en number
    name: stock.name,
    price: stock.price,
    stock: stock.stock
  })) || [];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (piecesError) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        Erreur lors du chargement des pièces
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Liste des Ventes" />
            <Tab label="Nouvelle Vente" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <OrderSellList />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {isPiecesLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <CreateOrderSellForm
              pieces={pieces}
              onSuccess={() => setTabValue(0)}
            />
          )}
        </TabPanel>
      </Box>
    </Container>
  );
}

export default function OrderSellPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrderSellContent />
    </QueryClientProvider>
  );
}
