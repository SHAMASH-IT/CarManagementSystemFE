"use client"

import type React from "react"

import { useState } from "react"
import {
  Button,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  IconButton,
  Grid,
  Divider,
  Paper,
  Tooltip,
  InputAdornment,
  Chip,
  Stack,
  Fade,
} from "@mui/material"
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart,
  Discount as DiscountIcon,
  Info as InfoIcon,
  Calculate as CalculateIcon,
} from "@mui/icons-material"
import type { OrderPiece } from "../service/OrderSellService"
import { useOrderSell } from "../hooks/useOrderSell"
import toast from "react-hot-toast"

interface Piece {
  id: number
  name: string
  price: number
  stock: number
}

interface Props {
  pieces: Piece[]
  onSuccess?: () => void
}

export const CreateOrderSellForm = ({ pieces = [], onSuccess }: Props) => {
  const { createOrder, isCreating } = useOrderSell()
  const [orderPieces, setOrderPieces] = useState<OrderPiece[]>([{ pieceId: 0, quantity: 1 }])
  const [discount, setDiscount] = useState<number>(0)
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")

  const handleAddPiece = () => {
    setOrderPieces([...orderPieces, { pieceId: 0, quantity: 1 }])
  }

  const handleRemovePiece = (index: number) => {
    setOrderPieces(orderPieces.filter((_, i) => i !== index))
  }

  const handlePieceChange = (index: number, field: keyof OrderPiece, value: number) => {
    const newOrderPieces = [...orderPieces]
    newOrderPieces[index] = { ...newOrderPieces[index], [field]: value }
    setOrderPieces(newOrderPieces)
  }

  const handleDiscountChange = (value: number) => {
    if (discountType === "percentage" && value > 100) {
      setDiscount(100)
      return
    }
    setDiscount(value)
  }

  const handleDiscountTypeChange = (type: "percentage" | "fixed") => {
    setDiscountType(type)
    // Reset discount value when changing type to avoid confusion
    setDiscount(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const validOrderPieces = orderPieces.filter((p) => p.pieceId !== 0 && p.quantity > 0)
      if (validOrderPieces.length === 0) {
        toast.error("Au moins une pièce est requise")
        return
      }

      // Vérifier les quantités disponibles
      const invalidPieces = validOrderPieces.filter((op) => {
        const piece = pieces.find((p) => p.id === op.pieceId)
        return piece && op.quantity > piece.stock
      })

      if (invalidPieces.length > 0) {
        toast.error("Certaines quantités dépassent le stock disponible")
        return
      }

      const orderData = {
        pieces: validOrderPieces,
        // Information client vide car non nécessaire
        clientInfo: {
          name: "",
          phone: "",
        },
        // Ajouter les informations de remise
        discount: {
          value: discount,
          type: discountType,
        },
      }

      console.log("Envoi de la commande:", orderData)

      await createOrder(orderData, {
        onSuccess: () => {
          console.log("Réinitialisation du formulaire")
          setOrderPieces([{ pieceId: 0, quantity: 1 }])
          setDiscount(0)
          if (onSuccess) {
            console.log("Appel du callback onSuccess")
            onSuccess()
          }
        },
      })
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error)
      toast.error("Une erreur est survenue lors de la création de la commande")
    }
  }

  const getAvailablePieces = () => {
    if (!Array.isArray(pieces)) return []
    return pieces.filter((p) => p.stock > 0)
  }

  const calculateSubtotal = () => {
    if (!Array.isArray(pieces) || !Array.isArray(orderPieces)) return 0

    return orderPieces.reduce((total, op) => {
      const piece = pieces.find((p) => p.id === op.pieceId)
      return total + (piece ? piece.price * op.quantity : 0)
    }, 0)
  }

  const calculateDiscountAmount = (subtotal: number) => {
    if (discount <= 0) return 0

    if (discountType === "percentage") {
      return subtotal * (discount / 100)
    } else {
      return discount > subtotal ? subtotal : discount
    }
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountAmount = calculateDiscountAmount(subtotal)
    return subtotal - discountAmount
  }

  const getMaxQuantity = (pieceId: number): number => {
    if (!Array.isArray(pieces)) return 1
    const piece = pieces.find((p) => p.id === pieceId)
    return piece?.stock || 1
  }

  const getPiecePrice = (pieceId: number): number => {
    if (!Array.isArray(pieces)) return 0
    const piece = pieces.find((p) => p.id === pieceId)
    return piece?.price || 0
  }

  const subtotal = calculateSubtotal()
  const discountAmount = calculateDiscountAmount(subtotal)
  const total = calculateTotal()

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ShoppingCart />
        <Typography variant="h6">Nouvelle Vente</Typography>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <InfoIcon fontSize="small" color="primary" />
                Sélection des articles
              </Typography>

              {Array.isArray(orderPieces) &&
                orderPieces.map((piece, index) => (
                  <Fade in={true} key={index} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "all 0.3s",
                        "&:hover": {
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Pièce</InputLabel>
                            <Select
                              value={piece.pieceId}
                              onChange={(e) => handlePieceChange(index, "pieceId", Number(e.target.value))}
                              required
                              label="Pièce"
                            >
                              <MenuItem value={0}>Sélectionner une pièce</MenuItem>
                              {getAvailablePieces().map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    width="100%"
                                    alignItems="center"
                                  >
                                    <Typography>{p.name}</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Chip
                                        label={`${p.price.toFixed(2)}€`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                      <Chip
                                        label={`Stock: ${p.stock}`}
                                        size="small"
                                        color={p.stock > 5 ? "success" : "warning"}
                                        variant="outlined"
                                      />
                                    </Stack>
                                  </Stack>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <TextField
                            type="number"
                            label="Quantité"
                            value={piece.quantity}
                            onChange={(e) => handlePieceChange(index, "quantity", Number(e.target.value))}
                            inputProps={{
                              min: 1,
                              max: getMaxQuantity(piece.pieceId),
                            }}
                            required
                            fullWidth
                            size="small"
                          />
                        </Grid>

                        <Grid item xs={6} md={2}>
                          {piece.pieceId > 0 && (
                            <Box sx={{ textAlign: "right" }}>
                              <Typography variant="body2" color="text.secondary">
                                Sous-total:
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {(getPiecePrice(piece.pieceId) * piece.quantity).toFixed(2)}€
                              </Typography>
                            </Box>
                          )}
                        </Grid>

                        <Grid item xs={12} md={1} sx={{ display: "flex", justifyContent: "center" }}>
                          <Tooltip title="Supprimer">
                            <IconButton
                              onClick={() => handleRemovePiece(index)}
                              disabled={orderPieces.length === 1}
                              color="error"
                              size="small"
                              sx={{
                                border: "1px solid",
                                borderColor: "error.main",
                                "&.Mui-disabled": {
                                  borderColor: "action.disabledBackground",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Fade>
                ))}

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddPiece}
                  sx={{
                    borderRadius: 4,
                    px: 3,
                  }}
                >
                  Ajouter une pièce
                </Button>
              </Box>
            </Grid>

            

            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "primary.light",
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <CalculateIcon fontSize="small" color="primary" />
                  Récapitulatif
                </Typography>

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Sous-total:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      {subtotal.toFixed(2)}€
                    </Typography>
                  </Grid>

                  {discount > 0 && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Remise {discountType === "percentage" ? `(${discount}%)` : ""}:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" align="right" color="error">
                          -{discountAmount.toFixed(2)}€
                        </Typography>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" fontWeight="bold" align="right" color="primary">
                      {total.toFixed(2)}€
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isCreating}
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
              }}
            >
              {isCreating ? "Création en cours..." : "Créer la vente"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Paper>
  )
}
