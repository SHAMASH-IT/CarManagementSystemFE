"use client"

import { useState } from "react"
import Sidebar from "../common/Sidebar"
import Navbar from "../common/Navbar"
import StockList from "./components/StockList"
import CategoryTable from "./category/components/CategoryTable"
import AddCategoryModal from "./category/components/AddCategory"
import { useCategory } from "./category/hooks/useCategory"
import { 
  Tabs, 
  Tab, 
  Box, 
  Typography, 
  Button, 
  Snackbar, 
  Alert 
} from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"

// Interface pour les propriétés du TabPanel
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

// Composant TabPanel pour afficher le contenu des onglets
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      className="py-4"
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  )
}

export default function UnifiedPage() {
  const [tabValue, setTabValue] = useState(0)
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const { toastMessage } = useCategory()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Système d'onglets Material UI */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="gestion tabs"
                sx={{ mb: 2 }}
              >
                <Tab label="Gestion des Stocks" />
                <Tab label="Gestion des Catégories" />
              </Tabs>
            </Box>

            {/* Contenu de l'onglet Stocks */}
            <TabPanel value={tabValue} index={0}>
              <StockList />
            </TabPanel>

            {/* Contenu de l'onglet Catégories */}
            <TabPanel value={tabValue} index={1}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <Typography variant="h4"></Typography>
                  <Typography variant="subtitle1"></Typography>
                </div>
                <Button
                  
                  
                  
                  onClick={() => setIsAddCategoryModalOpen(true)}
                >
                  
                </Button>
              </div>

              <CategoryTable />

              {/* Modal d'ajout de catégorie */}
              <AddCategoryModal isOpen={isAddCategoryModalOpen} onClose={() => setIsAddCategoryModalOpen(false)} />

              {/* Affichage des notifications avec Snackbar et Alert */}
              <Snackbar
                open={!!toastMessage}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert severity={toastMessage?.severity} sx={{ width: "100%" }}>
                  {toastMessage?.message}
                </Alert>
              </Snackbar>
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  )
}
