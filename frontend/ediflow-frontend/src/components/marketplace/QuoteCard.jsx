import React from "react";

const QuoteCard = ({ quote }) => {
  const colorEstado = (estado) => {
    switch (estado?.toUpperCase()) {
      case "PENDING":
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "SENT":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const nombreEstado = (estado) => {
    switch (estado?.toUpperCase()) {
      case "PENDING":
      case "REQUESTED":
        return "Pendiente";
      case "COMPLETED":
      case "ACCEPTED":
        return "Aceptada";
      case "REJECTED":
        return "Rechazada";
      case "SENT":
        return "Enviada";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition duration-300 flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
      
      {/* Izquierda: info principal */}
      <div className="space-y-1">
        <p className="text-gray-500 text-sm"><strong>Orden ID:</strong> {quote.orderId}</p>
        <p className="text-gray-500 text-sm"><strong>Edificio:</strong> {quote.buildingName || "No informado"}</p>
        <p className="text-gray-700 text-sm"><strong>Mensaje:</strong> {quote.message || "—"}</p>
        <p className="text-gray-500 text-sm"><strong>Proveedor:</strong> {quote.providerName || "—"}</p>
      </div>

      {/* Derecha: monto y estado */}
      <div className="space-y-1 text-right md:text-left md:flex md:flex-col md:items-end">
        <p className="text-gray-700 text-sm"><strong>Monto:</strong> {quote.amount ?? "No informado"}</p>
        <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${colorEstado(quote.status)}`}>
          {nombreEstado(quote.status)}
        </span>
      </div>
    </div>
  );
};

export default QuoteCard;
