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
    phone: "",
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
        setData(res.data);
        setCurrentPage(res.data.number ?? page);
      } else {
        setData({ content: [], totalPages: 1, number: 0 });
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
      phone: resident.phone || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingResident(null);
    setFormData({ email: "", ci: "", fullName: "", phone: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (trialExpired || isSupport || !editingResident) return;

    try {
      const payload = {
        ci: formData.ci,
        phone: formData.phone,
        userDTO: {
          id: editingResident.userDTO?.id,
          email: formData.email,
          fullName: formData.fullName,
        },
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/residents/update/${editingResident.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
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

  if (loading) return <p className="text-center py-10 text-gray-500">Cargando residentes...</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  const totalPages = data.totalPages || 1;
  const pageNumber = currentPage ?? 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Lista de Residentes</h2>

      {/* Filtro edificios */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <label className="font-medium">Filtrar por edificio:</label>
        <select
          value={selectedBuildingId}
          onChange={(e) =>
            setSelectedBuildingId(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="p-2 border rounded w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-ediblue"
        >
          <option value="all">Todos</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla para desktop */}
      <div className="hidden md:block overflow-x-auto border rounded-lg shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-ediblue text-white">
            <tr>
              {["ID","Email","Nombre completo","CI","Teléfono","Piso","Apartamento","Edificio","Acciones"].map((th) => (
                <th key={th} className="px-4 py-2 text-left">{th}</th>
              ))}
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
                      <form onSubmit={handleSave} className="mb-6 p-4 border rounded bg-gray-50 shadow-inner flex flex-col gap-3">
                        <h3 className="mb-2 font-semibold text-lg">Editar Residente</h3>
                        <input
                          name="email"
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-ediblue"
                          disabled={trialExpired}
                        />
                        <input
                          name="ci"
                          placeholder="CI"
                          value={formData.ci}
                          onChange={handleChange}
                          required
                          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-ediblue"
                          disabled={trialExpired}
                        />
                        <input
                          name="fullName"
                          placeholder="Nombre completo"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-ediblue"
                          disabled={trialExpired}
                        />
                        <input
                          name="phone"
                          placeholder="Teléfono"
                          value={formData.phone}
                          onChange={handleChange}
                          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-ediblue"
                          disabled={trialExpired}
                        />
                        <div className="flex flex-col md:flex-row gap-4">
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
      </div>

      {/* Tarjetas para mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {data.content.map((resident) => (
          <div key={resident.id} className="border rounded-lg p-4 shadow bg-white flex flex-col gap-2">
            <p><span className="font-semibold">ID:</span> {resident.id}</p>
            <p><span className="font-semibold">Email:</span> {resident.userDTO?.email || "Sin email"}</p>
            <p><span className="font-semibold">Nombre:</span> {resident.userDTO?.fullName || "-"}</p>
            <p><span className="font-semibold">CI:</span> {resident.ci}</p>
            <p><span className="font-semibold">Teléfono:</span> {resident.phone || "-"}</p>
            <p><span className="font-semibold">Piso:</span> {resident.apartmentDTO?.floor ?? "-"}</p>
            <p><span className="font-semibold">Apartamento:</span> {resident.apartmentDTO?.number ?? "-"}</p>
            <p><span className="font-semibold">Edificio:</span> {resident.buildingDTO?.name || "Sin edificio"}</p>
            {!isSupport && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditClick(resident)}
                  className={`px-3 py-1 rounded text-white ${trialExpired ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  disabled={trialExpired}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(resident.id)}
                  className={`px-3 py-1 rounded text-white ${trialExpired ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                  disabled={trialExpired}
                >
                  Eliminar
                </button>
              </div>
            )}
            {editingResident?.id === resident.id && !isSupport && (
              <form onSubmit={handleSave} className="mt-3 p-3 border rounded bg-gray-50 flex flex-col gap-2">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded w-full"
                  disabled={trialExpired}
                />
                <input
                  name="ci"
                  placeholder="CI"
                  value={formData.ci}
                  onChange={handleChange}
                  required
                  className="p-2 border rounded w-full"
                  disabled={trialExpired}
                />
                <input
                  name="fullName"
                  placeholder="Nombre completo"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  disabled={trialExpired}
                />
                <input
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  disabled={trialExpired}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`px-3 py-1 rounded text-white ${trialExpired ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                    disabled={trialExpired}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    disabled={trialExpired}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">Página {pageNumber + 1} de {totalPages}</span>
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber + 1 >= totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Residents;
