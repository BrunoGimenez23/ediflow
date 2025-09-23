import React, { useState } from "react";
import QuoteForm from "./QuoteForm";

const OrderCard = ({ order, createQuoteFromRequest }) => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => setShowForm(prev => !prev);

  const status = order.status?.toString?.() ?? "UNKNOWN";

  // Mostrar botón solo si el estado es REQUESTED
  const canCreateQuote = status.toUpperCase() === "REQUESTED";

  const statusColors = {
    REQUESTED: "bg-yellow-100 text-yellow-800",
    QUOTED: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-green-500 text-white",
    PAID: "bg-teal-500 text-white",
    SCHEDULED: "bg-indigo-200 text-indigo-800",
    IN_PROGRESS: "bg-purple-200 text-purple-800",
    COMPLETED: "bg-gray-300 text-gray-800",
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 mb-4 hover:shadow-lg transition flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div className="flex-1 space-y-2">
        <p className="font-semibold text-lg">{order.title || order.description}</p>
        <p className="text-gray-600"><strong>Proveedor:</strong> {order.providerName || "—"}</p>
        <p className="text-gray-600">
          <strong>Estado:</strong>{" "}
          <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[status.toUpperCase()]}`}>
            {status}
          </span>
        </p>
      </div>

      {canCreateQuote && (
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <button
            onClick={toggleForm}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            {showForm ? "Cerrar Formulario" : "Crear Cotización"}
          </button>
        </div>
      )}

      {showForm && canCreateQuote && (
        <div className="mt-3 w-full md:mt-0 md:w-2/3">
          <QuoteForm order={order} createQuoteFromRequest={createQuoteFromRequest} />
        </div>
      )}
    </div>
  );
};

export default OrderCard;
