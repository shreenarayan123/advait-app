import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


interface User {  
    email: string;
  password: string;
}
const backendUrl = import.meta.env.VITE_API_URL;
export const useUser = () => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const navigate = useNavigate();

  const createUser = async (values: User) => {
    try {
      const response = await fetch(`${backendUrl}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUser(data);
      navigate('/home', { replace: true });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    }
  };

  return { user, createUser };
}