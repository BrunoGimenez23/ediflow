import { useMarketplace } from "../../contexts/MarketplaceContext";

const SentQuotesSection = () => {
  const { quotes, loading } = useMarketplace();

  if (loading) return <p>Cargando cotizaciones...</p>;

  return (
    <section>
      <h2>Cotizaciones Enviadas</h2>
      {quotes && quotes.length > 0 ? (
        <div className="quotes-list">
          {quotes.map((q) => (
            <div key={q.id} className="quote-card">
              <p><strong>Orden ID:</strong> {q.orderId}</p>
              <p><strong>Edificio:</strong> {q.orderDescription}</p>
              <p><strong>Monto:</strong> ${q.amount}</p>
              <p><strong>Mensaje:</strong> {q.message || "—"}</p>
              <p><strong>Estado:</strong> {q.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay cotizaciones enviadas</p>
      )}
    </section>
  );
};

export default SentQuotesSection;
