import { useEffect, useState } from "react";
import axios from "axios";
import CreateCommonAreaForm from "../../components/admin/CreateCommonAreaForm";

const CommonAreasPage = () => {
  const [commonAreas, setCommonAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null); // NUEVO

  const fetchCommonAreas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/common-areas/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommonAreas(res.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar las áreas comunes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommonAreas();
  }, []);

  const handleCreatedOrUpdated = () => {
    fetchCommonAreas();
    setShowForm(false);
    setEditingArea(null); // resetear edición
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Seguro que querés eliminar esta área?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/common-areas/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCommonAreas();
    } catch (err) {
      alert("Error al eliminar el área");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Áreas Comunes</h1>

      <button
  onClick={() => {
    setShowForm((prev) => !prev);
    setEditingArea(null);
  }}
  className={`mb-8 px-6 py-3 font-semibold rounded text-white transition-transform duration-150 
    bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg`}
>
  {showForm ? "Cancelar" : "Crear Área Común"}
</button>

      {showForm && (
  <div className="mb-6 animate-fadeIn">
    <CreateCommonAreaForm
      onCreated={handleCreatedOrUpdated}
      initialData={editingArea}
    />
  </div>
)}

      {loading && (
  <div className="flex justify-center py-6">
    <svg
      className="animate-spin h-8 w-8 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  </div>
)}

{error && (
  <p className="text-red-600 font-semibold text-center">{error}</p>
)}

      {!loading && !error && (
        <ul className="space-y-6">
  {commonAreas.map((area) => (
    <li
      key={area.id}
      className="p-5 border rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center"
    >
      <div className="max-w-full md:max-w-[70%]">
        <h2 className="text-2xl font-semibold mb-1">{area.name}</h2>
        <p className="text-gray-700 mb-2">{area.description}</p>
        <p className="text-sm text-gray-500">Capacidad: {area.capacity ?? "No especificada"}</p>
      </div>
      <div className="flex flex-row md:flex-col gap-3 mt-4 md:mt-0 min-w-[120px]">
        <button
          onClick={() => handleEdit(area)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          aria-label={`Editar área común ${area.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/></svg>
          Editar
        </button>
        <button
          onClick={() => handleDelete(area.id)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          aria-label={`Eliminar área común ${area.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6"/></svg>
          Eliminar
        </button>
      </div>
    </li>
  ))}
</ul>

      )}
    </div>
  );
};

export default CommonAreasPage;
