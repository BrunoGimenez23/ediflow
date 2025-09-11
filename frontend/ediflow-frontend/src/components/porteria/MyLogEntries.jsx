import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResidentContext } from "../../contexts/ResidentContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MyLogEntries = () => {
  const { token } = useAuth();
  const { resident, loading, error } = useResidentContext();
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  // URL del backend desde variable de entorno
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!resident?.id) return;

    console.log("Resident ID detectado:", resident.id);

    fetch(`${BACKEND_URL}/log-entries/resident/${resident.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar registros");
        return res.json();
      })
      .then((data) => {
        // Filtramos solo paquetes o visitas
        const filtered = data.filter(
          (e) => e.type === "PAQUETE" || e.type === "VISITA"
        );
        setEntries(filtered);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error cargando registros");
      });
  }, [resident, token, BACKEND_URL]);

  if (loading)
    return <p className="text-gray-600 text-center mt-8">Cargando registros...</p>;
  if (error)
    return <p className="text-red-500 text-center mt-8">Error al cargar residente: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
      {/* Botón volver */}
      <button
        onClick={() => navigate("/resident")}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tus Paquetes y Visitas</h2>

      {entries.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No tenés registros todavía.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((e) => (
            <li
              key={e.id}
              className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg shadow-sm hover:bg-blue-100 transition"
            >
              <p className="font-semibold text-gray-700">
                Tipo: <span className="text-blue-600">{e.type}</span>
              </p>
              <p className="text-gray-700">{e.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Registrado por: {e.createdByName || "Portería"} -{" "}
                {new Date(e.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyLogEntries;
