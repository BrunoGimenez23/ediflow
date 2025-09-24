import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API = import.meta.env.VITE_API_URL + "/marketplace";

export const useMarketplaceService = () => {
  const { token } = useAuth(); // obtenemos el token del AuthContext

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // === Providers ===
  const getProviders = async () => {
    const res = await axios.get(`${API}/providers`, authHeaders());
    return res.data;
  };

  // === Orders ===
  const createOrder = async (data) => {
    const res = await axios.post(`${API}/orders`, data, authHeaders());
    return res.data;
  };

  const getOrders = async () => {
    const res = await axios.get(`${API}/orders`, authHeaders());
    return res.data;
  };

  const getOrdersByProvider = async (providerId) => {
    const res = await axios.get(`${API}/orders/provider/${providerId}`, authHeaders());
    return res.data;
  };

  const getOrdersByLoggedProvider = async () => {
    const res = await axios.get(`${API}/orders/my`, authHeaders());
    return res.data;
  };

  // === Quotes ===
  const requestQuote = async ({ providerId, buildingId, message }) => {
    if (!buildingId) {
      throw new Error("Debes seleccionar un edificio antes de solicitar la cotización");
    }

    const res = await axios.post(
      `${API}/quotes/request`,
      { providerId, buildingId, message },
      authHeaders()
    );
    return res.data;
  };

  
  // 🔹 CORRECCIÓN: recibir orderId en lugar de requestId
  const createQuote = async ({ orderId, amount, message }) => {
    if (!orderId) throw new Error("Debe proporcionar un orderId válido");

    const res = await axios.post(
      `${API}/quotes`,
      { orderId, amount, message }, // ahora se envía orderId
      authHeaders()
    );
    return res.data;
  };

  const acceptQuote = async (quoteId) => {
    const res = await axios.put(`${API}/quotes/${quoteId}/accept`, {}, authHeaders());
    return res.data;
  };

  const rejectQuote = async (quoteId) => {
    const res = await axios.put(`${API}/quotes/${quoteId}/reject`, {}, authHeaders());
    return res.data;
  };

  const getQuotes = async () => {
    const res = await axios.get(`${API}/quotes`, authHeaders());
    return res.data;
  };

  const getQuotesByProvider = async (providerId) => {
    const res = await axios.get(`${API}/quotes/provider/${providerId}`, authHeaders());
    return res.data;
  };

  const getQuotesByAdmin = async () => {
  const res = await axios.get(`${API}/quotes/admin`, authHeaders());
  return res.data;
};

  const getQuotesByLoggedProvider = async () => {
    const res = await axios.get(`${API}/quotes/my`, authHeaders());
    return res.data;
  };

  // === Solicitudes de Cotización para el proveedor logueado ===
  const getQuoteRequestsByProvider = async () => {
    const res = await axios.get(`${API}/quotes/requests`, authHeaders());
    return res.data;
  };

  // === Pagos MercadoPago ===
const createCheckout = async (orderId) => {
  const res = await axios.post(`${API}/payment/checkout/${orderId}`, {}, authHeaders());

  // 🔹 Si el backend devuelve un objeto { init_point: "..." }
  if (res.data.init_point) return res.data.init_point;

  // 🔹 Si el backend devuelve directamente la URL como string
  return typeof res.data === "string" ? res.data : res.data.init_point;
};

// 🔹 Obtener una orden específica
const getOrder = async (orderId) => {
  const res = await axios.get(`${API}/orders/${orderId}`, authHeaders());
  return res.data;
};

  return {
    getProviders,
    createOrder,
    getOrders,
    getOrdersByProvider,
    getOrdersByLoggedProvider,
    requestQuote,
    createQuote,
    acceptQuote,
    rejectQuote,
    getQuotes,
    getQuotesByProvider,
    getQuotesByLoggedProvider,
    getQuotesByAdmin,
    getQuoteRequestsByProvider,
    createCheckout,
    getOrder
  };
};
