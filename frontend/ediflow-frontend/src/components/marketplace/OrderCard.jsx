import React, { useState } from "react";
import { ORDER_STATUS_MAP } from "../../constants/marketplace";
import QuoteForm from "./QuoteForm"; // asumimos que tienes QuoteForm separado

const OrderCard = ({ order, createQuoteFromRequest }) => {
  const [showForm, setShowForm] = useState(false);
  const statusLabel = ORDER_STATUS_MAP[order.status] || "Desconocido";

  const toggleForm = () => setShowForm(!showForm);

  // Validación antes de abrir el formulario
  if (!order?.id) {
    console.warn("OrderCard: order.id no definido", order);
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">{order.title || order.description}</h4>
        <span
          className={`px-2 py-1 rounded text-sm ${
            order.status === "COMPLETED" || order.status === "ACCEPTED"
              ? "bg-green-500 text-white"
              : order.status === "REJECTED"
              ? "bg-red-500 text-white"
              : "bg-yellow-200 text-black"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <p className="text-sm text-gray-600">Proveedor: {order.providerName || "—"}</p>

      <button
        onClick={toggleForm}
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
      >
        {showForm ? "Cerrar Formulario" : "Crear Cotización"}
      </button>

      {showForm && order?.id ? (
        <div className="mt-3">
          <QuoteForm
            order={order}
            createQuoteFromRequest={createQuoteFromRequest}
          />
        </div>
      ) : showForm && !order?.id ? (
        <p className="mt-3 text-red-500 font-semibold">
          Error: no se puede crear cotización, orderId no definido.
        </p>
      ) : null}
    </div>
  );
};

export default OrderCard;
