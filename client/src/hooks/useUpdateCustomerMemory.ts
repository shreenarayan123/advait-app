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

  const updateCustomerMemory = useCallback(async (customerId: string, data: UpdateCustomerMemoryData) => {
    console.log('Updating customer memory for customer:', customerId);
    console.log('Data being sent:', data);
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      const response = await axios.put(`http://localhost:3000/api/v1/customer-memory/${customerId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Customer memory update response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('Error updating customer memory:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to update customer memory');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateCustomerMemory, loading, error };
};
