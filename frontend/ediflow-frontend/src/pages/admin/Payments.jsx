import { usePaymentContext } from "../../contexts/PaymentContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, CalendarDays, DollarSign, Building2 } from "lucide-react";

const statusMap = {
  PAID: "Pagado",
  PENDING: "Pendiente",
  CANCELLED: "Cancelado",
};

const Payments = () => {
  const { payments, loading, error, fetchPayments } = usePaymentContext();
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
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [errorResidents, setErrorResidents] = useState(null);

  useEffect(() => {
    if (showForm) {
      setLoadingResidents(true);
      axios
        .get("http://localhost:8080/residents/all", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setResidents(res.data);
          setErrorResidents(null);
        })
        .catch(() => {
          setErrorResidents("Error cargando residentes");
        })
        .finally(() => {
          setLoadingResidents(false);
        });
    }
  }, [showForm, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditClick = (payment) => {
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
      amount: parseFloat(formData.amount),
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate || null,
      concept: formData.concept,
      status: formData.status,
      residentDTO: {
        id: parseInt(formData.residentId),
      },
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
      fetchPayments();
      handleCancel();
    } catch (err) {
      alert("Error al guardar el pago");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este pago?")) return;
    try {
      await axios.delete(`http://localhost:8080/payment/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPayments();
    } catch (err) {
      alert("Error al eliminar el pago");
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pagos</h1>
        <button
          onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          className="bg-ediblue text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancelar" : editingPayment ? "Editar pago" : "Agregar pago"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 border p-4 rounded bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="flex items-center gap-2 md:col-span-1">
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
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de emisión
            </label>
            <input
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de vencimiento
            </label>
            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de pago (opcional)
            </label>
            <input
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>

          <input
            name="concept"
            placeholder="Concepto"
            value={formData.concept}
            onChange={handleChange}
            className="p-2 border rounded md:col-span-2"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="PENDING">Pendiente</option>
            <option value="PAID">Pagado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>

          <div className="md:col-span-3">
            {loadingResidents ? (
              <p>Cargando residentes...</p>
            ) : errorResidents ? (
              <p className="text-red-500">{errorResidents}</p>
            ) : (
              <select
                name="residentId"
                value={formData.residentId}
                onChange={handleChange}
                required
                className="p-2 border rounded w-full"
              >
                <option value="">Seleccione un residente</option>
                {residents.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.userDTO?.fullName || res.userDTO?.username || "Sin nombre"}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-full"
          >
            {editingPayment ? "Actualizar Pago" : "Crear Pago"}
          </button>
        </form>
      )}

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
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="py-2 px-4 border-b">{payment.id}</td>
                <td className="py-2 px-4 border-b">${payment.amount}</td>
                <td className="py-2 px-4 border-b">{payment.issueDate}</td>
                <td className="py-2 px-4 border-b">{payment.dueDate}</td>
                <td className="py-2 px-4 border-b">{payment.paymentDate || "-"}</td>
                <td className="py-2 px-4 border-b">{statusMap[payment.status] || payment.status}</td>
                <td className="py-2 px-4 border-b">
                  {payment.residentDTO?.userDTO?.fullName ||
                    payment.residentDTO?.userDTO?.username ||
                    "Sin asignar"}
                </td>
                <td className="py-2 px-4 border-b">{payment.residentDTO?.apartmentDTO?.number || "-"}</td>
                <td className="py-2 px-4 border-b truncate max-w-[150px]">
                  <div className="flex items-center gap-2">
                  
                    <span>{payment.residentDTO?.buildingDTO?.name || "-"}</span>
                  </div>
                </td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => handleEditClick(payment)}
                    className="text-blue-600 hover:underline"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(payment.id)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;