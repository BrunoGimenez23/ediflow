import React from "react";
import { useOutletContext } from "react-router-dom";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";
import ProviderCard from "../../components/marketplace/ProviderCard";

const ProvidersPage = () => {
  const { providers, loading } = useMarketplace();
  const { handleOpenQuoteModal } = useOutletContext();

  if (loading) return <p>Cargando proveedores...</p>;
  if (providers.length === 0) return <p>No hay proveedores</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Proveedores</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((p) => (
          <ProviderCard
            key={p.id}
            provider={p}
            onRequestQuote={() => handleOpenQuoteModal(p.id)} // 🔹 abre modal
          />
        ))}
      </div>
    </div>
  );
};

export default ProvidersPage;
