import { usePaymentContext } from "../../contexts/PaymentContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, DollarSign } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const statusMap = {
  PAID: "Pagado",
  PENDING: "Pendiente",
  CANCELLED: "Cancelado",
  OVERDUE: "Vencido",
};

const statusStyles = {
  PAID: "text-green-700 bg-green-100 px-2 py-1 rounded-full text-sm",
  PENDING: "text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full text-sm",
  CANCELLED: "text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-sm",
  OVERDUE: "text-red-700 bg-red-100 px-2 py-1 rounded-full text-sm",
};

const Payments = () => {
  const { trialExpired, user } = useAuth();
  const { paymentsPage, loading, fetchPayments } = usePaymentContext();
  const token = localStorage.getItem("token");

  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    issueDate: "",
    dueDate: "",
    paymentDate: "",
    concept: "",
    status: "PENDING",
    residentId: "",
  });

  const [residents, setResidents] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [filters, setFilters] = useState({ status: "", buildingId: "", fromDate: "", toDate: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paymentsWithComputedStatus = (paymentsPage?.content || []).map((payment) => {
    const today = new Date();
    const due = payment.dueDate ? new Date(payment.dueDate) : null;
    let status = payment.status;
    if (due && due < today && status !== "PAID" && status !== "CANCELLED") {
      status = "OVERDUE";
    }
    return { ...payment, computedStatus: status };
  });

  // Filtrado y paginación
  useEffect(() => {
    const cleanedFilters = {};
    if (filters.status) cleanedFilters.status = filters.status;
    if (filters.buildingId) cleanedFilters.buildingId = filters.buildingId;
    if (filters.fromDate) cleanedFilters.fromDate = filters.fromDate;
    if (filters.toDate) cleanedFilters.toDate = filters.toDate;
    fetchPayments(currentPage - 1, itemsPerPage, cleanedFilters);
  }, [filters, currentPage, fetchPayments]);

  // Cargar residentes
  useEffect(() => {
    setLoadingResidents(true);
    axios.get(`${import.meta.env.VITE_API_URL}/residents/all`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 0, size: 100, buildingId: filters.buildingId || undefined },
    })
      .then((res) => setResidents(res.data.content || []))
      .catch(() => setResidents([]))
      .finally(() => setLoadingResidents(false));
  }, [token, filters.buildingId]);

  // Obtener edificios únicos
  useEffect(() => {
    if (residents.length > 0) {
      const uniqueBuildings = residents
        .map((r) => r.buildingDTO)
        .filter((b, idx, arr) => b && arr.findIndex((x) => x.id === b.id) === idx);
      setBuildings(uniqueBuildings);
    } else setBuildings([]);
  }, [residents]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = (payment) => {
    if (trialExpired) { alert("Tu prueba gratuita ha finalizado."); return; }
    setEditingPayment(payment);
    setFormData({
      amount: payment.amount,
      issueDate: payment.issueDate || "",
      dueDate: payment.dueDate || "",
      paymentDate: payment.paymentDate || "",
      concept: payment.concept || "",
      status: payment.status,
      residentId: payment.residentDTO?.id || "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingPayment(null);
    setFormData({ amount: "", issueDate: "", dueDate: "", paymentDate: "", concept: "", status: "PENDING", residentId: "" });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, amount: parseFloat(formData.amount), residentDTO: { id: parseInt(formData.residentId) } };
    try {
      if (editingPayment) {
        await axios.put(`${import.meta.env.VITE_API_URL}/payment/update/${editingPayment.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/payment/create`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchPayments(currentPage - 1, itemsPerPage, filters);
      handleCancel();
    } catch { alert("Error al guardar el pago"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este pago?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/payment/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPayments(currentPage - 1, itemsPerPage, filters);
    } catch { alert("Error al eliminar"); }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Pagos</h1>
        <button onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          className={`px-4 py-2 rounded text-white ${trialExpired ? "bg-gray-400 cursor-not-allowed" : "bg-ediblue hover:bg-blue-700"}`}
          disabled={trialExpired}
        >
          {showForm ? "Cancelar" : "Agregar pago"}
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setCurrentPage(1); }} className="p-2 border rounded">
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="PAID">Pagado</option>
          <option value="CANCELLED">Cancelado</option>
          <option value="OVERDUE">Vencido</option>
        </select>

        <select value={filters.buildingId} onChange={(e) => { setFilters((f) => ({ ...f, buildingId: e.target.value })); setCurrentPage(1); }} className="p-2 border rounded">
          <option value="">Todos los edificios</option>
          {buildings.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
        </select>

        <input type="date" value={filters.fromDate} onChange={(e) => { setFilters((f) => ({ ...f, fromDate: e.target.value })); setCurrentPage(1); }} className="p-2 border rounded" />
        <input type="date" value={filters.toDate} onChange={(e) => { setFilters((f) => ({ ...f, toDate: e.target.value })); setCurrentPage(1); }} className="p-2 border rounded" />
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="amount" className="mb-1 font-medium text-gray-700">Monto</label>
            <div className="flex items-center gap-2">
              <DollarSign className="text-gray-500" size={18} />
              <input id="amount" name="amount" type="number" step="0.01" placeholder="Monto" value={formData.amount} onChange={handleChange} required className="p-2 border rounded w-full" disabled={trialExpired} />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="issueDate" className="mb-1 font-medium text-gray-700">Fecha de emisión</label>
            <input id="issueDate" name="issueDate" type="date" value={formData.issueDate} onChange={handleChange} required className="p-2 border rounded" disabled={trialExpired} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="dueDate" className="mb-1 font-medium text-gray-700">Fecha de vencimiento</label>
            <input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required className="p-2 border rounded" disabled={trialExpired} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="paymentDate" className="mb-1 font-medium text-gray-700">Fecha de pago (opcional)</label>
            <input id="paymentDate" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleChange} className="p-2 border rounded" disabled={trialExpired} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="concept" className="mb-1 font-medium text-gray-700">Concepto</label>
            <input id="concept" name="concept" placeholder="Concepto" value={formData.concept} onChange={handleChange} className="p-2 border rounded" disabled={trialExpired} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 font-medium text-gray-700">Estado</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded" disabled={trialExpired}>
              <option value="PENDING">Pendiente</option>
              <option value="PAID">Pagado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          <div className="flex flex-col col-span-full">
            <label htmlFor="residentId" className="mb-1 font-medium text-gray-700">Residente</label>
            <select id="residentId" name="residentId" value={formData.residentId} onChange={handleChange} required className="p-2 border rounded w-full" disabled={trialExpired}>
              <option value="">Seleccione un residente</option>
              {residents.map((res) => (<option key={res.id} value={res.id}>{res.userDTO?.fullName || res.userDTO?.username || "Sin nombre"}</option>))}
            </select>
          </div>

          <button type="submit" className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-full ${trialExpired ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : ""}`} disabled={trialExpired}>
            {editingPayment ? "Actualizar Pago" : "Crear Pago"}
          </button>
        </form>
      )}

      {/* Tabla / tarjetas responsive */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "Monto", "Emisión", "Vencimiento", "Pago", "Estado", "Residente", "Apartamento", "Edificio", "Acciones"].map((h) => (
                <th key={h} className="py-2 px-4 border-b text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="text-center p-4">Cargando...</td></tr>
            ) : paymentsWithComputedStatus.length === 0 ? (
              <tr><td colSpan={10} className="text-center p-4">No se encontraron pagos.</td></tr>
            ) : paymentsWithComputedStatus.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{p.id}</td>
                <td className="py-2 px-4 border-b">${p.amount}</td>
                <td className="py-2 px-4 border-b">{p.issueDate}</td>
                <td className="py-2 px-4 border-b">{p.dueDate}</td>
                <td className="py-2 px-4 border-b">{p.paymentDate || "-"}</td>
                <td className={`py-2 px-4 border-b ${statusStyles[p.computedStatus]}`}>{statusMap[p.computedStatus]}</td>
                <td className="py-2 px-4 border-b">{p.residentDTO?.userDTO?.fullName || "Sin asignar"}</td>
                <td className="py-2 px-4 border-b">{p.residentDTO?.apartmentDTO?.number || "-"}</td>
                <td className="py-2 px-4 border-b">{p.residentDTO?.apartmentDTO?.buildingDTO?.name || "-"}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button onClick={() => handleEditClick(p)} disabled={trialExpired} className={`${trialExpired ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:underline"}`}><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} disabled={trialExpired} className={`${trialExpired ? "cursor-not-allowed text-gray-400" : "text-red-600 hover:underline"}`}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          <div className="text-center p-4">Cargando...</div>
        ) : paymentsWithComputedStatus.length === 0 ? (
          <div className="text-center p-4">No se encontraron pagos.</div>
        ) : paymentsWithComputedStatus.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">ID: {p.id}</span>
              <span className={statusStyles[p.computedStatus]}>{statusMap[p.computedStatus]}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
              <div>Monto: ${p.amount}</div>
              <div>Emisión: {p.issueDate}</div>
              <div>Vencimiento: {p.dueDate}</div>
              <div>Pago: {p.paymentDate || "-"}</div>
              <div>Residente: {p.residentDTO?.userDTO?.fullName || "Sin asignar"}</div>
              <div>Apto: {p.residentDTO?.apartmentDTO?.number || "-"}</div>
              <div>Edificio: {p.residentDTO?.apartmentDTO?.buildingDTO?.name || "-"}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEditClick(p)} disabled={trialExpired} className={`${trialExpired ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:underline"}`}><Pencil size={16} /></button>
              <button onClick={() => handleDelete(p.id)} disabled={trialExpired} className={`${trialExpired ? "cursor-not-allowed text-gray-400" : "text-red-600 hover:underline"}`}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 rounded disabled:opacity-50 text-white bg-ediblue hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500">
          Anterior
        </button>
        <span className="px-4 py-2">Página {currentPage} de {paymentsPage.totalPages || 1}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, paymentsPage.totalPages || 1))} disabled={currentPage === paymentsPage.totalPages || paymentsPage.totalPages === 0} className="px-4 py-2 rounded disabled:opacity-50 text-white bg-ediblue hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Payments;
