import React from "react";
import OrderList from "../../components/marketplace/OrderList";

const OrdersPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Órdenes</h1>

      {/* Listado de órdenes */}
      <section className="bg-white shadow rounded-lg p-4 md:p-6">
        <OrderList />
      </section>
    </div>
  );
};

export default OrdersPage;
