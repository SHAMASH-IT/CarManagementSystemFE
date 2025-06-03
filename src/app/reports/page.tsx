"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import type { AdminDashboardData } from "./types"
// @ts-ignore
import html2pdf from "html2pdf.js"
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';

// Définition des composants Card simplifiés si vous n'avez pas shadcn/ui
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`rounded-lg ${className}`}>{children}</div>
)

const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)

const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={`text-xl font-bold ${className}`}>{children}</h3>
)

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-slate-500">{children}</p>
)

const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-4 pt-0 ${className}`}>{children}</div>
)

// Icônes simplifiées si vous n'avez pas lucide-react
const IconWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center justify-center ${className}`}>{children}</div>
)

const Users = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  </IconWrapper>
)

const UserCheck = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <polyline points="16 11 18 13 22 9"></polyline>
    </svg>
  </IconWrapper>
)

const Car = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path>
      <circle cx="6.5" cy="16.5" r="2.5"></circle>
      <circle cx="16.5" cy="16.5" r="2.5"></circle>
    </svg>
  </IconWrapper>
)

const DollarSign = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  </IconWrapper>
)

const Calendar = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  </IconWrapper>
)

const CheckCircle = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  </IconWrapper>
)

const Clock = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  </IconWrapper>
)

const XCircle = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  </IconWrapper>
)

const PlayCircle = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polygon points="10 8 16 12 10 16 10 8"></polygon>
    </svg>
  </IconWrapper>
)

const Star = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  </IconWrapper>
)

const TrendingUp = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  </IconWrapper>
)

