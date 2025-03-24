import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_APP_URL


interface ParkingSlot {
  id: number;
  bloc: string;
  place: number;
  status: string;
}


const useParking = () => {
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]); 

  useEffect(() => {
    fetch(`${API_URL}/parking/all-parkings`)
      .then(res => res.json())
      .then(data => setParkingSlots(data))
      .catch(err => console.error(err));
  }, []);

  return { parkingSlots };
};

export default useParking;
