import React from "react";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";
import OrderCard from "./OrderCard";

const OrderList = () => {
  const { orders, createQuoteFromRequest } = useMarketplace();

  if (!orders || orders.length === 0)
    return <p className="text-gray-500 text-center mt-6">No hay órdenes disponibles</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order} // 🔹 pasamos la orden original, OrderCard obtendrá la versión actualizada
          createQuoteFromRequest={createQuoteFromRequest}
        />
      ))}
    </div>
  );
};

export default OrderList;
