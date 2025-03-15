const API_URL = '/api/stationnement'

export const getStationnementSlots = async () => {
  const response = await fetch(API_URL)

  return response.json()
}

export const updateStationnementSlot = async (id: number, available: boolean) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ available })
  })

  return response.json()
}
