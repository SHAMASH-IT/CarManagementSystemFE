const API_URL = process.env.NEXT_PUBLIC_API_URL // Base URL de ton back-end

export const fetchAppointments = async () => {
  const res = await fetch(`${API_URL}/appointments`)

  if (!res.ok) throw new Error('Failed to fetch appointments')

  return res.json()
}

export const createAppointment = async (data: any) => {
  const res = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) throw new Error('Failed to create appointment')

  return res.json()
}

export const updateAppointment = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) throw new Error('Failed to update appointment')

  return res.json()
}

export const deleteAppointment = async (id: number) => {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: 'DELETE'
  })

  if (!res.ok) throw new Error('Failed to delete appointment')
}
