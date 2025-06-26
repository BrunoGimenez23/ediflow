import axios from "axios";
import { useEffect, useState } from "react";

const Residents = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingResident, setEditingResident] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    ci: "",
    fullName: "",
  });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8080/residents/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Residentes recibidos:", res.data);
      setData(res.data);
    } catch (err) {
      setError("Error al obtener residentes");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (resident) => {
    setEditingResident(resident);
    setFormData({
      email: resident.userDTO?.email || "",
      username: resident.userDTO?.username || "",
      ci: resident.ci || "",
      fullName: resident.userDTO?.fullName || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingResident(null);
    setFormData({
      email: "",
      username: "",
      ci: "",
      fullName: "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingResident) return;

    try {
      const payload = {
        ci: formData.ci,
        userDTO: {
          id: editingResident.userDTO?.id,
          email: formData.email,
          username: formData.username,
          fullName: formData.fullName,
        },
      };

      await axios.put(
        `http://localhost:8080/residents/update/${editingResident.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchData();
      handleCancelEdit();
    } catch (err) {
      alert("Error al actualizar residente");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro que querés eliminar este residente?")) return;

    try {
      await axios.delete(`http://localhost:8080/residents/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchData();
    } catch (err) {
      alert("Error al eliminar residente");
      console.error(err);
    }
  };

  if (loading) return <p>Cargando residentes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Residentes</h2>

      {editingResident && (
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
          />
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mb-2 p-2 w-full border rounded"
          />
          <input
            name="ci"
            placeholder="CI"
            value={formData.ci}
            onChange={handleChange}
            required
            className="mb-2 p-2 w-full border rounded"
          />
          <input
            name="fullName"
            placeholder="Nombre completo"
            value={formData.fullName}
            onChange={handleChange}
            className="mb-2 p-2 w-full border rounded"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
        <thead className="bg-ediblue text-white">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Nombre completo</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">CI</th>
            <th className="px-4 py-2 text-left">Piso</th>
            <th className="px-4 py-2 text-left">Apartamento</th>
            <th className="px-4 py-2 text-left">Edificio</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((resident) => (
            <tr key={resident.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{resident.id}</td>
              <td className="px-4 py-2">{resident.userDTO?.email || "Sin email"}</td>
              <td className="px-4 py-2">{resident.userDTO?.fullName || "-"}</td>
              <td className="px-4 py-2">{resident.userDTO?.username || "Sin username"}</td>
              <td className="px-4 py-2">{resident.ci}</td>
              <td className="px-4 py-2">{resident.apartmentDTO?.floor ?? "-"}</td>
              <td className="px-4 py-2">{resident.apartmentDTO?.number ?? "-"}</td>
              <td className="px-4 py-2">{resident.buildingDTO?.name || "Sin edificio"}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEditClick(resident)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(resident.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Residents;
