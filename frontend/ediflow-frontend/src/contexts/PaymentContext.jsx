import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  // Estado con info paginada
  const [paymentsPage, setPaymentsPage] = useState({
    content: [],
    totalPages: 1,
    number: 0, // página actual (0-index)
    totalElements: 0,
    size: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, token } = useAuth();

  
  const fetchPayments = useCallback(
  async (page = 0, size = 10, filters = {}) => {
    if (size <= 0) {
      size = 10; // tamaño mínimo seguro
    }
    if (!user || user.role !== "ADMIN") return;
    if (!token || !token.includes(".")) {
      console.error("Token inválido:", token);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/payment/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          size,
          ...filters,
        },
      });
      console.log("Datos pagos recibidos:", res.data);

      setPaymentsPage(res.data);
    } catch (err) {
      console.error("Error al cargar los pagos:", err);
      setError("Error al cargar los pagos");
    } finally {
      setLoading(false);
    }
  },
  [user, token]
);


  
  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchPayments(0);
    }
  }, [user, fetchPayments]);

  return (
    <PaymentContext.Provider value={{ paymentsPage, loading, error, fetchPayments }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => useContext(PaymentContext);

export default PaymentContext;
