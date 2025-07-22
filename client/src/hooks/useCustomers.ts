import { useEffect, useState } from 'react';
import axios from 'axios';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
}

export const useCustomers = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(response.data);
      } catch (err: any) {
        setError('Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return { customers, loading, error };
}; 