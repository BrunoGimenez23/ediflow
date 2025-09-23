import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";
import QuoteCard from "../../components/marketplace/QuoteCard";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { orders, quotes, createQuoteFromRequest, loading, error } = useMarketplace();

  console.log("Quotes recibidas:", quotes);

  // Estadísticas
  const pendientes = orders.filter(
    o =>
      o.status?.toUpperCase() === "REQUESTED" ||
      o.status?.toUpperCase() === "PENDING"
  ).length;
  const completadas = orders.filter(o => o.status?.toUpperCase() === "COMPLETED").length;
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-ediblue mb-4 md:mb-0">Dashboard de Proveedor</h1>
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

      {/* Órdenes Asignadas */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Órdenes Asignadas / Crear Cotización</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No hay órdenes asignadas</p>
        ) : (
          <div className="space-y-4 mt-4">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} createQuoteFromRequest={createQuoteFromRequest} />
            ))}
          </div>
        )}
      </section>

      {/* Cotizaciones Enviadas */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Cotizaciones Enviadas</h2>
        {quotes.filter(q => q.status?.toUpperCase() === "SENT").length === 0 ? (
          <p className="text-gray-500 mt-2">No hay cotizaciones enviadas</p>
        ) : (
          <div className="space-y-2 mt-2">
            {quotes.filter(q => q.status?.toUpperCase() === "SENT").map(q => (
              <QuoteCard key={q.id} quote={q} />
            ))}
          </div>
        )}
      </section>
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
    <div className={`p-4 rounded-lg shadow flex flex-col items-center ${colors[color]}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-3xl font-bold mt-2">{value}</span>
    </div>
  );
};

const OrderCard = ({ order, createQuoteFromRequest }) => {
  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => setShowForm(prev => !prev);

  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <p><strong>Edificio:</strong> {order.buildingName || order.buildingId}</p>
          <p><strong>Descripción:</strong> {order.description || "—"}</p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={`px-2 py-1 rounded ${colorEstado(order.status)}`}>
              {nombreEstado(order.status)}
            </span>
          </p>
        </div>
        <button 
          onClick={toggleForm} 
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
        >
          {showForm ? "Cerrar Formulario" : "Crear Cotización"}
        </button>
      </div>
      {showForm && <QuoteForm order={order} createQuoteFromRequest={createQuoteFromRequest} />}
    </div>
  );
};

const QuoteForm = ({ order, createQuoteFromRequest }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount) return alert("Ingresá un monto");
    setLoading(true);
    try {
      await createQuoteFromRequest({ orderId: order.id, amount, message });
      setAmount("");
      setMessage("");
      alert("Cotización creada correctamente");
    } catch (err) {
      console.error(err);
      alert("Error creando la cotización");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 p-4 border rounded-lg bg-white shadow-inner space-y-2">
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        placeholder="Mensaje opcional"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full transition"
      >
        {loading ? "Enviando..." : "Crear Cotización"}
      </button>
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
