"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, EyeOff, Shield, Check, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Simple toast notification type
type ToastType = {
  message: string
  type: "success" | "error"
  visible: boolean
}

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastType>({
    message: "",
    type: "success",
    visible: false,
  })
  const [resetSuccess, setResetSuccess] = useState(false)

  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  // Handle toast visibility
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.visible])

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({
      message,
      type,
      visible: true,
    })
  }

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    // Length check
    if (newPassword.length >= 8) strength += 1
    // Contains uppercase
    if (/[A-Z]/.test(newPassword)) strength += 1
    // Contains lowercase
    if (/[a-z]/.test(newPassword)) strength += 1
    // Contains number
    if (/[0-9]/.test(newPassword)) strength += 1
    // Contains special character
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1

    setPasswordStrength(strength)
  }, [newPassword])

  const getStrengthText = () => {
    if (passwordStrength === 0) return "Non évalué"
    if (passwordStrength === 1) return "Très faible"
    if (passwordStrength === 2) return "Faible"
    if (passwordStrength === 3) return "Moyen"
    if (passwordStrength === 4) return "Fort"
    return "Très fort"
  }

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200"
    if (passwordStrength === 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-orange-500"
    if (passwordStrength === 3) return "bg-yellow-500"
    if (passwordStrength === 4) return "bg-green-500"
    return "bg-green-600"
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      showToast("Les mots de passe ne correspondent pas.", "error")
      return
    }

    // Validate password strength
    if (passwordStrength < 3) {
      showToast("Veuillez choisir un mot de passe plus fort.", "error")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:3005/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      })

      if (response.ok) {
        setResetSuccess(true)
        showToast("Mot de passe réinitialisé avec succès !", "success")
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        showToast("Erreur : impossible de réinitialiser le mot de passe.", "error")
      }
    } catch (err) {
      showToast("Erreur de connexion au serveur.", "error")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-600 rounded-full opacity-10"></div>
        <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-blue-600 rounded-full opacity-10"></div>
        <div className="absolute top-1/4 right-0 transform translate-x-1/2 w-8 h-8 bg-red-500 rounded-full opacity-20"></div>

        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 p-3 rounded-full shadow-lg z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>

        <div className="bg-white border-none rounded-lg shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700"></div>

          {resetSuccess ? (
            <div className="py-10 px-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-blue-800 mb-2">Mot de passe réinitialisé !</h2>
              <p className="text-gray-600 mb-6">
                Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Aller à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div className="pt-10 pb-4 px-6 space-y-1">
                <h2 className="text-2xl font-bold text-center text-blue-800">Nouveau mot de passe</h2>
                <p className="text-center text-gray-600">Système de gestion des services automobiles</p>
              </div>

              <div className="pt-2 px-6">
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Créez un mot de passe fort en utilisant une combinaison de lettres, chiffres et caractères spéciaux.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre nouveau mot de passe"
                        className="w-full h-12 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {newPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Force du mot de passe:</span>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength < 3
                                ? "text-red-600"
                                : passwordStrength < 4
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {getStrengthText()}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStrengthColor()} transition-all duration-300`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>

                        {/* Password Requirements */}
                        <ul className="mt-2 space-y-1 text-xs text-gray-500">
                          <li className={`flex items-center ${newPassword.length >= 8 ? "text-green-600" : ""}`}>
                            {newPassword.length >= 8 ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Au moins 8 caractères
                          </li>
                          <li className={`flex items-center ${/[A-Z]/.test(newPassword) ? "text-green-600" : ""}`}>
                            {/[A-Z]/.test(newPassword) ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Une lettre majuscule
                          </li>
                          <li className={`flex items-center ${/[0-9]/.test(newPassword) ? "text-green-600" : ""}`}>
                            {/[0-9]/.test(newPassword) ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Un chiffre
                          </li>
                          <li
                            className={`flex items-center ${/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""}`}
                          >
                            {/[^A-Za-z0-9]/.test(newPassword) ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Un caractère spécial
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        className={`w-full h-12 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          confirmPassword && confirmPassword !== newPassword
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200"
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-xs text-red-600 mt-1 flex items-center">
                        <X className="h-3 w-3 mr-1" />
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading || passwordStrength < 3 || newPassword !== confirmPassword}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Traitement en cours...
                      </span>
                    ) : (
                      "Changer mon mot de passe"
                    )}
                  </button>
                </form>
              </div>

              <div className="flex justify-center border-t pt-4 pb-6 px-6 mt-6">
                <Link
                  href="/login"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à l'écran de connexion
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>© 2025 Système de Gestion Automobile</p>
        </div>
      </div>

      {/* Custom Toast Notification */}
      {toast.visible && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center transition-all transform translate-y-0 opacity-100 ${
            toast.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          <div
            className={`mr-3 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
              toast.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <p className={`text-sm ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}>{toast.message}</p>
        </div>
      )}
    </div>
  )
}
