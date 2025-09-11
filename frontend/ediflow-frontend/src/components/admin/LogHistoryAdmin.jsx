import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useBuildingsContext } from "../../contexts/BuildingContext";

const LogHistoryAdmin = () => {
  const { token } = useAuth();
  const { selectedBuilding } = useBuildingsContext();
  const [entries, setEntries] = useState([]);
  const [filterType, setFilterType] = useState("");

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const loadEntries = async () => {
    if (!selectedBuilding?.id) return;

    try {
      let url = `${BACKEND_URL}/log-entries/building/${selectedBuilding.id}`;
      if (filterType) url += `?type=${filterType}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error cargando historial");

      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando historial");
    }
  };

  useEffect(() => {
    loadEntries();
  }, [selectedBuilding, filterType, token]);

  return (
    <div className="bg-white rounded shadow p-4 space-y-4 max-w-5xl mx-auto mt-6">
      <h2 className="text-lg font-semibold">Historial del edificio: {selectedBuilding?.name}</h2>

      <div className="flex items-center gap-4 mb-4">
        <label className="font-medium">Filtrar por tipo:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Todos</option>
          <option value="PAQUETE">Paquetes</option>
          <option value="VISITA">Visitas</option>
          <option value="OTRO">Otros</option>
        </select>
      </div>

      {entries.length === 0 ? (
        <p className="text-gray-500">No hay registros.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Descripción</th>
              <th className="p-2 border">Residente</th>
              <th className="p-2 border">Registrado por</th>
              <th className="p-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="p-2 border">{e.type}</td>
                <td className="p-2 border">{e.description}</td>
                <td className="p-2 border">{e.residentName || "N/A"}</td>
                <td className="p-2 border">{e.createdByName || "Portería"}</td>
                <td className="p-2 border">{new Date(e.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LogHistoryAdmin;
