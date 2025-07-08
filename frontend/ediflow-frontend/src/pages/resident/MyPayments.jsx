import { useEffect, useState } from "react";
import { useResidentContext } from "../../contexts/ResidentContext";
import { useAuth } from "../../contexts/AuthContext";

const statusLabels = {
  PAID: "Pagado",
  PENDING: "Pendiente",
  OVERDUE: "Vencido",
};

const statusStyles = {
  PAID: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  OVERDUE: "bg-red-100 text-red-700",
};

const formatterCurrency = new Intl.NumberFormat("es-UY", {
  style: "currency",
  currency: "UYU",
  minimumFractionDigits: 2,
});

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date) ? "-" : date.toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const MyPayments = () => {
  const { token } = useAuth();
  const { resident, loading: loadingResident, error: errorResident } = useResidentContext();
  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!resident?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/payment/by-resident/${resident.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (token && resident?.id) {
      fetchPayments();
    }
  }, [token, resident?.id]);

  const filteredPayments = payments.filter((p) =>
    statusFilter === "ALL" ? true : p.status === statusFilter
  );

  if (loading || loadingResident)
    return <p className="text-center mt-10 text-gray-600 animate-pulse">Cargando pagos...</p>;

  if (error || errorResident)
    return <p className="text-center mt-10 text-red-500 font-semibold">Error: {error || errorResident}</p>;

  if (payments.length === 0)
    return (
      <div className="max-w-5xl mx-auto p-6 mt-12">
        <p className="text-center text-gray-600 italic">No hay pagos registrados.</p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-4 py-2 bg-ediblue text-white rounded hover:bg-ediblue-dark"
        >
          Volver atrás
        </button>
      </div>
    );

  if (filteredPayments.length === 0)
    return (
      <div className="max-w-5xl mx-auto p-6 mt-12">
        <p className="text-center text-gray-600 italic">
          No hay pagos con estado &quot;{statusLabels[statusFilter]}&quot;.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-4 py-2 bg-ediblue text-white rounded hover:bg-ediblue-dark"
        >
          Volver atrás
        </button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Pagos</h1>

      {/* Filtro por estado */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium">Filtrar por estado:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
          disabled={loading}
        >
          <option value="ALL">Todos</option>
          <option value="PAID">Pagados</option>
          <option value="PENDING">Pendientes</option>
          <option value="OVERDUE">Vencidos</option>
        </select>

        <button
          onClick={() => window.history.back()}
          className="ml-auto px-4 py-2 bg-ediblue text-white rounded hover:bg-ediblue-dark"
        >
          Volver atrás
        </button>
      </div>

      {/* Versión desktop (tabla) */}
      <div className="hidden md:block">
        <table className="min-w-full table-auto divide-y divide-gray-200 border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "Concepto", key: "concept" },
                { label: "Fecha emisión", key: "issueDate" },
                { label: "Vencimiento", key: "dueDate" },
                { label: "Fecha pago", key: "paymentDate" },
                { label: "Monto", key: "amount" },
                { label: "Estado", key: "status" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((pay) => (
              <tr
                key={pay.id}
                className={`hover:bg-blue-50 transition-colors ${
                  pay.status === "OVERDUE" ? "bg-red-50" : ""
                }`}
              >
                <td className="py-3 px-6 text-gray-700">{pay.concept || "-"}</td>
                <td className="py-3 px-6 text-gray-700">{formatDate(pay.issueDate)}</td>
                <td className="py-3 px-6 text-gray-700">{formatDate(pay.dueDate)}</td>
                <td className="py-3 px-6 text-gray-700">
                  {pay.paymentDate ? formatDate(pay.paymentDate) : "-"}
                </td>
                <td className="py-3 px-6 text-gray-700">{formatterCurrency.format(pay.amount)}</td>
                <td className="py-3 px-6">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[pay.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusLabels[pay.status] || pay.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Versión mobile (cards) */}
      <div className="md:hidden space-y-4">
        {filteredPayments.map((pay) => (
          <div
            key={pay.id}
            className={`p-4 border rounded-lg shadow-sm ${
              pay.status === "OVERDUE" ? "bg-red-50" : "bg-gray-50"
            }`}
          >
            <p className="text-sm text-gray-600">
              <strong>Concepto:</strong> {pay.concept || "-"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Emitido:</strong> {formatDate(pay.issueDate)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Vencimiento:</strong> {formatDate(pay.dueDate)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Pago:</strong> {pay.paymentDate ? formatDate(pay.paymentDate) : "-"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Monto:</strong> {formatterCurrency.format(pay.amount)}
            </p>
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  statusStyles[pay.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {statusLabels[pay.status] || pay.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPayments;
