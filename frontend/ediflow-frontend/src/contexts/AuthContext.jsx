import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [trialExpired, setTrialExpired] = useState(false);
  const [ready, setReady] = useState(false);

  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      setTrialExpired(false);
      setReady(true);
      return;
    }

    try {
      console.log("Token enviado en fetchUser:", token);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newUser = {
        ...res.data,
        plan: res.data.plan || null,
      };

      // Normaliza los datos para comparar
      const normalizeUser = (userData) => ({
        ...userData,
        trialDaysLeft: undefined, // Ignora trialDaysLeft para evitar cambios dinámicos
        // Agrega otros campos dinámicos que deban ignorarse
      });

      setUser((prevUser) => {
        const normalizedPrev = prevUser ? normalizeUser(prevUser) : null;
        const normalizedNew = normalizeUser(newUser);
        if (JSON.stringify(normalizedPrev) !== JSON.stringify(normalizedNew)) {
          console.log("Actualizando user:", newUser);
          return newUser;
        }
        console.log("No se actualiza user, datos idénticos");
        return prevUser;
      });

      setTrialExpired(res.data.trialDaysLeft !== null && res.data.trialDaysLeft <= 0);
    } catch (err) {
      console.error("No se pudo obtener el usuario logueado", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const logout = () => {
    console.log("Logout llamado, borrando token");
    setUser(null);
    setToken("");
    setTrialExpired(false);
    setReady(false);
    localStorage.removeItem("token");
  };

  const memoizedUser = useMemo(() => user, [user]);

  return (
    <AuthContext.Provider
      value={{ user: memoizedUser, token, setUser, setToken, fetchUser, trialExpired, logout, ready }}
    >
      {ready ? children : <div className="text-center p-10">Cargando usuario...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);