import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

const BuildingContext = createContext();

export const BuildingProvider = ({ children }) => {
  const { user, ready } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null); // ✅ agregado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBuildings = useCallback(async () => {
    if (!user || !ready) return;

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/buildings/by-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        const text = await res.text();
        throw new Error("Acceso denegado: no tienes permisos para ver los edificios");
      }
      if (!res.ok) {
        throw new Error("Error al cargar los edificios");
      }

      const data = await res.json();
      setBuildings(data);

      // Seleccionar automáticamente el primero si no hay selectedBuilding
      if (!selectedBuilding && data.length > 0) {
        setSelectedBuilding(data[0]);
      }
    } catch (err) {
      setError(err.message);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  }, [user, ready, selectedBuilding]);

  useEffect(() => {
    const allowedRoles = ["ADMIN", "EMPLOYEE"];
    const token = localStorage.getItem("token");

    if (user && ready && token && allowedRoles.includes(user.role) && user.adminId) {
      fetchBuildings();
    } else {
      if (buildings.length > 0 || error !== null || loading !== false) {
        setBuildings([]);
        setError(null);
        setLoading(false);
      }
    }
  }, [user, ready, fetchBuildings]);

  return (
    <BuildingContext.Provider
      value={{ buildings, selectedBuilding, setSelectedBuilding, loading, error, fetchBuildings }}
    >
      {children}
    </BuildingContext.Provider>
  );
};

export const useBuildingsContext = () => useContext(BuildingContext);

export default BuildingProvider;
