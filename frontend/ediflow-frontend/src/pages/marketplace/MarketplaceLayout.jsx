import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";
import { useBuildingsContext } from "../../contexts/BuildingContext.jsx";

// Selector de edificios
const BuildingSelector = ({ selectedBuildingId, setSelectedBuildingId }) => {
  const { buildings } = useBuildingsContext();

  if (!buildings.length) return null;

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2 text-gray-700">
        Seleccioná un edificio:
      </label>
      <select
        value={selectedBuildingId || ""}
        onChange={(e) => setSelectedBuildingId(Number(e.target.value))}
        className="border border-gray-300 rounded-lg p-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-edicyan transition"
      >
        <option value="">-- Seleccioná --</option>
        {buildings.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name} — {b.address}
          </option>
        ))}
      </select>
    </div>
  );
};

const MarketplaceLayout = () => {
  const { requestQuote } = useMarketplace();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  const handleOpenQuoteModal = (providerId) => {
    setSelectedProviderId(providerId);
    setMessage("");
    setSelectedBuildingId(null);
    setQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setSelectedProviderId(null);
    setMessage("");
    setSelectedBuildingId(null);
    setQuoteModalOpen(false);
  };

  const handleSendQuoteRequest = async () => {
    if (!selectedProviderId || !selectedBuildingId) {
      alert("Seleccioná un edificio antes de enviar la solicitud");
      return;
    }

    try {
      await requestQuote({
        providerId: selectedProviderId,
        buildingId: selectedBuildingId,
        message,
      });
      alert("Solicitud enviada al proveedor");
      handleCloseQuoteModal();
    } catch (err) {
      console.error("Error enviando la solicitud:", err);
      alert("Error enviando la solicitud");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Contenido principal: se integra con Layout global */}
      <Outlet context={{ handleOpenQuoteModal, requestQuote }} />

      {/* Modal Cotización */}
      {quoteModalOpen && selectedProviderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 overflow-y-auto relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
              onClick={handleCloseQuoteModal}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Solicitar Cotización</h2>

            <BuildingSelector
              selectedBuildingId={selectedBuildingId}
              setSelectedBuildingId={setSelectedBuildingId}
            />

            <textarea
              placeholder="Escribe un mensaje para el proveedor (opcional)"
              className="border border-gray-300 rounded-lg p-2 w-full h-28 mb-4 focus:outline-none focus:ring-2 focus:ring-edicyan transition resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                onClick={handleCloseQuoteModal}
              >
                Cancelar
              </button>
              <button
                className="bg-edicyan text-white px-4 py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50 transition"
                onClick={handleSendQuoteRequest}
                disabled={!selectedBuildingId}
              >
                Enviar Solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceLayout;
