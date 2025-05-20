"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import HistoryView from "./historyView"
import Sidebar from "../../common/Sidebar"
import Navbar from "../../common/Navbar"

export default function HistoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.log("No token found, redirecting to login")
          router.push("/login")
          return
        }

        // Décodage du token JWT pour obtenir les informations de l'utilisateur
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        
        // Extraction des données utilisateur depuis le payload décodé
        const decodedUser = JSON.parse(jsonPayload)
        console.log("Decoded user data:", decodedUser)

        if (!decodedUser.sub) {
          console.log("No user ID found in token")
          router.push("/login")
          return
        }

        if (decodedUser.role === "ADMIN" || decodedUser.role === "PROVIDER") {
          const userData = {
            id: decodedUser.sub,
            email: decodedUser.email,
            role: decodedUser.role
          }
          console.log("Setting user data:", userData)
          setUserData(userData)
          setIsLoading(false)
        } else {
          console.log("User role not authorized:", decodedUser.role)
          router.push("/")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userData) {
    console.log("No user data available")
    return null
  }

  console.log("Rendering with user data:", userData)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          <HistoryView 
            userRole={userData.role} 
            userId={userData.id} 
          />
        </main>
      </div>
    </div>
  )
} 