import React from "react";
import { useMarketplace } from "../../contexts/marketplace/MarketplaceContext";
import QuoteList from "../../components/marketplace/QuoteList";

const QuotesPage = () => {
  const { quotes, loading, error } = useMarketplace();

  if (loading) return <p>Cargando cotizaciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!quotes || quotes.length === 0) return <p>No hay cotizaciones</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cotizacioness</h1>
      <QuoteList quotes={quotes} />
    </div>
  );
};

export default QuotesPage;
