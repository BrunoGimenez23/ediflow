import React from "react";
import ProviderCard from "./ProviderCard";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";

const ProviderList = ({ onRequestQuote }) => {
  const { providers, loading } = useMarketplace();

  if (loading) return <p>Cargando proveedores...</p>;
  if (providers.length === 0) return <p>No hay proveedores disponibles</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {providers.map((p) => (
        <ProviderCard key={p.id} provider={p} onRequestQuote={onRequestQuote} />
      ))}
    </div>
  );
};

export default ProviderList;
