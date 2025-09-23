import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";
import QuoteForm from "../../components/marketplace/QuoteForm";
import QuoteCard from "../../components/marketplace/QuoteCard";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { orders, quotes, createQuoteFromRequest, loading, error } = useMarketplace();

  const [modalOrder, setModalOrder] = useState(null); // Para el modal

  // --- Estadísticas ---
  const pendientes = orders.filter(
    o => ["REQUESTED", "PENDING"].includes(o.status?.toUpperCase())
  ).length;

  const completadas = orders.filter(
    o => ["COMPLETED", "ACCEPTED"].includes(o.status?.toUpperCase())
  ).length;

  const cotizacionesEnviadas = quotes.filter(q => q.status?.toUpperCase() === "SENT").length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <p className="text-center p-10 text-gray-500">Cargando datos...</p>;
  if (error) return <p className="text-red-500 text-center p-10">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-ediblue">Dashboard de Proveedor</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition shadow"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Estadísticas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard label="Órdenes Pendientes" value={pendientes} color="yellow" />
        <StatCard label="Órdenes Completadas" value={completadas} color="green" />
        <StatCard label="Cotizaciones Enviadas" value={cotizacionesEnviadas} color="blue" />
      </section>

      {/* Órdenes Asignadas / Crear Cotización */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Órdenes Asignadas / Crear Cotización</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">No hay órdenes asignadas</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {orders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                openModal={() => setModalOrder(order)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Cotizaciones Enviadas como cards */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Cotizaciones Enviadas</h2>
        {quotes.filter(q => q.status?.toUpperCase() === "SENT").length === 0 ? (
          <p className="text-gray-500 text-center mt-2">No hay cotizaciones enviadas</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {quotes.filter(q => q.status?.toUpperCase() === "SENT").map(quote => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {modalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOrder(null)}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Crear Cotización</h3>
            <QuoteForm
              order={modalOrder} 
              createQuoteFromRequest={createQuoteFromRequest} 
              onSuccess={() => setModalOrder(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---
const StatCard = ({ label, value, color }) => {
  const colors = {
    yellow: "bg-yellow-200 text-yellow-800",
    green: "bg-green-200 text-green-800",
    blue: "bg-blue-200 text-blue-800",
  };
  return (
    <div className={`p-6 rounded-xl shadow flex flex-col items-center transition hover:shadow-lg ${colors[color]}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-3xl font-bold mt-2">{value}</span>
    </div>
  );
};

const OrderCard = ({ order, openModal }) => {
  const ocultarBoton = ["COMPLETED", "ACCEPTED"].includes(order.status?.toUpperCase());

  return (
    <div className="border p-5 rounded-xl shadow-md hover:shadow-lg transition bg-gray-50 flex flex-col justify-between">
      <div className="space-y-2">
        <p><strong>Edificio:</strong> {order.buildingName || order.buildingId}</p>
        <p><strong>Descripción:</strong> {order.description || "—"}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span className={`px-2 py-1 rounded ${colorEstado(order.status)}`}>
            {nombreEstado(order.status)}
          </span>
        </p>
      </div>

      {!ocultarBoton && (
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mt-4"
        >
          Crear Cotización
        </button>
      )}
    </div>
  );
};

const colorEstado = (estado) => {
  switch (estado?.toUpperCase()) {
    case "PENDING":
    case "REQUESTED": return "bg-yellow-200 text-yellow-800";
    case "COMPLETED":
    case "ACCEPTED": return "bg-green-500 text-white";
    case "REJECTED": return "bg-red-500 text-white";
    case "SENT": return "bg-blue-500 text-white";
    default: return "bg-gray-300 text-black";
  }
};

const nombreEstado = (estado) => {
  switch (estado?.toUpperCase()) {
    case "PENDING":
    case "REQUESTED": return "Pendiente";
    case "COMPLETED":
    case "ACCEPTED": return "Aceptada";
    case "REJECTED": return "Rechazada";
    case "SENT": return "Enviada";
    default: return estado;
  }
};

export default ProviderDashboard;
