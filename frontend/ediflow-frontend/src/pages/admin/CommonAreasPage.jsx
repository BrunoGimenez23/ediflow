import { useEffect, useState } from "react";
import axios from "axios";
import CreateCommonAreaForm from "../../components/admin/CreateCommonAreaForm";
import { useAuth } from "../../contexts/AuthContext";

const CommonAreasPage = () => {
  const { trialExpired } = useAuth();
  const [commonAreas, setCommonAreas] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  const fetchCommonAreas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/common-areas/all`, {
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

  const fetchBuildings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/buildings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuildings(res.data);
    } catch (err) {
      console.error("Error al cargar edificios:", err);
    }
  };

  useEffect(() => {
    fetchBuildings();
    fetchCommonAreas();
  }, []);

  const handleCreatedOrUpdated = () => {
    fetchCommonAreas();
    setShowForm(false);
    setEditingArea(null);
  };

  const handleEdit = (area) => {
    if (trialExpired) {
      alert("Tu prueba gratuita ha finalizado. Por favor, contrata un plan para continuar.");
      return;
    }
    setEditingArea(area);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
  if (trialExpired) {
    alert("Tu prueba gratuita ha finalizado. Por favor, contrata un plan para continuar.");
    return;
  }

  const confirm = window.confirm("¿Seguro que querés eliminar esta área?");
  if (!confirm) return;

  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${import.meta.env.VITE_API_URL}/common-areas/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchCommonAreas();
  } catch (err) {
    
    const mensaje = err?.response?.data || "Error al eliminar el área.";
    alert(mensaje);
  }
};


  return (
    <div className="p-4 max-w-4xl mx-auto text-sm">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Áreas Comunes</h1>

      <button
        onClick={() => {
          if (trialExpired) {
            alert("Tu prueba gratuita ha finalizado. Por favor, contrata un plan para continuar.");
            return;
          }
          setShowForm((prev) => !prev);
          setEditingArea(null);
        }}
        className={`mb-6 px-4 py-2 rounded-xl font-medium text-white text-sm transition-all shadow-md
          ${trialExpired ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"}`}
        disabled={trialExpired}
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
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {error && <p className="text-red-600 font-semibold text-center">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-4">
          {commonAreas.map((area) => {
            const building = buildings.find(b => String(b.id) === String(area.buildingId));
            return (
              <li
                key={area.id}
                className="p-4 border rounded-md shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="max-w-full md:max-w-[70%] space-y-1">
                  <h2 className="text-lg font-semibold text-gray-800">{area.name}</h2>
                  <p className="text-gray-700">{area.description}</p>
                  <p className="text-xs text-gray-500">Capacidad: {area.capacity ?? "No especificada"}</p>
                  <p className="text-xs text-gray-500">
                    <strong>Edificio:</strong> {building ? building.name : "No asignado"}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 min-w-[120px]">
                  <button
                    onClick={() => handleEdit(area)}
                    className={`px-3 py-1.5 text-sm text-white rounded-xl transition-all shadow
                      ${trialExpired ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"}`}
                    disabled={trialExpired}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(area.id)}
                    className={`px-3 py-1.5 text-sm text-white rounded-xl transition-all shadow
                      ${trialExpired ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                    disabled={trialExpired}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CommonAreasPage;
