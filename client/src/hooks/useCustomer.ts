import { useEffect, useState } from 'react';
import axios from 'axios';

export interface Deal {
  id: string;
  title: string;
  amount?: number;
  stage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interaction {
  id: string;
  type: string;
  content: string;
  createdAt: string;
}

export interface CustomerMemory {
  preferences?: string;
  objections?: string;
  buyingSignals?: string;
  confidence?: number;
  updatedAt: string;
}

export interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  deals: Deal[];
  interactions: Interaction[];
  memory?: CustomerMemory;
}

export const useCustomer = (id: string) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomer(response.data);
    } catch (err: any) {
      setError('Failed to fetch customer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const refreshCustomer = () => {
    fetchCustomer();
  };

  return { customer, loading, error, refreshCustomer };
}; 