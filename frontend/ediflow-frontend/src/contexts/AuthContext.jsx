import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [trialExpired, setTrialExpired] = useState(false);
  const [ready, setReady] = useState(false); // Flag para controlar carga completa

  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      setTrialExpired(false);
      setReady(true);
      return;
    }

    try {
      console.log("Token enviado en fetchUser:", token);
      const res = await axios.get("http://localhost:8080/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newUser = {
        ...res.data,
        plan: res.data.plan || null,
      };

      setTrialExpired(res.data.trialDaysLeft !== null && res.data.trialDaysLeft <= 0);

      // ✅ Actualiza siempre que llega nueva info, incluso si solo cambió trialDaysLeft
      setUser(newUser);
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

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, fetchUser, trialExpired, logout, ready }}
    >
      {ready ? children : <div className="text-center p-10">Cargando usuario...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
