import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import React from "react";

const Residents = () => {
  const { trialExpired, user } = useAuth();
  const isSupport = user?.role === "SUPPORT";

  const [data, setData] = useState({ content: [], totalPages: 1, number: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState("all");

  const [editingResident, setEditingResident] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    ci: "",
    fullName: "",
    phone: "", // <-- agregamos teléfono
  });

  const [currentPage, setCurrentPage] = useState(0);
  const token = localStorage.getItem("token");

  const fetchData = async (page = 0) => {
    setLoading(true);
    setError(null);

    try {
      let url = `${import.meta.env.VITE_API_URL}/residents/all?page=${page}&size=20`;
      if (selectedBuildingId !== "all") {
        url += `&buildingId=${Number(selectedBuildingId)}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.content) {
        console.log("🟢 Datos crudos del backend:", res.data.content); // 🔹 log backend
        setData(res.data);
        setCurrentPage(res.data.number !== undefined ? res.data.number : page);
      } else {
        setData({
          content: [],
          totalPages: 1,
          number: 0,
        });
        setCurrentPage(0);
      }
    } catch (err) {
      setError("Error al obtener residentes");
    }
    setLoading(false);
  };

  const fetchBuildings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/buildings/for-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuildings(Array.isArray(res.data) ? res.data : []);
    } catch {
      setBuildings([]);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
    fetchData(0);
  }, [selectedBuildingId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (resident) => {
    if (trialExpired || isSupport) return;
    setEditingResident(resident);
    setFormData({
      email: resident.userDTO?.email || "",
      ci: resident.ci || "",
      fullName: resident.userDTO?.fullName || "",
      phone: resident.phone || "", // <-- asignamos teléfono desde Resident
    });
  };

  const handleCancelEdit = () => {
    setEditingResident(null);
    setFormData({
      email: "",
      ci: "",
      fullName: "",
      phone: "", // <-- limpiamos teléfono
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (trialExpired || isSupport || !editingResident) return;

    try {
      const payload = {
        ci: formData.ci,
        phone: formData.phone, // <-- actualizamos Resident.phone
        userDTO: {
          id: editingResident.userDTO?.id,
          email: formData.email,
          fullName: formData.fullName,
        },
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/residents/update/${editingResident.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchData(currentPage);
      handleCancelEdit();
    } catch (err) {
      alert("Error al actualizar residente");
    }
  };

  const handleDelete = async (id) => {
    if (trialExpired || isSupport) return;
    if (!window.confirm("¿Estás seguro que querés eliminar este residente?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/residents/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.content.length === 1 && currentPage > 0) {
        fetchData(currentPage - 1);
      } else {
        fetchData(currentPage);
      }
    } catch (err) {
      const message = err?.response?.data || "Error al eliminar residente";
      alert(message);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < (data.totalPages || 1)) {
      fetchData(newPage);
    }
  };

  if (loading) return <p>Cargando residentes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const totalPages = data.totalPages || 1;
  const pageNumber = currentPage ?? 0;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Residentes</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filtrar por edificio:</label>
        <select
          value={selectedBuildingId}
          onChange={(e) =>
            setSelectedBuildingId(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="p-2 border rounded"
        >
          <option value="all">Todos</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
        <thead className="bg-ediblue text-white">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Nombre completo</th>
            <th className="px-4 py-2 text-left">CI</th>
            <th className="px-4 py-2 text-left">Teléfono</th>
            <th className="px-4 py-2 text-left">Piso</th>
            <th className="px-4 py-2 text-left">Apartamento</th>
            <th className="px-4 py-2 text-left">Edificio</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map((resident) => {
            const rows = [
              <tr key={`main-${resident.id}`} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{resident.id}</td>
                <td className="px-4 py-2">{resident.userDTO?.email || "Sin email"}</td>
                <td className="px-4 py-2">{resident.userDTO?.fullName || "-"}</td>
                <td className="px-4 py-2">{resident.ci}</td>
                <td className="px-4 py-2">{resident.phone || "-"}</td>
                <td className="px-4 py-2">{resident.apartmentDTO?.floor ?? "-"}</td>
                <td className="px-4 py-2">{resident.apartmentDTO?.number ?? "-"}</td>
                <td className="px-4 py-2">{resident.buildingDTO?.name || "Sin edificio"}</td>
                <td className="px-4 py-2 space-x-2">
                  {!isSupport && (
                    <>
                      <button
                        onClick={() => handleEditClick(resident)}
                        className={`hover:underline ${trialExpired ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
                        disabled={trialExpired}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(resident.id)}
                        className={`hover:underline ${trialExpired ? "text-gray-400 cursor-not-allowed" : "text-red-600"}`}
                        disabled={trialExpired}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ];

            if (editingResident?.id === resident.id && !isSupport) {
              rows.push(
                <tr key={`edit-${resident.id}`}>
                  <td colSpan={9}>
                    <form onSubmit={handleSave} className="mb-6 p-4 border rounded bg-gray-100">
                      <h3 className="mb-4 font-semibold">Editar Residente</h3>
                      <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mb-2 p-2 w-full border rounded"
                        disabled={trialExpired}
                      />
                      <input
                        name="ci"
                        placeholder="CI"
                        value={formData.ci}
                        onChange={handleChange}
                        required
                        className="mb-2 p-2 w-full border rounded"
                        disabled={trialExpired}
                      />
                      <input
                        name="fullName"
                        placeholder="Nombre completo"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mb-2 p-2 w-full border rounded"
                        disabled={trialExpired}
                      />
                      <input
                        name="phone"
                        placeholder="Teléfono"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mb-2 p-2 w-full border rounded"
                        disabled={trialExpired}
                      />
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className={`px-4 py-2 rounded text-white ${trialExpired ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                          disabled={trialExpired}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                          disabled={trialExpired}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              );
            }

            return rows;
          })}
        </tbody>
      </table>

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="px-3 py-1">
          Página {pageNumber + 1} de {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber + 1 >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Residents;
