"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useProgress } from "./hooks/useProgress"
import { useAuth } from "../login/hooks/useAuth"
import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'
import type { ReservedAppointment, Intervention } from "./services/progress.service"

export default function InterventionList() {
  const router = useRouter()
  const { loading, error, currentUser, getReservedAppointments, startIntervention, getInProgressInterventions } = useProgress()

  const [appointments, setAppointments] = useState<ReservedAppointment[]>([])
  const [providerAppointments, setProviderAppointments] = useState<Intervention[]>([])
  const [inProgress, setInProgress] = useState<Intervention[]>([])
  const [inProgressError, setInProgressError] = useState<string | null>(null)
  const [isStartingIntervention, setIsStartingIntervention] = useState<number | null>(null)

  useEffect(() => {
    console.log("Current user from useProgress:", currentUser)
    if (currentUser) {
      loadAppointments()
      loadInProgressInterventions()
    }
  }, [currentUser])

  const loadAppointments = async () => {
    try {
      console.log("=== LOADING APPOINTMENTS ===")
      console.log("Current user:", currentUser)
      
      const data = await getReservedAppointments()
      console.log("Appointments data:", data)
      
      if (currentUser?.role === 'PROVIDER') {
        setAppointments(data)
        setProviderAppointments([])
      } else {
        // Pour l'admin, filtrer les rendez-vous d'aujourd'hui
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        const todayAppointments = data.filter(appointment => {
          const appointmentDate = new Date(appointment.date)
          return appointmentDate >= today && appointmentDate < tomorrow
        }).map(appointment => ({
          ...appointment,
          date: new Date(appointment.date).toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        }))

        console.log("Today's appointments for admin:", todayAppointments)
        setAppointments(todayAppointments)
        setProviderAppointments([])
      }
    } catch (error) {
      console.error("Error in loadAppointments:", error)
      setAppointments([])
      setProviderAppointments([])
    }
  }

  const loadInProgressInterventions = async () => {
    try {
      setInProgressError(null)
      console.log("=== LOADING IN-PROGRESS INTERVENTIONS ===")
      console.log("Current user:", currentUser)
      
      const data = await getInProgressInterventions()
      console.log("In-progress interventions data:", data)
      setInProgress(data as Intervention[])
    } catch (error) {
      console.error("Error in loadInProgressInterventions:", error)
      setInProgressError("Erreur lors du chargement des interventions en cours")
      setInProgress([])
    }
  }

  const handleStartIntervention = async (appointmentId: number) => {
    try {
      setIsStartingIntervention(appointmentId)
      const intervention = await startIntervention(appointmentId, {
        description: "Nouvelle intervention",
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        price: 0,
      })
      router.push(`/progress/intervention/${intervention.id}`)
    } catch {
      // Handle error silently
    } finally {
      setIsStartingIntervention(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-blue-700">Chargement des données...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
        
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Une erreur est survenue</h2>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
            
             

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow rounded-lg border border-blue-200 transition-transform transform hover:scale-105">
    <div className="px-4 py-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-blue-200 rounded-md p-3">
          <svg
            className="h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="ml-4 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-blue-600">Rendez-vous réservés</dt>
            <dd className="mt-1 text-xl font-bold text-blue-900">{appointments.length}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>

  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 shadow rounded-lg border border-yellow-200 transition-transform transform hover:scale-105">
    <div className="px-4 py-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-yellow-200 rounded-md p-3">
          <svg
            className="h-6 w-6 text-yellow-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-4 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-yellow-600">Interventions en cours</dt>
            <dd className="mt-1 text-xl font-bold text-yellow-900">{inProgress.length}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>

  <div className="bg-gradient-to-br from-green-50 to-green-100 shadow rounded-lg border border-green-200 transition-transform transform hover:scale-105">
    <div className="px-4 py-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-green-200 rounded-md p-3">
          <svg
            className="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-4 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-green-600">Total</dt>
            <dd className="mt-1 text-xl font-bold text-green-900">
              {appointments.length + inProgress.length}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</div>


              {/* Rendez-vous réservés */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentUser?.role === 'PROVIDER' ? 'Mes Rendez-vous' : 'Rendez-vous réservés'}
                  </h2>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {appointments.length} rendez-vous
                  </span>
                </div>

                {appointments.length === 0 ? (
                  <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-gray-200">
                    <div className="px-4 py-12 sm:px-6 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
                      <p className="mt-1 text-sm text-gray-500">Il n'y a pas de rendez-vous pour le moment.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-white shadow-sm overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                  <svg
                                    className="h-6 w-6 text-blue-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {appointment.vehicle.brand} {appointment.vehicle.model}
                                </h3>
                                <div className="mt-1 flex items-center">
                                  <span className="text-sm text-gray-500">{appointment.vehicle.registration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {appointment.service.name}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <svg
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="text-sm text-gray-500">{appointment.date}</span>
                              </div>
                              <button
                                onClick={() => handleStartIntervention(appointment.id)}
                                disabled={isStartingIntervention === appointment.id}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                              >
                                {isStartingIntervention === appointment.id ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                    Démarrage...
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      className="-ml-1 mr-2 h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    Démarrer
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Interventions en cours */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Interventions en cours</h2>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {inProgress.length} interventions
                  </span>
                </div>

                {inProgressError && (
                  <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">{inProgressError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {inProgress.length === 0 ? (
                  <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-gray-200">
                    <div className="px-4 py-12 sm:px-6 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune intervention en cours</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Démarrez une intervention à partir d'un rendez-vous réservé.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    {inProgress.map((intervention) => (
                      <div
                        key={intervention.id}
                        className="bg-white shadow-sm overflow-hidden rounded-lg border-l-4 border-yellow-500 transition-all hover:shadow-md"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <svg
                                      className="h-6 w-6 text-yellow-600"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <h3 className="text-lg font-medium text-gray-900">Intervention #{intervention.id}</h3>
                                  <p className="text-sm text-gray-500">{intervention.description || "Aucune description"}</p>
                                </div>
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Véhicule</div>
                                  <div className="mt-1 text-sm text-gray-900">
                                    {intervention.appointment?.vehicle?.brand} {intervention.appointment?.vehicle?.model}
                                  </div>
                                  <div className="mt-1 text-xs text-gray-500">
                                    {intervention.appointment?.vehicle?.registration}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Service</div>
                                  <div className="mt-1 text-sm text-gray-900">{intervention.appointment?.service?.name}</div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => router.push(`/progress/intervention/${intervention.id}`)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                            >
                              <svg
                                className="-ml-1 mr-2 h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              Voir détails
                            </button>
                          </div>

                          <div className="mt-6 border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center">
                              <div className="text-sm font-medium text-gray-900">
                                Prix: <span className="font-semibold">{intervention.price} TND</span>
                              </div>
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                En cours
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
           
        
        </main>
      </div>
    </div>
  )
}
