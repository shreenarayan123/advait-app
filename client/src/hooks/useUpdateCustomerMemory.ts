import { useState, useCallback } from 'react';
import axios from 'axios';

export interface UpdateCustomerMemoryData {
  preferences?: string;
  objections?: string;
  buyingSignals?: string;
  confidence?: number;
}

export const useUpdateCustomerMemory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const backendUrl = import.meta.env.VITE_API_URL;
  const updateCustomerMemory = useCallback(async (customerId: string, data: UpdateCustomerMemoryData) => {
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(`${backendUrl}/customer-memory/${customerId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      return response.data;
    } catch (err: any) {
      console.error('Error updating customer memory:', err);
      setError('Failed to update customer memory');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateCustomerMemory, loading, error };
};
