"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, Shield } from "lucide-react"

// Simple toast notification type
type ToastType = {
  message: string
  type: "success" | "error"
  visible: boolean
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastType>({
    message: "",
    type: "success",
    visible: false,
  })

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://localhost:3005/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        showToast("Un email de réinitialisation a été envoyé à votre adresse.", "success")
        setEmail("")
      } else {
        showToast("Impossible d'envoyer l'email de réinitialisation.", "error")
      }
    } catch (err) {
      showToast("Impossible de se connecter au serveur.", "error")
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
          <div className="pt-10 pb-4 px-6 space-y-1">
            <h2 className="text-2xl font-bold text-center text-blue-800">Récupération de mot de passe</h2>
            <p className="text-center text-gray-600">Système de gestion des services automobiles</p>
          </div>

          <div className="pt-4 px-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Pour des raisons de sécurité, le lien de réinitialisation expirera après une heure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  Email professionnel
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="votre.email@entreprise.com"
                  className="w-full h-12 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
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
                  "Réinitialiser mon mot de passe"
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
