import React from "react";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";

const QuoteList = ({ quotes }) => {
  const { acceptQuote, rejectQuote } = useMarketplace();

  if (!quotes || quotes.length === 0)
    return <p className="text-gray-500 text-center mt-6">No hay cotizaciones</p>;

  const statusColor = (status) => {
    switch (status) {
      case "SENT": return "bg-blue-100 text-blue-800";
      case "ACCEPTED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const statusText = (status) => {
    switch (status) {
      case "SENT": return "Enviada";
      case "ACCEPTED": return "Aceptada";
      case "REJECTED": return "Rechazada";
      default: return "Pendiente";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {quotes.map((q) => (
        <div
          key={q.id}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col justify-between"
        >
          <div className="space-y-2">
            {q.buildingName && <p className="text-gray-700"><strong>Edificio:</strong> {q.buildingName}</p>}
            {q.providerName && <p className="text-gray-700"><strong>Proveedor:</strong> {q.providerName}</p>}
            {q.adminName && <p className="text-gray-700"><strong>Solicitud de:</strong> {q.adminName}</p>}
            <p className="text-gray-700"><strong>Mensaje:</strong> {q.message || "—"}</p>
            {q.amount !== undefined && <p className="text-gray-700"><strong>Monto:</strong> ${q.amount}</p>}
            <span className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${statusColor(q.status)}`}>
              {statusText(q.status)}
            </span>
          </div>

          {q.status === "SENT" && (
            <div className="mt-4 flex gap-3 flex-wrap">
              <button
                onClick={() => acceptQuote(q.id)}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
              >
                Aceptar
              </button>
              <button
                onClick={() => rejectQuote(q.id)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow hover:from-red-600 hover:to-red-700 transition"
              >
                Rechazar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuoteList;
