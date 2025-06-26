import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // Asegurate de tener acceso al rol del usuario

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, token } = useAuth();

  const fetchPayments = async () => {
    if (!user || user.role !== "ADMIN") return;
    
    if (!token || !token.includes(".")) {
    console.error("Token inválido:", token);
    return;
  }

    setLoading(true);
    setError(null);
     try {
    const res = await axios.get("http://localhost:8080/payment/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPayments(res.data);
  } catch (err) {
    console.error("Error al cargar los pagos:", err);
    setError("Error al cargar los pagos");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPayments();
  }, [user]); // Se vuelve a ejecutar si cambia el usuario

  return (
    <PaymentContext.Provider value={{ payments, loading, error, fetchPayments }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => useContext(PaymentContext);

export default PaymentContext;
