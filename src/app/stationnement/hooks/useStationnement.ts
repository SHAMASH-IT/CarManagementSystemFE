import { useState, useEffect } from 'react'

const useStationnement = () => {
  const [stationnementSlots, setStationnementSlots] = useState([])

  useEffect(() => {
    fetch('/api/stationnement') // Remplacez par l’URL réelle
      .then(res => res.json())
      .then(data => setStationnementSlots(data))
      .catch(err => console.error(err))
  }, [])

  return { stationnementSlots }
}

export default useStationnement
