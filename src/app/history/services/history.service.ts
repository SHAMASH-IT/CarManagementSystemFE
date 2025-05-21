import axios from 'axios';
import { Intervention } from '../types/intervention.types';

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005/api';

export const historyService = {
  getCompletedInterventions: async (userId: number): Promise<Intervention[]> => {
    try {
      const response = await axios.get(`${API_URL}/progress/completed/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed interventions:', error);
      throw error;
    }
  },

  getCompletedInterventionsWithInvoiceByUser: async (userId: number): Promise<Intervention[]> => {
    try {
      console.log('Fetching interventions with invoice for user:', userId);
      const response = await axios.get(`${API_URL}/progress/completed-with-invoice/${userId}`);
      console.log('Données brutes reçues:', JSON.stringify(response.data, null, 2));
      
      // Transformer les données pour correspondre à l'interface Intervention
      const interventions = response.data.map((intervention: any) => {
        console.log('Détails complets de l\'intervention:', {
          id: intervention.id,
          description: intervention.description,
          startDate: intervention.startDate,
          endDate: intervention.endDate,
          price: intervention.price,
          status: intervention.status,
          rate: intervention.rate,
          commentaire: intervention.commentaire,
          appointment: intervention.appointment,
          invoice: intervention.invoice,
          pieces: intervention.pieces
        });
        
        return {
          ...intervention,
          rate: intervention.rate,
          commentaire: intervention.commentaire,
          interventionPieces: intervention.pieces?.map((piece: any) => ({
            id: piece.id,
            pieceId: piece.id,
            quantity: piece.quantity,
            totalPrice: piece.totalPrice,
            piece: {
              id: piece.id,
              name: piece.name,
              price: piece.unitPrice
            }
          })) || []
        };
      });
      
      console.log('Interventions transformées avec notes:', interventions.map((i: Intervention) => ({
        id: i.id,
        description: i.description,
        rate: i.rate,
        commentaire: i.commentaire,
        status: i.status
      })));
      return interventions;
    } catch (error) {
      console.error('Error fetching completed interventions with invoice:', error);
      throw error;
    }
  },

  getInterventionDetails: async (id: number): Promise<Intervention> => {
    try {
      const response = await axios.get(`${API_URL}/progress/${id}`);
      console.log('Intervention details:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching intervention details for ID ${id}:`, error);
      throw error;
    }
  },

  getInterventionsByVehicle: async (registration: string): Promise<Intervention[]> => {
    try {
      const response = await axios.get(`${API_URL}/progress/interventions/vehicle/${registration}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching interventions for vehicle ${registration}:`, error);
      throw error;
    }
  },

  rateIntervention: async (id: number, rate: number, commentaire: string) => {
    try {
      const response = await axios.patch(
        `${API_URL}/progress/intervention/rate/${id}`,
        { rate, commentaire }
      );
      return response.data;
    } catch (error) {
      console.error(`Error rating intervention ${id}:`, error);
      throw error;
    }
  },
}; 