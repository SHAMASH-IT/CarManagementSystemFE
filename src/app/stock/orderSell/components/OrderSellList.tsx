"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { toast } from "react-hot-toast" // Correction de l'import toast
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Avatar,
  Collapse,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material"
import {
  Receipt as ReceiptIcon,
  CheckCircle,
  Cancel,
  ExpandMore,
  ExpandLess,
  Search,
  ShoppingBag,
  CalendarToday,
  AttachMoney,
  Info,
  Close,
  Tag,
  Discount,
  Store,
  Phone,
  Email,
  Print,
  Download,
  ContentCopy,
} from "@mui/icons-material"
import { useOrderSell } from "../hooks/useOrderSell"
import type { Order, Invoice, InvoiceItem } from "../service/OrderSellService"
import axios from "axios"
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

const getProviderIdFromToken = (): number | null => {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    const userData = JSON.parse(jsonPayload)
    return userData?.sub ? parseInt(userData.sub) : null
  } catch (error) {
    console.error("Erreur de décodage du token:", error)
    return null
  }
}
const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "success"
    case "CANCELLED":
      return "error"
    case "RESERVED":
      return "warning"
    default:
      return "default"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "Complétée"
    case "CANCELLED":
      return "Annulée"
    case "RESERVED":
      return "En attente"
    default:
      return status
  }
}

