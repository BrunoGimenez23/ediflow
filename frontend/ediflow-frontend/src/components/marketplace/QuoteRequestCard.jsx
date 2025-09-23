import React, { useState } from "react";

const QuoteRequestCard = ({ request, createQuoteFromRequest }) => {
  const [openModal, setOpenModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount) return alert("Ingresá un monto");
    setLoading(true);
    try {
      await createQuoteFromRequest({ orderId: request.orderId, amount, message });
      setAmount("");
      setMessage("");
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      alert("Error creando la cotización");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded mb-4 shadow-sm">
      <p><strong>Edificio:</strong> {request.buildingName || request.buildingId}</p>
      <p><strong>Categoría:</strong> {request.category || "—"}</p>
      <p><strong>Mensaje:</strong> {request.message || "—"}</p>

      <button
        onClick={() => setOpenModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Crear Cotización
      </button>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Crear Cotización</h3>
            <input
              type="number"
              placeholder="Monto"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded p-2 w-full mb-2"
            />
            <textarea
              placeholder="Mensaje opcional"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded p-2 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteRequestCard;
