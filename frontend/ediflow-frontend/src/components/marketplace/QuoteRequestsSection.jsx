import React from "react";
import { useMarketplace } from "../../contexts/MarketplaceContext";

const QuoteRequestsSection = () => {
  const { quoteRequests, createQuoteFromRequest, loading } = useMarketplace();

  if (loading) return <p className="text-center p-4 text-gray-500">Cargando solicitudes...</p>;

  if (!quoteRequests || quoteRequests.length === 0) {
    return <p className="text-gray-500 p-4">No hay solicitudes pendientes</p>;
  }

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Solicitudes de Cotización</h2>
      <div className="space-y-4">
        {quoteRequests.map((req) => (
          <QuoteRequestCard key={req.id} request={req} createQuoteFromRequest={createQuoteFromRequest} />
        ))}
      </div>
    </section>
  );
};

const QuoteRequestCard = ({ request, createQuoteFromRequest }) => {
  const [amount, setAmount] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!amount) return alert("Ingresá un monto");
    setLoading(true);
    try {
      await createQuoteFromRequest({ orderId: request.id, amount, message });
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
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition bg-gray-50">
      <p><strong>Edificio:</strong> {request.buildingName || request.buildingId}</p>
      <p><strong>Descripción:</strong> {request.description}</p>
      <p><strong>Estado:</strong> <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Pendiente</span></p>

      <div className="mt-3 space-y-2">
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
    </div>
  );
};

export default QuoteRequestsSection;
