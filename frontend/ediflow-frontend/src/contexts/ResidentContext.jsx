import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"; // ajusta la ruta según tu estructura

export const ResidentContext = createContext();

export const ResidentProvider = ({ children }) => {
  const { user } = useAuth(); // para saber si hay usuario logueado
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResident = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/residents/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener datos del residente");

      const data = await res.json();
      setResident(data);
    } catch (err) {
      setError(err.message);
      setResident(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchResident();
    } else {
      
      setResident(null);
      setError(null);
      setLoading(false);
    }
  }, [user]);

  return (
    <ResidentContext.Provider
      value={{ resident, loading, error, fetchResident }}
    >
      {children}
    </ResidentContext.Provider>
  );
};

// Hook para usar el contexto más fácil
export const useResidentContext = () => useContext(ResidentContext);
