import React, { useState } from "react";
import QuoteForm from "./QuoteForm";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";
import dayjs from "dayjs";

const OrderCard = ({ order: initialOrder, createQuoteFromRequest }) => {
  const [showForm, setShowForm] = useState(false);
  const [paying, setPaying] = useState(false);
  const { handlePayOrder, updateOrder, orders } = useMarketplace();

  // 🔹 siempre obtener la versión actualizada de la orden
  const order = orders.find(o => o?.id === initialOrder.id) || initialOrder;

  const toggleForm = () => setShowForm(prev => !prev);

  const status = order.status?.toString?.() ?? "UNKNOWN";
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

  // 🔹 determinar si la orden ya está pagada
  const isPaid = order.paid === true || status.toUpperCase() === "PAID";

  const handlePay = async () => {
    setPaying(true);
    try {
      await handlePayOrder(order.id);
    } catch (err) {
      console.error("Error al iniciar el pago:", err);
      alert("Error al iniciar el pago: " + (err.message || "Intenta nuevamente."));
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 mb-4 hover:shadow-lg transition flex flex-col md:flex-row justify-between md:items-center gap-4">
      
      {/* Información principal */}
      <div className="flex-1 space-y-2">
        <p className="font-semibold text-lg">{order.title || order.description}</p>
        <p className="text-gray-600"><strong>Proveedor:</strong> {order.providerName || "—"}</p>
        <p className="text-gray-600"><strong>Edificio:</strong> {order.buildingName || "—"}</p>
        <p className="text-gray-600"><strong>Monto:</strong> {order.totalAmount != null ? `$${order.totalAmount}` : "—"}</p>
        <p className="text-gray-600">
          <strong>Creada:</strong> {order.createdAt ? dayjs(order.createdAt).format("DD/MM/YYYY") : "—"}
        </p>
        {order.preferredDate && (
          <p className="text-gray-600">
            <strong>Fecha preferida:</strong> {dayjs(order.preferredDate).format("DD/MM/YYYY")}
          </p>
        )}
      </div>

      {/* Estado y acciones */}
      <div className="flex flex-col gap-2 md:items-end">
        <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[status.toUpperCase()]}`}>
          {status}
        </span>

        {isPaid && (
          <span className="px-2 py-1 rounded text-sm font-medium bg-teal-500 text-white">
            Pagado ✅
          </span>
        )}

        {canCreateQuote && (
          <button
            onClick={toggleForm}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            {showForm ? "Cerrar Formulario" : "Crear Cotización"}
          </button>
        )}

        {/* Botón Pagar solo si la orden está ACCEPTED y no pagada */}
        {status.toUpperCase() === "ACCEPTED" && !isPaid && (
          <button
            onClick={handlePay}
            disabled={paying}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paying ? "Procesando..." : "Pagar"}
          </button>
        )}
      </div>

      {showForm && canCreateQuote && (
        <div className="mt-3 w-full md:mt-0 md:w-2/3">
          <QuoteForm order={order} createQuoteFromRequest={createQuoteFromRequest} />
        </div>
      )}
    </div>
  );
};

export default OrderCard;
