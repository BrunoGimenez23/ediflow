import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useBuildingsContext } from "../../contexts/BuildingContext"; // para traer edificios

const LogHistory = ({ buildingId: propBuildingId, userRole }) => {
  const { token } = useAuth();
  const { buildings = [] } = useBuildingsContext();
  const [selectedBuildingId, setSelectedBuildingId] = useState(propBuildingId || "");
  const [entries, setEntries] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(false);

  // Carga el historial
  const loadEntries = async () => {
    if (!selectedBuildingId) return;
    setLoading(true);

    try {
      const url = new URL(
        `${import.meta.env.VITE_API_URL}/log-entries/building/${selectedBuildingId}`
      );
      if (filterType) url.searchParams.append("type", filterType);

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        toast.error("No tenés permiso para ver este edificio");
        setEntries([]);
        return;
      }

      if (!res.ok) throw new Error("Error cargando historial");

      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando historial");
    } finally {
      setLoading(false);
    }
  };

  // Si cambia el edificio o el filtro, recarga
  useEffect(() => {
    loadEntries();
  }, [selectedBuildingId, filterType]);

  return (
    <div className="bg-white rounded shadow p-4 space-y-4 max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-gray-700">
        {userRole === "PORTER" ? "Tus registros" : "Historial del edificio"}
      </h2>

      {/* Select de edificio solo para admin */}
      {userRole === "ADMIN" && buildings.length > 0 && (
        <div className="flex items-center gap-4 mb-4">
          <label className="font-medium">Seleccionar edificio:</label>
          <select
            value={selectedBuildingId}
            onChange={(e) => setSelectedBuildingId(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">-- Elegir edificio --</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} - {b.address}
              </option>
            ))}
          </select>
        </div>
      )}

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

      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-500 mt-2">No hay registros.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border mt-2">
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
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{e.type}</td>
                  <td className="p-2 border">{e.description}</td>
                  <td className="p-2 border">{e.residentName || "N/A"}</td>
                  <td className="p-2 border">{e.createdByName || "Portería"}</td>
                  <td className="p-2 border">{new Date(e.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogHistory;
