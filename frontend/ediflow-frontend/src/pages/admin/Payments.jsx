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
  PAID: "text-green-600",
  PENDING: "text-yellow-600",
  CANCELLED: "text-gray-500",
  OVERDUE: "text-red-600",
};

const Payments = () => {
  const { trialExpired } = useAuth();
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

  const [filters, setFilters] = useState({
    status: "",
    buildingId: "",
    fromDate: "",
    toDate: "",
  });

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

  useEffect(() => {
    const cleanedFilters = {};
    if (filters.status) cleanedFilters.status = filters.status;
    if (filters.buildingId) cleanedFilters.buildingId = filters.buildingId;
    if (filters.fromDate) cleanedFilters.fromDate = filters.fromDate;
    if (filters.toDate) cleanedFilters.toDate = filters.toDate;
    

    fetchPayments(currentPage - 1, itemsPerPage, cleanedFilters);
  }, [filters, currentPage, fetchPayments]);

  useEffect(() => {
    setLoadingResidents(true);
    axios
      .get("http://localhost:8080/residents/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const resContent = res.data.content || [];
        setResidents(resContent);
      })
      .finally(() => setLoadingResidents(false));
  }, [token]);

  useEffect(() => {
    if (residents.length > 0) {
      const uniqueBuildings = residents
        .map((r) => r.buildingDTO)
  .filter((b, idx, arr) => b && arr.findIndex((x) => x.id === b.id) === idx);
      setBuildings(uniqueBuildings);
    }
  }, [residents]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = (payment) => {
    if (trialExpired) {
      alert("Tu prueba gratuita ha finalizado.");
      return;
    }
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
    setFormData({
      amount: "",
      issueDate: "",
      dueDate: "",
      paymentDate: "",
      concept: "",
      status: "PENDING",
      residentId: "",
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      residentDTO: { id: parseInt(formData.residentId) },
    };
    try {
      if (editingPayment) {
        await axios.put(
          `http://localhost:8080/payment/update/${editingPayment.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:8080/payment/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchPayments(currentPage - 1, itemsPerPage, filters);
      handleCancel();
    } catch (err) {
      alert("Error al guardar el pago");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este pago?")) return;
    try {
      await axios.delete(`http://localhost:8080/payment/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPayments(currentPage - 1, itemsPerPage, filters);
    } catch {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pagos</h1>
        <button
          onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          className={`px-4 py-2 rounded text-white ${
            trialExpired ? "bg-gray-400 cursor-not-allowed" : "bg-ediblue hover:bg-blue-700"
          }`}
          disabled={trialExpired}
        >
          {showForm ? "Cancelar" : "Agregar pago"}
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="p-2 border rounded"
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="PAID">Pagado</option>
          <option value="CANCELLED">Cancelado</option>
          <option value="OVERDUE">Vencido</option>
        </select>
        <select
  value={filters.buildingId}
  onChange={(e) => {
    
    setFilters((f) => ({ ...f, buildingId: e.target.value }));
    setCurrentPage(1); // resetea la página al cambiar filtro
  }}
  className="p-2 border rounded"
>
          <option value="">Todos los edificios</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
          className="p-2 border rounded"
        />
      </div>

      {/* Formulario */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 border p-4 rounded bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="text-gray-500" size={18} />
            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Monto"
              value={formData.amount}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
              disabled={trialExpired}
            />
          </div>
          <input
            name="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={handleChange}
            required
            className="p-2 border rounded"
            disabled={trialExpired}
          />
          <input
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="p-2 border rounded"
            disabled={trialExpired}
          />
          <input
            name="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={handleChange}
            className="p-2 border rounded"
            disabled={trialExpired}
          />
          <input
            name="concept"
            placeholder="Concepto"
            value={formData.concept}
            onChange={handleChange}
            className="p-2 border rounded"
            disabled={trialExpired}
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-2 border rounded"
            disabled={trialExpired}
          >
            <option value="PENDING">Pendiente</option>
            <option value="PAID">Pagado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
          <select
            name="residentId"
            value={formData.residentId}
            onChange={handleChange}
            required
            className="p-2 border rounded col-span-full"
            disabled={trialExpired}
          >
            <option value="">Seleccione un residente</option>
            {residents.map((res) => (
              <option key={res.id} value={res.id}>
                {res.userDTO?.fullName || res.userDTO?.username || "Sin nombre"}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-full ${
              trialExpired ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : ""
            }`}
            disabled={trialExpired}
          >
            {editingPayment ? "Actualizar Pago" : "Crear Pago"}
          </button>
        </form>
      )}

      {/* Tabla de pagos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Monto</th>
              <th className="py-2 px-4 border-b">Emisión</th>
              <th className="py-2 px-4 border-b">Vencimiento</th>
              <th className="py-2 px-4 border-b">Pago</th>
              <th className="py-2 px-4 border-b">Estado</th>
              <th className="py-2 px-4 border-b">Residente</th>
              <th className="py-2 px-4 border-b">Apartamento</th>
              <th className="py-2 px-4 border-b">Edificio</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center p-4">
                  Cargando...
                </td>
              </tr>
            ) : paymentsWithComputedStatus.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center p-4">
                  No se encontraron pagos.
                </td>
              </tr>
            ) : (
              paymentsWithComputedStatus.map((p) => (
                <tr key={p.id}>
                  <td className="py-2 px-4 border-b">{p.id}</td>
                  <td className="py-2 px-4 border-b">${p.amount}</td>
                  <td className="py-2 px-4 border-b">{p.issueDate}</td>
                  <td className="py-2 px-4 border-b">{p.dueDate}</td>
                  <td className="py-2 px-4 border-b">{p.paymentDate || "-"}</td>
                  <td className={`py-2 px-4 border-b ${statusStyles[p.computedStatus]}`}>
                    {statusMap[p.computedStatus]}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {p.residentDTO?.userDTO?.fullName || "Sin asignar"}
                  </td>
                  <td className="py-2 px-4 border-b">{p.residentDTO?.apartmentDTO?.number || "-"}</td>
                  <td className="py-2 px-4 border-b">{p.residentDTO?.apartmentDTO?.buildingDTO?.name || "-"}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      disabled={trialExpired}
                      className={`${
                        trialExpired ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:underline"
                      }`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={trialExpired}
                      className={`${
                        trialExpired ? "cursor-not-allowed text-gray-400" : "text-red-600 hover:underline"
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded disabled:opacity-50 text-white bg-ediblue hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500"
        >
          Anterior
        </button>
        <span className="px-4 py-2">
          Página {currentPage} de {paymentsPage.totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, paymentsPage.totalPages))}
          disabled={currentPage === paymentsPage.totalPages || paymentsPage.totalPages === 0}
          className="px-4 py-2 rounded disabled:opacity-50 text-white bg-ediblue hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Payments;