const Activity = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  </IconWrapper>
)

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>({
    overview: {
      totalClients: 0,
      totalProviders: 0,
      totalVehicles: 0,
      totalRevenue: 0,
      last28DaysRevenue: 0,
      last70DaysRevenue: 0,
      last90DaysRevenue: 0,
      yearlyRevenue: 0,
    },
    services: [],
    providers: [],
    appointments: {
      total: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
      inProgress: 0,
      reserved: 0,
      last28Days: 0,
      last70Days: 0,
      last90Days: 0,
    },
    periodStats: {
      activeVehicles: 0,
      activeClients: 0,
      loyalClients: [],
      period: {
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        days: 28,
      },
    },
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Début du chargement des données...")

        // Récupérer les données de base
        const [
          appointments28Days,
          appointments70Days,
          appointments90Days,
          revenue28Days,
          revenue70Days,
          revenue90Days,
          revenueYear,
          averageRates,
          periodStats,
        ] = await Promise.all([
          axios.get("http://localhost:3005/reports/last-28-days"),
          axios.get("http://localhost:3005/reports/last-70-days"),
          axios.get("http://localhost:3005/reports/last-90-days"),
          axios.get("http://localhost:3005/reports/invoices/last28days"),
          axios.get("http://localhost:3005/reports/invoices/last70days"),
          axios.get("http://localhost:3005/reports/invoices/last90days"),
          axios.get("http://localhost:3005/reports/invoices/year"),
          axios.get("http://localhost:3005/reports/average-rates"),
          axios.get("http://localhost:3005/reports/period-stats"),
        ])

        console.log("Données reçues:", {
          appointments28Days: appointments28Days.data,
          appointments70Days: appointments70Days.data,
          appointments90Days: appointments90Days.data,
          revenue28Days: revenue28Days.data,
          revenue70Days: revenue70Days.data,
          revenue90Days: revenue90Days.data,
          revenueYear: revenueYear.data,
          averageRates: averageRates.data,
          periodStats: periodStats.data,
        })

        // Vérifier si les données sont valides et les transformer si nécessaire
        const appointmentsData = appointments28Days.data?.appointments || appointments28Days.data || []
        const appointments70Data = appointments70Days.data?.appointments || appointments70Days.data || []
        const appointments90Data = appointments90Days.data?.appointments || appointments90Days.data || []

        if (!Array.isArray(appointmentsData)) {
          console.warn("Format de données invalide")
          setError("Format de données invalide")
          return
        }

        // Calculer les statistiques des rendez-vous
        const appointments = {
          total: appointmentsData.length || 0,
          completed: appointmentsData.filter((a: any) => a?.status === "COMPLETED").length || 0,
          pending: appointmentsData.filter((a: any) => a?.status === "PENDING").length || 0,
          cancelled: appointmentsData.filter((a: any) => a?.status === "CANCELLED").length || 0,
          inProgress: appointmentsData.filter((a: any) => a?.status === "IN_PROGRESS").length || 0,
          reserved: appointmentsData.filter((a: any) => a?.status === "RESERVED").length || 0,
          last28Days: appointmentsData.length || 0,
          last70Days: Array.isArray(appointments70Data) ? appointments70Data.length : 0,
          last90Days: Array.isArray(appointments90Data) ? appointments90Data.length : 0,
        }

        console.log("Statistiques des rendez-vous calculées:", appointments)

        // Calculer les revenus
        const overview = {
          totalClients: new Set(appointmentsData.map((a: any) => a?.clientId).filter(Boolean)).size || 0,
          totalProviders: new Set(appointmentsData.map((a: any) => a?.providerId).filter(Boolean)).size || 0,
          totalVehicles: new Set(appointmentsData.map((a: any) => a?.vehicleId).filter(Boolean)).size || 0,
          totalRevenue: Number(revenueYear.data) || 0,
          last28DaysRevenue: Number(revenue28Days.data) || 0,
          last70DaysRevenue: Number(revenue70Days.data) || 0,
          last90DaysRevenue: Number(revenue90Days.data) || 0,
          yearlyRevenue: Number(revenueYear.data) || 0,
        }

        console.log("Vue d'ensemble calculée:", overview)

        // Calculer les statistiques des services
        const servicesMap = new Map()
        appointmentsData.forEach((appointment: any) => {
          if (!appointment?.serviceId || !appointment?.service?.name) return

          const serviceId = appointment.serviceId
          const serviceName = appointment.service.name

          if (!servicesMap.has(serviceId)) {
            servicesMap.set(serviceId, {
              serviceId,
              serviceName,
              totalAppointments: 0,
              completedAppointments: 0,
              revenue: 0,
              averageRating: 0,
              ratingCount: 0,
            })
          }

          const service = servicesMap.get(serviceId)
          service.totalAppointments++

          if (appointment.status === "COMPLETED") {
            service.completedAppointments++
          }
        })

        // Récupérer les revenus pour chaque service
        const serviceIds = Array.from(servicesMap.keys())
        const serviceRevenues = await Promise.all(
          serviceIds.map(async (serviceId) => {
            try {
              const [totalRevenue, last28DaysRevenue] = await Promise.all([
                axios.get(`http://localhost:3005/reports/invoices/service/${serviceId}/total`),
                axios.get(`http://localhost:3005/reports/invoices/service/${serviceId}/last28days`),
              ])

              return {
                serviceId,
                totalRevenue: totalRevenue.data || 0,
                last28DaysRevenue: last28DaysRevenue.data || 0,
              }
            } catch (error) {
              console.error(`Erreur lors de la récupération des revenus pour le service ${serviceId}:`, error)
              return {
                serviceId,
                totalRevenue: 0,
                last28DaysRevenue: 0,
              }
            }
          }),
        )

        // Mettre à jour les revenus des services
        serviceRevenues.forEach(({ serviceId, totalRevenue, last28DaysRevenue }) => {
          const service = servicesMap.get(serviceId)
          if (service) {
            service.revenue = totalRevenue
            service.last28DaysRevenue = last28DaysRevenue
          }
        })

        // Mettre à jour les taux moyens des services
        if (Array.isArray(averageRates.data)) {
          console.log("Données des taux moyens reçues:", averageRates.data)
          averageRates.data.forEach((rateData: any) => {
            console.log("Mise à jour du taux pour le service:", {
              serviceId: rateData.serviceId,
              averageRate: rateData.averageRate,
              serviceName: rateData.serviceName,
            })
            const service = servicesMap.get(rateData.serviceId)
            if (service) {
              service.averageRating = rateData.averageRate || 0
              console.log("Service mis à jour:", {
                serviceId: service.serviceId,
                serviceName: service.serviceName,
                newAverageRating: service.averageRating,
              })
            } else {
              console.warn("Service non trouvé pour le taux:", rateData.serviceId)
            }
          })
        }

        console.log("Services finaux avec revenus et taux:", Array.from(servicesMap.values()))

        // Calculer les statistiques des prestataires
        const providersMap = new Map()
        appointmentsData.forEach((appointment: any) => {
          if (!appointment?.providerId || !appointment?.provider?.name) return

          const providerId = appointment.providerId
          const providerName = appointment.provider.name

          if (!providersMap.has(providerId)) {
            providersMap.set(providerId, {
              providerId,
              providerName,
              totalAppointments: 0,
              completedAppointments: 0,
              revenue: 0,
              averageRating: 0,
              ratingCount: 0,
            })
          }

          const provider = providersMap.get(providerId)
          provider.totalAppointments++

          if (appointment.status === "COMPLETED") {
            provider.completedAppointments++
          }

          provider.revenue += Number(appointment.totalAmount) || 0

          if (appointment.rating) {
            provider.ratingCount++
            provider.averageRating =
              (provider.averageRating * (provider.ratingCount - 1) + appointment.rating) / provider.ratingCount
          }
        })

        console.log("Services calculés:", Array.from(servicesMap.values()))
        console.log("Prestataires calculés:", Array.from(providersMap.values()))

        setDashboardData({
          overview,
          services: Array.from(servicesMap.values()),
          providers: Array.from(providersMap.values()),
          appointments,
          periodStats: periodStats.data,
        })

        console.log("Données du tableau de bord mises à jour")
      } catch (error) {
        console.error("Erreur détaillée:", error)
        setError("Une erreur est survenue lors du chargement des données.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-96 shadow-xl border-0">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-medium">Chargement des données...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Tableau de bord</h1>
            <p className="text-slate-500 text-base mt-1">Vue d'ensemble de votre plateforme</p>
          </div>
          <button
            onClick={() => setShowReport(!showReport)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg shadow-sm hover:bg-indigo-700 transition-all duration-300 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span>{showReport ? "Masquer le rapport" : "Afficher le rapport complet"}</span>
          </button>
        </div>
       

        {showReport && (
          <div className="bg-white rounded-lg shadow-2xl p-8 print:p-0" id="report-content">
            {/* En-tête du rapport */}
            <div className="flex justify-between items-center mb-8 print:mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Rapport d'analyse</h1>
                <p className="text-slate-600">Généré le {new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="flex space-x-4 print:hidden">
                <button
                  id="download-pdf-btn"
                  onClick={() => {
                    const btn = document.getElementById('download-pdf-btn');
                    const element = document.getElementById('report-content');
                    if (btn) btn.style.display = 'none';
                    if (element) {
                      const opt = {
                        margin: 1,
                        filename: `rapport-analyse-${new Date().toISOString().split('T')[0]}.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                      };
                      html2pdf().set(opt).from(element).save().then(() => {
                        if (btn) btn.style.display = '';
                      });
                    } else {
                      if (btn) btn.style.display = '';
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Télécharger PDF</span>
                </button>
              </div>
            </div>

            {/* Résumé exécutif */}
            <div className="mb-8 print:mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Résumé exécutif</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">Revenus (28j)</p>
                  <p className="text-2xl font-bold text-blue-900">{dashboardData.overview.last28DaysRevenue.toFixed(2)} DT</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <p className="text-sm text-emerald-600 font-medium">Rendez-vous (28j)</p>
                  <p className="text-2xl font-bold text-emerald-900">{dashboardData.appointments.last28Days}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <p className="text-sm text-purple-600 font-medium">Clients actifs</p>
                  <p className="text-2xl font-bold text-purple-900">{dashboardData.periodStats?.activeClients || 0}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <p className="text-sm text-amber-600 font-medium">Véhicules actifs</p>
                  <p className="text-2xl font-bold text-amber-900">{dashboardData.periodStats?.activeVehicles || 0}</p>
                </div>
              </div>
            </div>

            {/* Analyse par période */}
            <div className="space-y-8 print:space-y-4">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Analyse par période</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">28 derniers jours</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Rendez-vous</span>
                        <span className="font-medium text-slate-900">{dashboardData.appointments.last28Days}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Revenus</span>
                        <span className="font-medium text-slate-900">{dashboardData.overview.last28DaysRevenue.toFixed(2)} DT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Clients actifs</span>
                        <span className="font-medium text-slate-900">{dashboardData.periodStats?.activeClients || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-4">70 derniers jours</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Rendez-vous</span>
                        <span className="font-medium text-slate-900">{dashboardData.appointments.last70Days}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Revenus</span>
                        <span className="font-medium text-slate-900">{dashboardData.overview.last70DaysRevenue.toFixed(2)} DT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Croissance</span>
                        <span className="font-medium text-emerald-600">
                          {((dashboardData.overview.last70DaysRevenue / dashboardData.overview.last28DaysRevenue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">90 derniers jours</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Rendez-vous</span>
                        <span className="font-medium text-slate-900">{dashboardData.appointments.last90Days}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Revenus</span>
                        <span className="font-medium text-slate-900">{dashboardData.overview.last90DaysRevenue.toFixed(2)} DT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Croissance</span>
                        <span className="font-medium text-purple-600">
                          {((dashboardData.overview.last90DaysRevenue / dashboardData.overview.last28DaysRevenue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analyse des services */}
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Performance des services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.services.map((service) => (
                    <div key={service.serviceId} className="bg-white p-6 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">{service.serviceName}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Rendez-vous totaux</span>
                          <span className="font-medium text-slate-900">{service.totalAppointments}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Rendez-vous complétés</span>
                          <span className="font-medium text-emerald-600">{service.completedAppointments}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Revenus</span>
                          <span className="font-medium text-blue-600">{service.revenue.toFixed(2)} DT</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Note moyenne</span>
                          <span className="font-medium text-purple-600">{service.averageRating.toFixed(1)}/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clients fidèles */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Top clients fidèles</h2>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <div className="space-y-4">
                    {dashboardData.periodStats?.loyalClients.map((client, index) => (
                      <div key={client.clientId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                          <span className="font-medium text-slate-900">{client.clientName}</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">{client.appointmentCount} rendez-vous</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <XCircle className="h-6 w-6 text-red-500" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vue d'ensemble */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <Activity className="h-7 w-7 text-blue-600" />
              <span>Vue d'ensemble</span>
            </CardTitle>
            <CardDescription>Statistiques et prédictions de revenus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-xs font-medium uppercase tracking-wide">Revenus actuels (28j)</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {dashboardData.overview.last28DaysRevenue.toFixed(2)} DT
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600 text-xs font-medium uppercase tracking-wide">Prédiction (30j)</p>
                      <p className="text-2xl font-bold text-emerald-900 mt-1">
                        {(dashboardData.overview.last28DaysRevenue * 1.1).toFixed(2)} DT
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-xs font-medium uppercase tracking-wide">Prédiction (60j)</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">
                        {(dashboardData.overview.last28DaysRevenue * 2.2).toFixed(2)} DT
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-600 text-xs font-medium uppercase tracking-wide">Revenus annuels</p>
                      <p className="text-xl font-bold text-amber-900 mt-1">
                        {dashboardData.overview.yearlyRevenue.toFixed(2)} DT
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Rendez-vous */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <Calendar className="h-7 w-7 text-indigo-600" />
              <span>Rendez-vous</span>
            </CardTitle>
            <CardDescription>Statistiques des rendez-vous</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Vue d'ensemble par période */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Vue d'ensemble par période</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-xs font-medium uppercase tracking-wide">28 derniers jours</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{dashboardData.appointments.last28Days}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-600 text-xs font-medium uppercase tracking-wide">70 derniers jours</p>
                        <p className="text-2xl font-bold text-emerald-900 mt-1">{dashboardData.appointments.last70Days}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-xs font-medium uppercase tracking-wide">90 derniers jours</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">{dashboardData.appointments.last90Days}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Statut des rendez-vous */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700">Statut des rendez-vous</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-slate-500" />
                  <span className="text-sm text-slate-600">État actuel et statistiques sur 28 jours</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-600 text-xs font-medium uppercase tracking-wide">Total (28j)</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{dashboardData.appointments.last28Days}</p>
                    <p className="text-xs text-slate-500 mt-1">sur 28 jours</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-600 text-xs font-medium uppercase tracking-wide">Complétés (28j)</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {dashboardData.appointments.completed}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      {((dashboardData.appointments.completed / dashboardData.appointments.last28Days) * 100).toFixed(1)}% du total
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <PlayCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-600 text-xs font-medium uppercase tracking-wide">En cours</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {dashboardData.appointments.inProgress}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">aujourd'hui</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-yellow-600 text-xs font-medium uppercase tracking-wide">En attente</p>
                    <p className="text-2xl font-bold text-yellow-900 mt-1">
                      {dashboardData.appointments.pending}
                    </p>
                    <p className="text-xs text-yellow-500 mt-1">aujourd'hui</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-purple-600 text-xs font-medium uppercase tracking-wide">Réservés</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      {dashboardData.appointments.reserved || 0}
                    </p>
                    <p className="text-xs text-purple-500 mt-1">aujourd'hui</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-red-600 text-xs font-medium uppercase tracking-wide">Annulés (28j)</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">
                      {dashboardData.appointments.cancelled}
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      {((dashboardData.appointments.cancelled / dashboardData.appointments.last28Days) * 100).toFixed(1)}% du total
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <TrendingUp className="h-7 w-7 text-green-600" />
              <span>Services</span>
            </CardTitle>
            <CardDescription>Performance des services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.services.map((service) => (
                <Card
                  key={service.serviceId}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-slate-50"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-center text-slate-800 border-b border-slate-200 pb-2">
                      {service.serviceName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                        <p className="text-blue-600 text-xs font-medium">Rendez-vous</p>
                        <p className="text-xl font-bold text-blue-900">{service.totalAppointments}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                        <p className="text-green-600 text-xs font-medium">Complétés</p>
                        <p className="text-xl font-bold text-green-900">{service.completedAppointments}</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
                        <p className="text-amber-600 text-xs font-medium">Revenus</p>
                        <p className="text-lg font-bold text-amber-900">{service.revenue.toFixed(2)} DT</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-purple-600" />
                          <p className="text-purple-600 text-xs font-medium">Note</p>
                        </div>
                        <p className="text-lg font-bold text-purple-900">{service.averageRating.toFixed(1)}/5</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques de période */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <Users className="h-7 w-7 text-indigo-600" />
              <span>Statistiques Clients & Véhicules</span>
            </CardTitle>
            <CardDescription>Statistiques sur les {dashboardData.periodStats?.period.days || 28} derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Statistiques des véhicules */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-center text-slate-800 border-b border-blue-200 pb-2">
                    Véhicules Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center">
                    <Car className="h-12 w-12 text-blue-600 mr-4" />
                    <div>
                      <p className="text-3xl font-bold text-blue-700">
                        {dashboardData.periodStats?.activeVehicles || 0}
                      </p>
                      <p className="text-sm text-blue-600">Véhicules en service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques des clients */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-center text-slate-800 border-b border-emerald-200 pb-2">
                    Clients Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center">
                    <Users className="h-12 w-12 text-emerald-600 mr-4" />
                    <div>
                      <p className="text-3xl font-bold text-emerald-700">
                        {dashboardData.periodStats?.activeClients || 0}
                      </p>
                      <p className="text-sm text-emerald-600">Clients actifs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clients fidèles */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-center text-slate-800 border-b border-purple-200 pb-2">
                    Clients Fidèles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {dashboardData.periodStats?.loyalClients.map((client, index) => (
                      <div key={client.clientId} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors duration-200">
                        <div className="flex items-center">
                          <UserCheck className="h-5 w-5 text-purple-600 mr-2" />
                          <span className="text-sm font-medium text-purple-700">{client.clientName}</span>
                        </div>
                        <span className="text-sm font-bold text-purple-600">{client.appointmentCount} RDV</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const ReportsLayout = () => (
  <div className="min-h-screen flex">
    {/* Sidebar à gauche */}
    <Sidebar />
    {/* Contenu principal avec navbar en haut */}
    <div className="flex-1 flex flex-col">
      {/* Navbar en haut */}
      <div className="flex justify-end">
        <Navbar />
      </div>
      {/* Contenu principal */}
      <main className="flex-1 p-4 bg-slate-50 overflow-auto">
        <AdminDashboard />
      </main>
    </div>
  </div>
)

export default ReportsLayout;
