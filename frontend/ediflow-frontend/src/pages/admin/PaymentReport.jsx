import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useBuildingsContext } from "../../contexts/BuildingContext";
import axios from "axios";

const PaymentReport = () => {
  const { token } = useAuth();
  const { buildings, selectedBuilding, setSelectedBuilding } = useBuildingsContext();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPayments = async () => {
    if (!selectedBuilding) return;
    setLoading(true);
    try {
      const params = {
        buildingId: selectedBuilding.id,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        status: status || undefined,
        page,
        size,
        sortBy: "issueDate",
        direction: "desc",
      };

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/payment/all`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayments(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedBuilding, fromDate, toDate, status, page, size]);

  const handleExportCSV = async () => {
    if (!selectedBuilding) return;
    try {
      const params = {
        buildingId: selectedBuilding.id,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/payment/report/export/csv`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${selectedBuilding.name}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exportando CSV:", err);
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "PAID": return "Pagado";
      case "PENDING": return "Pendiente";
      case "OVERDUE": return "Vencido";
      case "CANCELLED": return "Cancelado";
      default: return status;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto mt-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Reporte de Pagos</h2>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <select
          value={selectedBuilding?.id || ""}
          onChange={(e) => {
            const building = buildings.find((b) => b.id === parseInt(e.target.value));
            setSelectedBuilding(building);
            setPage(0);
          }}
          className="border p-2 rounded w-full sm:w-auto"
        >
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Desde"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Hasta"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">Todos</option>
          <option value="PAID">Pagado</option>
          <option value="PENDING">Pendiente</option>
          <option value="OVERDUE">Vencido</option>
          <option value="CANCELLED">Cancelado</option>
        </select>

        <button
          onClick={handleExportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Exportar CSV
        </button>
      </div>

      {/* Tabla desktop */}
      {loading ? (
        <p>Cargando pagos...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-500 mt-2">No hay pagos.</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse border rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["Residente", "Apt.", "Edificio", "Fecha Venc.", "Fecha Pago", "Estado", "Monto"].map((h) => (
                    <th key={h} className="border px-3 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="border px-2 py-1">{p.residentDTO?.userDTO?.fullName || "-"}</td>
                    <td className="border px-2 py-1">{p.residentDTO?.apartmentDTO?.number || "-"}</td>
                    <td className="border px-2 py-1">{p.residentDTO?.apartmentDTO?.buildingDTO?.name || "-"}</td>
                    <td className="border px-2 py-1">{p.dueDate}</td>
                    <td className="border px-2 py-1">{p.paymentDate || "-"}</td>
                    <td className="border px-2 py-1">{translateStatus(p.status)}</td>
                    <td className="border px-2 py-1">{p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas mobile */}
          <div className="md:hidden flex flex-col gap-4">
            {payments.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg p-4 shadow-sm bg-white space-y-2 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{p.residentDTO?.userDTO?.fullName || "-"}</span>
                  <span className="text-gray-500 text-xs">{p.dueDate}</span>
                </div>
                <p className="text-gray-600 text-sm">Apt.: {p.residentDTO?.apartmentDTO?.number || "-"}</p>
                <p className="text-gray-600 text-sm">Edificio: {p.residentDTO?.apartmentDTO?.buildingDTO?.name || "-"}</p>
                <p className="text-gray-600 text-sm">Fecha Pago: {p.paymentDate || "-"}</p>
                <p className="text-gray-600 text-sm">Estado: {translateStatus(p.status)}</p>
                <p className="text-gray-600 text-sm">Monto: {p.amount}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row justify-between mt-4 items-center gap-2 flex-wrap">
        <div className="flex gap-2 items-center">
          <span>Página:</span>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>{page + 1} de {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={page + 1 === totalPages}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <span>Mostrar:</span>
          <select
            value={size}
            onChange={(e) => { setSize(parseInt(e.target.value)); setPage(0); }}
            className="border p-1 rounded"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>items por página</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentReport;
