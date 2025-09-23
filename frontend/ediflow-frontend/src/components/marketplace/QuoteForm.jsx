import React, { useState } from "react";

const QuoteForm = ({ order, createQuoteFromRequest }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return alert("Ingresá un monto");

    setLoading(true);
    try {
      // Pasamos el orderId correctamente
      await createQuoteFromRequest({ orderId: order.id, amount, message });
      alert("Cotización enviada correctamente");
      setAmount("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Error creando la cotización");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200"
    >
      <h5 className="text-md font-semibold mb-2">Crear Cotización</h5>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Monto</label>
        <input
          type="number"
          placeholder="Monto de la cotización"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Mensaje (opcional)</label>
        <textarea
          placeholder="Mensaje adicional"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md text-white font-semibold transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Enviando..." : "Enviar Cotización"}
      </button>
    </form>
  );
};

export default QuoteForm;
