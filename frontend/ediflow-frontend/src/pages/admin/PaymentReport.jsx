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
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reporte de Pagos</h2>

      {/* Filtros */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={selectedBuilding?.id || ""}
          onChange={(e) => {
            const building = buildings.find((b) => b.id === parseInt(e.target.value));
            setSelectedBuilding(building);
            setPage(0); // reset paginación al cambiar edificio
          }}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
          placeholder="Desde"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded"
          placeholder="Hasta"
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
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

      {/* Tabla */}
      {loading ? (
        <p>Cargando pagos...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Residente</th>
              <th className="border px-2 py-1">Apt.</th>
              <th className="border px-2 py-1">Edificio</th>
              <th className="border px-2 py-1">Fecha Venc.</th>
              <th className="border px-2 py-1">Fecha Pago</th>
              <th className="border px-2 py-1">Estado</th>
              <th className="border px-2 py-1">Monto</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
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
      )}

      {/* Paginación */}
      <div className="flex justify-between mt-4 items-center gap-2 flex-wrap">
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
          <select value={size} onChange={(e) => { setSize(parseInt(e.target.value)); setPage(0); }} className="border p-1 rounded">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>items por página</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentReport;
