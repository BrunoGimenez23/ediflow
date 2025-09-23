import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useMarketplaceService } from "../../services/marketplaceService";
import { useAuth } from "../../contexts/AuthContext";
import { useBuildingsContext } from "../../contexts/BuildingContext";

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const { user } = useAuth();
  const marketplaceService = useMarketplaceService();
  const { selectedBuilding } = useBuildingsContext();

  const [providers, setProviders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProviders = useCallback(async () => {
    if (!user || user.role !== "ADMIN") return setProviders([]);
    try {
      const data = await marketplaceService.getProviders();
      setProviders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProviders([]);
    }
  }, [user, marketplaceService]);

  const fetchOrders = useCallback(async () => {
    if (!user) return setOrders([]);
    try {
      const data = user.role === "ADMIN"
        ? await marketplaceService.getOrders()
        : await marketplaceService.getOrdersByLoggedProvider();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  }, [user, marketplaceService]);

  const fetchQuotes = useCallback(async () => {
  if (!user) return setQuotes([]);
  try {
    const data = user.role === "ADMIN"
  ? await marketplaceService.getQuotesByAdmin()
  : await marketplaceService.getQuotesByLoggedProvider();

    // 🔹 Normalizar status y asegurar campos mínimos
    const normalized = Array.isArray(data) ? data.map(q => ({
      ...q,
      status: q.status?.toUpperCase() || "UNKNOWN",
      amount: q.amount ?? q.total ?? 0,
      message: q.message || "—",
    })) : [];

    console.log("💡 Quotes recibidas:", normalized);

    setQuotes(normalized);
  } catch (err) {
    console.error(err);
    setQuotes([]);
  }
}, [user, marketplaceService]);

  const fetchQuoteRequests = useCallback(async () => {
    if (!user || user.role !== "PROVIDER") return setQuoteRequests([]);
    try {
      const data = await marketplaceService.getQuoteRequestsByProvider();
      setQuoteRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setQuoteRequests([]);
    }
  }, [user, marketplaceService]);

  const requestQuote = async ({ providerId, message }) => {
    if (!selectedBuilding?.id) throw new Error("Debes seleccionar un edificio");
    try {
      await marketplaceService.requestQuote({ providerId, buildingId: selectedBuilding.id, message });
      await fetchQuoteRequests();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // 🔹 Corrección: Propagar el error al componente
  const createQuoteFromRequest = async ({ orderId, amount, message }) => {
  try {
    const newQuote = await marketplaceService.createQuote({ orderId, amount, message });

    const normalized = {
      ...newQuote,
      status: newQuote.status?.toUpperCase() || "UNKNOWN",
      amount: newQuote.amount ?? newQuote.total ?? 0,
      message: newQuote.message || "—",
    };

    setQuotes(prev => [normalized, ...prev]);
    setQuoteRequests(prev => prev.filter(q => q.id !== newQuote.requestId));
  } catch (err) {
    console.error(err);
    throw new Error("No se pudo crear la cotización");
  }
};

  const acceptQuote = async (quoteId) => {
  try {
    const updatedQuote = await marketplaceService.acceptQuote(quoteId); // <- sin {}
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) return { ...q, status: "ACCEPTED" };
      if (q.orderId === updatedQuote.orderId) return { ...q, status: "REJECTED" };
      return q;
    }));
  } catch (err) {
    console.error(err);
    setError("No se pudo aceptar la cotización");
  }
};

const rejectQuote = async (quoteId) => {
  try {
    const updatedQuote = await marketplaceService.rejectQuote(quoteId); // <- sin {}
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: "REJECTED" } : q));
  } catch (err) {
    console.error(err);
    setError("No se pudo rechazar la cotización");
  }
};

  

  useEffect(() => {
    if (!user) return setLoading(false);
    let isMounted = true;
    setLoading(true);
    const loadAll = async () => {
      try {
        if (user.role === "ADMIN") {
          await Promise.all([fetchProviders(), fetchOrders(), fetchQuotes()]);
        } else if (user.role === "PROVIDER") {
          await Promise.all([fetchOrders(), fetchQuotes(), fetchQuoteRequests()]);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Error cargando los datos del marketplace.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadAll();
    return () => { isMounted = false; };
  }, [user?.role]);

  return (
    <MarketplaceContext.Provider value={{
      providers,
      orders,
      quotes,
      quoteRequests,
      fetchProviders,
      fetchOrders,
      fetchQuotes,
      fetchQuoteRequests,
      requestQuote,
      createQuoteFromRequest,
      acceptQuote,
      rejectQuote,
      loading,
      error
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => useContext(MarketplaceContext);
