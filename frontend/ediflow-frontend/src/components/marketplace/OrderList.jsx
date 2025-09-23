// components/marketplace/OrderList.jsx
import React from "react";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";

const OrderList = () => {
  const { orders, quotes } = useMarketplace();

  if (!orders || orders.length === 0)
    return <p className="text-gray-500 text-center mt-6">No hay órdenes disponibles</p>;

  // Colores por estado
  const statusColors = {
    SENT: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    UNKNOWN: "bg-gray-100 text-gray-800",
    PENDING: "bg-gray-100 text-gray-800",
  };

  // Traducción de estados
  const statusLabels = {
    SENT: "Enviada",
    ACCEPTED: "Aceptada",
    REJECTED: "Rechazada",
    UNKNOWN: "Desconocido",
    PENDING: "Pendiente",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => {
        const relatedQuote = quotes.find((q) => q.orderId === order.id);
        const statusKey = relatedQuote?.status ?? "PENDING";
        const statusClass = statusColors[statusKey];
        const statusLabel = statusLabels[statusKey] || "Desconocido";

        return (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col justify-between"
          >
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">ID de Orden:</span> {order.id}</p>
              <p><span className="font-semibold">Edificio:</span> {order.buildingName || "—"}</p>
              <p><span className="font-semibold">Descripción:</span> {order.orderDescription || "—"}</p>
              <p><span className="font-semibold">Proveedor:</span> {relatedQuote?.providerName || "—"}</p>
              <p><span className="font-semibold">Monto:</span> {relatedQuote?.amount != null ? `$${relatedQuote.amount}` : "—"}</p>
            </div>

            <div className="mt-4">
              <span
                className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${statusClass}`}
              >
                {statusLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
