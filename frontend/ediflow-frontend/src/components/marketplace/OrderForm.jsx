import React, { useState } from "react";
import { useMarketplaceService } from "../../services/marketplaceService";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";
import BuildingSelector from "../common/BuildingSelector";
import { useBuildingsContext } from "../../contexts/BuildingContext";

const OrderForm = () => {
  const { fetchOrders } = useMarketplace();
  const marketplaceService = useMarketplaceService();
  const { buildings } = useBuildingsContext();

  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [providerId, setProviderId] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBuildingId || !providerId || !description) {
      alert("Completá todos los campos y seleccioná un edificio.");
      return;
    }

    try {
      await marketplaceService.createOrder({
        providerId,
        description,
        buildingId: selectedBuildingId,
      });

      alert("Orden creada correctamente");
      setProviderId("");
      setDescription("");
      setSelectedBuildingId(null);
      fetchOrders();
    } catch (err) {
      console.error("Error creando orden:", err);
      alert("Error creando la orden");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-4">
      <h2 className="font-bold mb-2">Crear Orden</h2>

      <BuildingSelector
        selectedBuildingId={selectedBuildingId}
        setSelectedBuildingId={setSelectedBuildingId}
      />

      <input
        type="text"
        placeholder="ID del proveedor"
        value={providerId}
        onChange={(e) => setProviderId(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <textarea
        placeholder="Descripción del servicio"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!selectedBuildingId}
      >
        Crear Orden
      </button>
    </form>
  );
};

export default OrderForm;
