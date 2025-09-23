import React, { useState } from "react";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";

const AdminQuoteCard = ({ quote }) => {
  const { acceptQuote, rejectQuote } = useMarketplace();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptQuote(quote.id);
    } catch (err) {
      console.error("Error aceptando cotización:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await rejectQuote(quote.id);
    } catch (err) {
      console.error("Error rechazando cotización:", err);
    } finally {
      setLoading(false);
    }
  };

  const colorEstado = (status) => {
    switch (status) {
      case "PENDING":
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-800";
      case "SENT":
        return "bg-blue-100 text-blue-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const nombreEstado = (status) => {
    switch (status) {
      case "PENDING":
      case "REQUESTED":
        return "Pendiente";
      case "SENT":
        return "Enviada";
      case "ACCEPTED":
        return "Aceptada";
      case "REJECTED":
        return "Rechazada";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 mb-4 flex flex-col justify-between">
      {/* Información principal */}
      <div className="space-y-2 mb-4">
        <p><strong>Edificio:</strong> {quote.buildingName || "—"}</p>
        <p><strong>Proveedor:</strong> {quote.providerName || "—"}</p>
        <p><strong>Monto:</strong> {quote.amount ?? "No informado"}</p>
        <p><strong>Mensaje:</strong> {quote.message || "No informado"}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span className={`px-3 py-1 rounded-full font-medium text-sm ${colorEstado(quote.status)}`}>
            {nombreEstado(quote.status)}
          </span>
        </p>
      </div>

      {/* Botones solo si la cotización está ENVIADA */}
      {quote.status === "SENT" && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
          >
            Aceptar
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow hover:from-red-600 hover:to-red-700 transition"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminQuoteCard;
