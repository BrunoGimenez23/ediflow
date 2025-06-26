import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // ruta según tu proyecto

export const ApartmentContext = createContext();

export const ApartmentProvider = ({ children }) => {
  const { user } = useAuth();  // obtenemos user para saber el rol
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApartments = async () => {
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem('token');
    console.log("Token JWT enviado:", token);

    const url =
      user?.role === 'RESIDENT'
        ? `${import.meta.env.VITE_API_URL}/apartment/me`
        : `${import.meta.env.VITE_API_URL}/apartment/all`;

    console.log("URL fetch:", url);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", res.status);

    if (!res.ok) throw new Error('Error al obtener apartamentos');
    const data = await res.json();
    setApartments(user?.role === 'RESIDENT' ? [data] : data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (user) fetchApartments();
  }, [user]);

  return (
    <ApartmentContext.Provider value={{ setApartments, apartments, loading, error, fetchApartments }}>
      {children}
    </ApartmentContext.Provider>
  );
};

export const useApartmentContext = () => useContext(ApartmentContext);