// Composant pour la signature et le cachet
const SignatureStamp = ({ onSign }: { onSign: (dataUrl: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    setLastX(clientX - rect.left)
    setLastY(clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.stroke()

    setLastX(x)
    setLastY(y)
  }

  const endDrawing = () => {
    setIsDrawing(false)
    if (canvasRef.current) {
      onSign(canvasRef.current.toDataURL())
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onSign("")
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Signature / Cachet
      </Typography>
      <Box
        sx={{
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 1,
          p: 1,
          bgcolor: "background.paper",
          touchAction: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          style={{ width: "100%", height: "150px", cursor: "crosshair" }}
        />
      </Box>
      <Button variant="outlined" size="small" onClick={clearCanvas} sx={{ mt: 1 }}>
        Effacer
      </Button>
    </Box>
  )
}

export const OrderSellList = () => {
 const { orders: allOrders, isLoading, cancelOrder, completeOrder, getInvoice, isCancelling, isCompleting, isGettingInvoice } =
    useOrderSell()

  const [orders, setOrders] = useState<Order[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [orderTotals, setOrderTotals] = useState<Record<number, number>>({})
  const [signature, setSignature] = useState<string>("")
  const [companyStamp, setCompanyStamp] = useState<string>("")
  const totalsRef = useRef<Record<number, number>>({})
  const invoiceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProviderOrders = async () => {
      const providerId = getProviderIdFromToken()
      if (!providerId) return

      try {
        const response = await axios.get(`${API_URL}/stock/orders/selling/provider/${providerId}`)
        setOrders(response.data)
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes du fournisseur:", error)
        toast.error("Erreur lors du chargement des commandes")
      }
    }

    if (allOrders) {
      fetchProviderOrders()
    }
  }, [allOrders])


  // Sauvegarde des totaux en localStorage
  useEffect(() => {
    // Charger les totaux depuis localStorage au démarrage
    const savedTotals = localStorage.getItem("orderTotals")
    if (savedTotals) {
      try {
        const parsedTotals = JSON.parse(savedTotals)
        setOrderTotals(parsedTotals)
        totalsRef.current = parsedTotals
      } catch (e) {
        console.error("Erreur lors du chargement des totaux:", e)
      }
    }
  }, [])

  // Sauvegarde des totaux lorsqu'ils changent
  useEffect(() => {
    if (Object.keys(orderTotals).length > 0) {
      localStorage.setItem("orderTotals", JSON.stringify(orderTotals))
      totalsRef.current = orderTotals
    }
  }, [orderTotals])

  // Récupérer les factures pour toutes les commandes complétées lors du chargement
  useEffect(() => {
    if (orders) {
      const completedOrders = orders.filter((order) => order.status === "COMPLETED")

      // Éviter de charger à nouveau les factures si nous avons déjà les totaux
      const ordersToLoad = completedOrders.filter((order) => !totalsRef.current[order.id])

      if (ordersToLoad.length > 0) {
        ordersToLoad.forEach((order) => {
          getInvoice(order.id, {
            onSuccess: (invoice) => {
              setOrderTotals((prev) => ({
                ...prev,
                [order.id]: invoice.total,
              }))
            },
          })
        })
      }
    }
  }, [orders, getInvoice])

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  // Fonction pour obtenir le prix unitaire d'une pièce
  const getPiecePrice = (pieceId: number, order: Order): number => {
    // Essayer de trouver la pièce dans l'ordre
    const orderPiece = order.orderPieces?.find((op) => op.pieceId === pieceId)

    // Si la pièce a un prix défini dans l'ordre, l'utiliser
    if (orderPiece?.piece?.price !== undefined) {
      return Number(orderPiece.piece.price)
    }

    // Si aucun prix n'est trouvé, retourner 0
    return 0
  }

  // Fonction pour calculer le sous-total d'une commande (avant remise)
  const calculateSubtotal = (order: Order): number => {
    if (!order.orderPieces || !Array.isArray(order.orderPieces)) return 0

    return order.orderPieces.reduce((total, op) => {
      const quantity = op.quantity || 0
      const price = getPiecePrice(op.pieceId, order)
      return total + quantity * price
    }, 0)
  }

  // Fonction pour calculer le montant de la remise
  const calculateDiscountAmount = (order: Order): number => {
    if (!order.discount || order.discount.value <= 0) return 0

    const subtotal = calculateSubtotal(order)

    if (order.discount.type === "percentage") {
      return subtotal * (order.discount.value / 100)
    } else {
      return Math.min(subtotal, order.discount.value)
    }
  }

  // Fonction pour calculer le total d'une commande (après remise)
  const calculateTotal = (order: Order): number => {
    // Si nous avons déjà récupéré le total depuis la facture, l'utiliser
    if (orderTotals[order.id] !== undefined) {
      return orderTotals[order.id]
    }

    // Si le total est déjà défini dans l'ordre, l'utiliser directement
    if (order.total !== undefined && typeof order.total === "number") {
      return order.total
    }

    // Calculer le sous-total
    const subtotal = calculateSubtotal(order)
    const discountAmount = calculateDiscountAmount(order)

    // Retourner le total après remise
    return subtotal - discountAmount
  }

  const handleComplete = (orderId: number) => {
    completeOrder(orderId, {
      onSuccess: () => {
        getInvoice(orderId, {
          onSuccess: (invoice) => {
            // Enrichir la facture avec les données de la commande
            const order = orders?.find((o) => o.id === orderId)
            if (order && order.orderPieces) {
              const enrichedInvoice = {
                ...invoice,
                items: order.orderPieces.map((orderPiece) => ({
                  id: orderPiece.id,
                  pieceId: orderPiece.pieceId,
                  description: orderPiece.piece?.name || `Pièce #${orderPiece.pieceId}`,
                  quantity: orderPiece.quantity || 0,
                  unitPrice: Number(orderPiece.piece?.price || 0),
                  total: (orderPiece.quantity || 0) * Number(orderPiece.piece?.price || 0)
                }))
              }
              setSelectedInvoice(enrichedInvoice)
            } else {
              setSelectedInvoice(invoice)
            }
            setIsInvoiceDialogOpen(true)

            // Mettre à jour le total de la commande avec celui de la facture
            setOrderTotals((prev) => ({
              ...prev,
              [orderId]: invoice.total,
            }))
          },
        })
      },
    })
  }

  const handleViewInvoice = (orderId: number) => {
    getInvoice(orderId, {
      onSuccess: (invoice) => {
        // Enrichir la facture avec les données de la commande
        const order = orders?.find((o) => o.id === orderId)
        if (order && order.orderPieces) {
          const enrichedInvoice = {
            ...invoice,
            items: order.orderPieces.map((orderPiece) => ({
              id: orderPiece.id,
              pieceId: orderPiece.pieceId,
              description: orderPiece.piece?.name || `Pièce #${orderPiece.pieceId}`,
              quantity: orderPiece.quantity || 0,
              unitPrice: Number(orderPiece.piece?.price || 0),
              total: (orderPiece.quantity || 0) * Number(orderPiece.piece?.price || 0)
            }))
          }
          setSelectedInvoice(enrichedInvoice)
        } else {
          setSelectedInvoice(invoice)
        }
        setIsInvoiceDialogOpen(true)

        // Mettre à jour le total de la commande avec celui de la facture
        setOrderTotals((prev) => ({
          ...prev,
          [orderId]: invoice.total,
        }))
      },
    })
  }

  const handlePrintInvoice = () => {
    if (invoiceRef.current) {
      const printContent = invoiceRef.current.innerHTML
      const originalContent = document.body.innerHTML

      document.body.innerHTML = `
        <html>
          <head>
            <title>Facture #${selectedInvoice?.id}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .invoice-container { padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              .total-row { font-weight: bold; }
              .signature-area { margin-top: 50px; }
              .signature-box { border: 1px dashed #ccc; height: 100px; margin-top: 10px; }
              @media print {
                button { display: none !important; }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              ${printContent}
            </div>
          </body>
        </html>
      `

      window.print()
      document.body.innerHTML = originalContent
      // Recharger la page pour restaurer les événements React
      window.location.reload()
    }
  }

  const filteredOrders = orders?.filter((order: Order) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()

    // Recherche par numéro de commande
    if (order.id?.toString().includes(searchLower)) return true

    // Recherche par téléphone
    if (order.clientInfo?.phone?.toLowerCase().includes(searchLower)) return true

    // Recherche par statut
    if (getStatusLabel(order.status).toLowerCase().includes(searchLower)) return true

    // Recherche par pièce
    if (order.orderPieces?.some((op) => op.piece?.name?.toLowerCase().includes(searchLower))) return true

    return false
  })

  // Trier les commandes par date décroissante (plus récentes en premier)
  const sortedOrders = [...(filteredOrders || [])].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={5} minHeight="300px">
        <CircularProgress size={60} thickness={4} />
      </Box>
    )
  }

  if (!orders?.length) {
    return (
      <Card elevation={3} sx={{ borderRadius: 2, p: 5, textAlign: "center" }}>
        <ShoppingBag sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Aucune vente trouvée
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Les ventes que vous créez apparaîtront ici.
        </Typography>
      </Card>
    )
  }

  return (
    <>
      <Card elevation={3} sx={{ borderRadius: 2, mb: 4, overflow: "visible" }}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            py: 2,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingBag />
            <Typography variant="h5" fontWeight="bold">
              Liste des Ventes
            </Typography>
          </Box>
          <Chip
            label={`${orders.length} vente${orders.length > 1 ? "s" : ""}`}
            color="default"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
          />
        </Box>

        <CardContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par numéro de commande..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {sortedOrders.map((order) => {
            // Calculer les valeurs pour chaque commande
            const subtotal = calculateSubtotal(order)
            const discountAmount = calculateDiscountAmount(order)
            const total = calculateTotal(order)

            return (
              <Paper
                key={order.id}
                elevation={1}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    bgcolor: expandedOrderId === order.id ? "action.hover" : "background.paper",
                    borderBottom: expandedOrderId === order.id ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                          <Tag />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Commande #{order.id}
                          </Typography>
                          {order.clientInfo?.phone && (
                            <Typography variant="caption" color="text.secondary">
                              {order.clientInfo.phone}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AttachMoney fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight="bold">
                          {total.toFixed(2)} DT
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">{new Date(order.date).toLocaleDateString()}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status) as any}
                        size="small"
                        sx={{ fontWeight: "medium" }}
                      />
                      {order.discount && order.discount.value > 0 && (
                        <Chip
                          icon={<Discount fontSize="small" />}
                          label={
                            order.discount.type === "percentage"
                              ? `${order.discount.value}%`
                              : `${order.discount.value} DT`
                          }
                          color="secondary"
                          size="small"
                          sx={{ ml: 1, fontWeight: "medium" }}
                        />
                      )}
                    </Grid>

                    <Grid item xs={6} sm={3} sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      {order.status === "RESERVED" && (
                        <>
                          <Tooltip title="Compléter la commande">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleComplete(order.id)}
                              disabled={isCompleting}
                              startIcon={<CheckCircle />}
                              sx={{ borderRadius: 2 }}
                            >
                              Compléter
                            </Button>
                          </Tooltip>
                          <Tooltip title="Annuler la commande">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => cancelOrder(order.id)}
                              disabled={isCancelling}
                              startIcon={<Cancel />}
                              sx={{ borderRadius: 2 }}
                            >
                              Annuler
                            </Button>
                          </Tooltip>
                        </>
                      )}
                      {order.status === "COMPLETED" && (
                        <Tooltip title="Voir la facture">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<ReceiptIcon />}
                            onClick={() => handleViewInvoice(order.id)}
                            disabled={isGettingInvoice}
                            sx={{ borderRadius: 2 }}
                          >
                            Facture
                          </Button>
                        </Tooltip>
                      )}
                    </Grid>
                  </Grid>

                  <IconButton onClick={() => toggleOrderExpand(order.id)} size="small" sx={{ ml: "auto" }}>
                    {expandedOrderId === order.id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>

                <Collapse in={expandedOrderId === order.id}>
                  <Box sx={{ p: 3, bgcolor: "background.default" }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Info fontSize="small" color="primary" /> Détails de la commande
                    </Typography>

                    <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Pièce</TableCell>
                            <TableCell align="center">Quantité</TableCell>
                            <TableCell align="right">Prix unitaire</TableCell>
                            <TableCell align="right">Sous-total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.orderPieces?.map((op, index) => {
                            const pieceName = op.piece?.name || `Pièce #${op.pieceId}`
                            const piecePrice = op.piece?.price !== undefined ? Number(op.piece.price) : 0
                            const quantity = op.quantity || 0
                            const subtotal = piecePrice * quantity

                            return (
                              <TableRow key={index}>
                                <TableCell>{pieceName}</TableCell>
                                <TableCell align="center">{quantity}</TableCell>
                                <TableCell align="right">{piecePrice.toFixed(2)} DT</TableCell>
                                <TableCell align="right">{subtotal.toFixed(2)} DT</TableCell>
                              </TableRow>
                            )
                          })}

                          {/* Calculer et afficher le sous-total, la remise et le total */}
                          {(() => {
                            const subtotal =
                              order.orderPieces?.reduce((total, op) => {
                                const piecePrice = op.piece?.price !== undefined ? Number(op.piece.price) : 0
                                const quantity = op.quantity || 0
                                return total + piecePrice * quantity
                              }, 0) || 0

                            let discountAmount = 0
                            if (order.discount && order.discount.value > 0) {
                              if (order.discount.type === "percentage") {
                                discountAmount = subtotal * (order.discount.value / 100)
                              } else {
                                discountAmount = Math.min(subtotal, order.discount.value)
                              }
                            }

                            const total = subtotal - discountAmount

                            return (
                              <>
                                <TableRow>
                                  <TableCell colSpan={3} align="right" sx={{ fontWeight: "medium" }}>
                                    Sous-total
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: "medium" }}>
                                    {subtotal.toFixed(2)} DT
                                  </TableCell>
                                </TableRow>

                                {/* Afficher la remise si elle existe */}
                                {order.discount && order.discount.value > 0 && (
                                  <TableRow>
                                    <TableCell colSpan={3} align="right" sx={{ color: "error.main" }}>
                                      Remise {order.discount.type === "percentage" ? `(${order.discount.value}%)` : ""}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "error.main" }}>
                                      -{discountAmount.toFixed(2)} DT
                                    </TableCell>
                                  </TableRow>
                                )}

                                <TableRow>
                                  <TableCell colSpan={3} align="right" sx={{ fontWeight: "bold" }}>
                                    Total
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                    {total.toFixed(2)} DT
                                  </TableCell>
                                </TableRow>
                              </>
                            )
                          })()}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Collapse>
              </Paper>
            )
          })}
        </CardContent>
      </Card>

      <Dialog
        open={isInvoiceDialogOpen}
        onClose={() => setIsInvoiceDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ReceiptIcon /> Facture #{selectedInvoice?.id}
          </Box>
          <IconButton onClick={() => setIsInvoiceDialogOpen(false)} size="small" sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 4 }}>
          {selectedInvoice && (
            <Box ref={invoiceRef}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 3,
                  position: "relative",
                }}
              >
                {/* En-tête de la facture */}
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Store color="primary" />
                      <Typography variant="h6" color="primary.main">
                        CarManagementSystem
                      </Typography>
                    </Box>
                    <Typography variant="body2">123 Rue du Commerce</Typography>
                    <Typography variant="body2">75000 Nabeul ,Tunis</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">+216 72 879 654</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2">contact@CarManagementSystem.com</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: "right" }}>
                    <Typography variant="h4" color="primary.main" gutterBottom>
                      FACTURE
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>N° Facture:</strong> {selectedInvoice.id}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>N° Commande:</strong> {selectedInvoice.orderId || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Date:</strong> {new Date().toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Informations client */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Client
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Nom:</strong> {selectedInvoice.clientInfo?.name || "Client au comptoir"}
                      </Typography>
                      {selectedInvoice.clientInfo?.phone && (
                        <Typography variant="body2">
                          <strong>Téléphone:</strong> {selectedInvoice.clientInfo.phone}
                        </Typography>
                      )}

                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Paiement
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Méthode:</strong> Espèces
                      </Typography>
                      <Typography variant="body2">
                        <strong>Statut:</strong> Payé
                      </Typography>
                      <Typography variant="body2">
                        <strong>Date de paiement:</strong> {new Date().toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Détails de la commande */}
                <Typography variant="subtitle1" gutterBottom>
                  Détails de la commande
                </Typography>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ mb: 3, border: "1px solid", borderColor: "divider" }}
                >
                  <Table>
                    <TableHead sx={{ bgcolor: "background.default" }}>
                      <TableRow>
                        <TableCell>
                          <strong>Pièces</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Quantité</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Prix unitaire</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Total</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedInvoice.items?.map((item: InvoiceItem, index: number) => {
                        // Récupérer les informations de la pièce depuis l'ordre correspondant
                        const order = orders?.find((o) => o.id === selectedInvoice.orderId)
                        const orderPiece = order?.orderPieces?.find((op) => op.pieceId === item.pieceId)

                        // Nom de la pièce - d'abord essayer depuis l'ordre, puis depuis le stock
                        const pieceName =
                          orderPiece?.piece?.name ||
                          (order ? getPieceInfoFromStock(item.pieceId).name : `Pièce #${item.pieceId}`)

                        return (
                          <TableRow key={index}>
                            <TableCell>{pieceName}</TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="right">{item.unitPrice.toFixed(2)} DT</TableCell>
                            <TableCell align="right">{(item.quantity * item.unitPrice).toFixed(2)} DT</TableCell>
                          </TableRow>
                        )
                      })}

                      {/* Calculer et afficher le sous-total, la remise et le total */}
                      {(() => {
                        const subtotal =
                          selectedInvoice.items?.reduce(
                            (total: number, item: InvoiceItem) => total + item.quantity * item.unitPrice,
                            0,
                          ) || 0

                        let discountAmount = 0
                        if (selectedInvoice.discount && selectedInvoice.discount > 0) {
                          discountAmount = selectedInvoice.discount

                        }

                        return (
                          <>
                            <TableRow>
                              <TableCell colSpan={3} align="right">
                                Sous-total
                              </TableCell>
                              <TableCell align="right">{subtotal.toFixed(2)} DT</TableCell>
                            </TableRow>

                            {/* Remise si applicable */}
                            {selectedInvoice.discount && selectedInvoice.discount > 0 && (
                              <TableRow>
                                <TableCell colSpan={3} align="right" sx={{ color: "error.main" }}>
                                  Remise{" "}
                                  {selectedInvoice.discountType === "percentage"
                                    ? `(${selectedInvoice.discountValue}%)`
                                    : ""}
                                </TableCell>
                                <TableCell align="right" sx={{ color: "error.main" }}>
                                  -{discountAmount.toFixed(2)} DT
                                </TableCell>
                              </TableRow>
                            )}

                            {/* Total */}
                            <TableRow sx={{ bgcolor: "primary.light" }}>
                              <TableCell
                                colSpan={3}
                                align="right"
                                sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                              >
                                Total12
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: "bold", color: "primary.contrastText" }}>
                                {subtotal.toFixed(2)} DT
                              </TableCell>
                            </TableRow>
                          </>
                        )
                      })()}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Notes et conditions */}
               <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        minHeight: "100px",
                      }}
                    >
                      <Typography variant="body2">
                        {selectedInvoice.description || "Merci pour votre achat!"}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Conditions de vente
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                        1. Paiement dû à réception de la facture.
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                        2. Garantie de 30 jours sur toutes les pièces.
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                        3. Retours acceptés dans les 14 jours avec preuve d'achat.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Zone de signature */}
                <Grid container spacing={3} sx={{ mt: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Signature du vendeur
                    </Typography>
                    <Box
                      sx={{
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 1,
                        p: 1,
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {signature ? (
                        <img src={signature || ""} alt="Signature" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                          Signature du vendeur
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Cachet de l'entreprise
                    </Typography>
                    <Box
                      sx={{
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 1,
                        p: 1,
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {companyStamp ? (
                        <img src={companyStamp || ""} alt="Cachet" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                          Cachet de l'entreprise
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}

          {/* Zone de signature interactive */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SignatureStamp onSign={setSignature} />
            </Grid>
            <Grid item xs={12} md={6}>
              <SignatureStamp onSign={setCompanyStamp} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "background.default" }}>
          <Button onClick={() => setIsInvoiceDialogOpen(false)} variant="outlined" startIcon={<Close />}>
            Fermer
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ContentCopy />}
            onClick={() => {
              if (invoiceRef.current) {
                const range = document.createRange()
                range.selectNode(invoiceRef.current)
                window.getSelection()?.removeAllRanges()
                window.getSelection()?.addRange(range)
                document.execCommand("copy")
                window.getSelection()?.removeAllRanges()
                toast.success("Facture copiée dans le presse-papier")
              }
            }}
          >
            Copier
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Download />}
            onClick={() => {
              // Logique pour télécharger la facture en PDF
              toast.success("Téléchargement de la facture")
            }}
          >
            Télécharger
          </Button>
          <Button variant="contained" color="primary" startIcon={<Print />} onClick={handlePrintInvoice}>
            Imprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
