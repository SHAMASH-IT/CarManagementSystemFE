import React from 'react'

const StationnementSlot = ({ number, available }: { number: string; available: boolean }) => {
  return (
    <div className={`p-4 border rounded-lg text-center ${available ? 'bg-green-300' : 'bg-red-300'}`}>
      <p>Place {number}</p>
      <p>{available ? 'Disponible' : 'Occupée'}</p>
    </div>
  )
}

export default StationnementSlot
