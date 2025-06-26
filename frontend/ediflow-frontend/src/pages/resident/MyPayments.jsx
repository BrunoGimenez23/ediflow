import { useEffect, useState } from "react";
import { useResidentContext } from "../../contexts/ResidentContext";
import { useAuth } from "../../contexts/AuthContext";

const MyPayments = () => {
  const { token } = useAuth();
  const { resident, loading: loadingResident, error: errorResident } = useResidentContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!resident?.id) return;
      setLoading(true);
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && resident?.id) {
      fetchPayments();
    }
  }, [token, resident?.id]);

  if (loading || loadingResident) return <p className="text-center mt-10">Cargando pagos...</p>;
  if (error || errorResident) return <p className="text-center mt-10 text-red-500">Error: {error || errorResident}</p>;
  if (payments.length === 0) return <p className="text-center mt-10">No hay pagos registrados.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-12">
      <h1 className="text-3xl font-bold mb-6">Mis Pagos</h1>
      <table className="min-w-full table-auto divide-y divide-gray-200 border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {["Fecha emisión", "Vencimiento", "Fecha pago", "Monto", "Estado"].map((header) => (
              <th
                key={header}
                className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((pay) => (
            <tr key={pay.id} className="hover:bg-blue-50 transition-colors">
              <td className="py-3 px-6 text-gray-700">{new Date(pay.issueDate).toLocaleDateString()}</td>
              <td className="py-3 px-6 text-gray-700">{new Date(pay.dueDate).toLocaleDateString()}</td>
              <td className="py-3 px-6 text-gray-700">{pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString() : "-"}</td>
              <td className="py-3 px-6 text-gray-700">${pay.amount.toFixed(2)}</td>
              <td className="py-3 px-6">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    pay.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : pay.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {pay.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyPayments;
