import { useState } from 'react';
import axios from 'axios';

export interface AddNoteData {
  type: string; 
  content: string;
  customerId: string;
}

export const useAddNote = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNote = async (data: AddNoteData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/interactions`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      setError('Failed to add note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addNote, loading, error };
}; 