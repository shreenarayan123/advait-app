import { useState } from "react";
import axios from "axios";

interface CreateCustomerData {
  name: string;
  company: string;
  email: string;
  phone?: string;
}

export const useCreateCustomer = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = async (data: CreateCustomerData) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setIsLoading(false);
      throw new Error("Not authenticated");
    }

    try {
      const response = await axios.post(`${apiUrl}/customers`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        axios.isAxiosError(err) && err.response
          ? err.response.data.message
          : "Failed to create customer";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  return { createCustomer, isLoading, error };
};
