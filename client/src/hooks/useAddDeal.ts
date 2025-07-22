import { useState } from 'react';
import axios from 'axios';

export interface AddDealData {
  title: string;
  amount?: number;
  stage: string;
  customerId: string;
}

export const useAddDeal = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDeal = async (data: AddDealData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/deals`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      setError('Failed to add deal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addDeal, loading, error };
}; 