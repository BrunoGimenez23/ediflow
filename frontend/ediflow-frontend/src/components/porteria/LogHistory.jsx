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
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6 max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-gray-700">
        {userRole === "PORTER" ? "Tus registros" : "Historial del edificio"}
      </h2>

      {/* Select de edificio solo para admin */}
      {userRole === "ADMIN" && buildings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <label className="font-medium">Seleccionar edificio:</label>
          <select
            value={selectedBuildingId}
            onChange={(e) => setSelectedBuildingId(e.target.value)}
            className="border rounded p-2 w-full sm:w-auto"
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

      {/* Filtro por tipo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <label className="font-medium">Filtrar por tipo:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded p-2 w-full sm:w-auto"
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
        <>
          {/* Tabla para desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["Tipo", "Descripción", "Residente", "Registrado por", "Fecha"].map((h) => (
                    <th key={h} className="p-3 border-b text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-2 border-b">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          e.type === "PAQUETE"
                            ? "bg-blue-100 text-blue-800"
                            : e.type === "VISITA"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {e.type}
                      </span>
                    </td>
                    <td className="p-2 border-b">{e.description}</td>
                    <td className="p-2 border-b">{e.residentName || "N/A"}</td>
                    <td className="p-2 border-b">{e.createdByName || "Portería"}</td>
                    <td className="p-2 border-b">{new Date(e.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas para mobile */}
          <div className="md:hidden flex flex-col gap-4">
            {entries.map((e) => (
              <div
                key={e.id}
                className="border rounded-lg p-4 shadow-sm bg-white space-y-2 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      e.type === "PAQUETE"
                        ? "bg-blue-100 text-blue-800"
                        : e.type === "VISITA"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {e.type}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(e.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{e.description}</p>
                <div className="flex flex-col text-sm text-gray-600">
                  <span>Residente: {e.residentName || "N/A"}</span>
                  <span>Registrado por: {e.createdByName || "Portería"}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LogHistory;
