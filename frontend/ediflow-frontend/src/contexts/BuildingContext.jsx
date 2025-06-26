import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"; // ajusta según tu estructura

const BuildingContext = createContext();

export const BuildingProvider = ({ children }) => {
  const { user } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBuildings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado");
      setBuildings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/buildings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        throw new Error("Acceso denegado: no tienes permisos para ver los edificios");
      }

      if (!res.ok) {
        throw new Error("Error al cargar los edificios");
      }

      const data = await res.json();
      setBuildings(data);
    } catch (err) {
      setError(err.message);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Solo fetch si usuario existe y es ADMIN
    if (user?.role === "ADMIN") {
      fetchBuildings();
    } else {
      // Si no es admin, limpiamos estado y error
      setBuildings([]);
      setError(null);
      setLoading(false);
    }
  }, [user]);

  return (
    <BuildingContext.Provider value={{ buildings, loading, error, fetchBuildings }}>
      {children}
    </BuildingContext.Provider>
  );
};

export const useBuildingsContext = () => useContext(BuildingContext);

export default BuildingProvider;
