import type { Appointment } from '../../types/index'

const fakeAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'John Doe',
    service: 'Consultation',
    date: '2023-04-10T10:30:00',
    status: 'En attente',
    vehicleName: 'Toyota Prius'
  },
  {
    id: '2',
    clientName: 'Jane Smith',
    service: 'Massage',
    date: '2023-04-11T14:00:00',
    status: 'Accepté',
    vehicleName: 'Honda Accord'
  }
]

// Fonction pour récupérer les rendez-vous (simule un appel API)
export const getAppointments = async (): Promise<Appointment[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fakeAppointments)
    }, 1000)
  })
}
