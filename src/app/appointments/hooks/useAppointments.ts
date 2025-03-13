'use client'
import { useState, useEffect } from 'react'

import type { Appointment } from '../../types/index'

export default function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Utilisation de données statiques pour tester
        const staticData: Appointment[] = [
          {
            id: '1',

            date: '2025-03-10',
            clientName: 'John Doe',
            service: 'Mécanique',
            status: 'Confirmé',
            vehicleName: 'Toyota Prius'
          },
          {
            id: '2',

            date: '2025-03-12',
            clientName: 'Jane Smith',
            service: 'Pneumatique',
            status: 'En attente',
            vehicleName: 'Honda Accord'
          },
          {
            id: '3',

            date: '2025-03-15',
            clientName: 'Marc Dupont',
            service: 'Révision',
            status: 'Annulé',
            vehicleName: 'Honda Accord'
          }
        ]

        // Simuler un chargement
        setTimeout(() => {
          setAppointments(staticData)
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError('Erreur lors du chargement des rendez-vous')
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  return { appointments, loading, error }
}
