import React, { useEffect, useState } from "react";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";
import axios from "axios";

const MpConnectButton = () => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Traemos info del proveedor actual
    const fetchProvider = async () => {
      try {
        const { data } = await axios.get("/marketplace/providers/me"); // endpoint para traer provider logueado
        setProvider(data);
      } catch (e) {
        console.error("Error fetching provider info", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, []);

  const handleConnect = async () => {
    try {
      const { data } = await axios.get("/marketplace/providers/oauth-url");
      window.location.href = data; // redirige a Mercado Pago
    } catch (e) {
      console.error("Error obteniendo URL OAuth", e);
    }
  };

  if (loading) return <p>Cargando información de proveedor...</p>;

  return (
    <div className="mb-6 flex items-center gap-4">
      <button
        onClick={handleConnect}
        className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition shadow"
        disabled={provider?.verified}
      >
        {provider?.verified ? "Conectado con Mercado Pago" : "Conectar con Mercado Pago"}
      </button>
      {provider?.verified && (
        <span className="text-green-600 font-medium">Cuenta verificada ✅</span>
      )}
      {!provider?.verified && (
        <span className="text-red-500 font-medium">No conectado ❌</span>
      )}
    </div>
  );
};

export default MpConnectButton;
