import { useState } from 'react';
import axios from 'axios';

export interface UpdateDealData {
  title?: string;
  amount?: number;
  stage?: string;
}

export const useUpdateDeal = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDeal = async (dealId: string, data: UpdateDealData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${apiUrl}/deals/${dealId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      setError('Failed to update deal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateDeal, loading, error };
};
