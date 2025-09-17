import React, { useEffect, useState } from "react";
import { useTicketAPI } from "../../hooks/useTicketAPI";
import { useAuth } from "../../contexts/AuthContext";
import { useBuildingsContext } from "../../contexts/BuildingContext";
import { ClipboardList, Plus, Home, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TicketDashboard = () => {
  const { user } = useAuth();
  const { createTicket, getTicketsByBuilding, updateTicketStatus } = useTicketAPI();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [type, setType] = useState("NOTICE"); // solo Admin
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const {
    buildings,
    selectedBuilding,
    setSelectedBuilding,
    loading: loadingBuildings,
    error: errorBuildings,
  } = useBuildingsContext();

  // Por defecto seleccionamos el primer edificio si es admin y no hay seleccionado
  useEffect(() => {
    if (user?.role === "ADMIN" && buildings.length > 0 && !selectedBuilding) {
      setSelectedBuilding(buildings[0]);
    }
  }, [buildings, user, selectedBuilding, setSelectedBuilding]);

  const fetchTickets = async () => {
    if (!user) return;
    if (user.role === "ADMIN" && !selectedBuilding) return; // espera a que el admin seleccione un edificio

    const buildingIdToFetch =
      user.role === "ADMIN" ? selectedBuilding.id : user.buildingId || selectedBuilding?.id;

    if (!buildingIdToFetch) return;

    setLoadingTickets(true);
    try {
      const data = await getTicketsByBuilding(buildingIdToFetch);

      let filtered;
      if (user.role === "RESIDENT") {
        // Resident ve solo sus tickets y avisos
        filtered = data.filter(t => t.type === "NOTICE" || t.createdById === user.id);
      } else if (user.role === "ADMIN") {
  // Admin ve todos los avisos y todos los reclamos de residentes
  filtered = data.filter(
    (t) => t.type === "NOTICE" || t.type === "COMPLAINT"
  );
} else {
        filtered = data;
      }

      setTickets(filtered);
    } catch (err) {
      console.error("Error al cargar tickets", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
  fetchTickets();
}, [selectedBuilding?.id, user]);

  const handleCreate = async () => {
    if (!title || !description) return;

    const ticket = {
      title,
      description,
      type: user.role === "RESIDENT" ? "COMPLAINT" : type,
      priority,
      buildingId: user.role === "ADMIN" ? selectedBuilding?.id : user.buildingId,
      createdById: user.id,
    };

    try {
      const newTicket = await createTicket(ticket);
      setTickets(prev => [newTicket, ...prev]);
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setType("NOTICE");
      setShowForm(false);
    } catch (err) {
      console.error("Error al crear ticket", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (user.role !== "ADMIN") return;
    try {
      const updated = await updateTicketStatus(id, newStatus);
      setTickets(prev =>
        prev.map(t => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      console.error("Error al actualizar estado", err);
    }
  };

  const priorityLabel = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta" };
  const statusLabel = { PENDING: "Pendiente", IN_PROGRESS: "En progreso", RESOLVED: "Resuelto" };
  const priorityColor = (p) =>
    p === "HIGH" ? "bg-red-200" : p === "MEDIUM" ? "bg-yellow-200" : "bg-green-200";
  const statusColor = (s) =>
    s === "PENDING" ? "bg-gray-200" : s === "IN_PROGRESS" ? "bg-blue-200" : "bg-green-200";
  const typeTagColor = (t) =>
    t === "NOTICE" ? "bg-purple-200 text-purple-800" : "bg-red-200 text-red-800";

  const filteredTickets =
    filter === "ALL"
      ? tickets
      : tickets.filter((t) => t.type === filter);

  if (!user) return <p className="text-center p-6">Cargando usuario...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-purple-600" />
          Avisos y Reclamos
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            Crear
          </button>
          <button
            onClick={() => navigate("/resident")}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>

      {user.role === "ADMIN" && (
        <div className="mb-4">
          <select
            value={selectedBuilding?.id || ""}
            onChange={(e) => {
              const b = buildings.find(b => b.id === Number(e.target.value));
              setSelectedBuilding(b);
            }}
            className="border p-2 rounded w-full"
          >
            <option value="" disabled>Seleccione un edificio</option>
            {buildings.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} - {b.address}
              </option>
            ))}
          </select>
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl shadow-inner">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
            rows={3}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 mb-2 rounded w-full"
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>

          {user.role === "ADMIN" && (
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border p-2 mb-2 rounded w-full"
            >
              <option value="NOTICE">Aviso</option>
              <option value="COMPLAINT">Reclamo</option>
            </select>
          )}

          <button
            onClick={handleCreate}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Crear {user.role === "RESIDENT" ? "Reclamo" : type === "NOTICE" ? "Aviso" : "Reclamo"}
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1 rounded ${filter === "ALL" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("NOTICE")}
          className={`px-3 py-1 rounded ${filter === "NOTICE" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
        >
          Avisos
        </button>
        <button
          onClick={() => setFilter("COMPLAINT")}
          className={`px-3 py-1 rounded ${filter === "COMPLAINT" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
        >
          Reclamos
        </button>
      </div>

      <div>
        {(loadingTickets || loadingBuildings) ? (
          <p>Cargando tickets...</p>
        ) : filteredTickets.length === 0 ? (
          <p>No hay tickets aún.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Título</th>
                <th className="border p-2">Descripción</th>
                <th className="border p-2">Tipo</th>
                <th className="border p-2">Prioridad</th>
                <th className="border p-2">Estado</th>
                {user.role === "ADMIN" && <th className="border p-2">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t) => (
                <tr key={t.id}>
                  <td className="border p-2">{t.title}</td>
                  <td className="border p-2">{t.description}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${typeTagColor(t.type)}`}>
                      {t.type === "NOTICE" ? "Aviso" : "Reclamo"}
                    </span>
                  </td>
                  <td className={`border p-2 font-semibold ${priorityColor(t.priority)}`}>
                    {priorityLabel[t.priority]}
                  </td>
                  <td className={`border p-2 font-semibold ${statusColor(t.status)}`}>
                    {statusLabel[t.status]}
                  </td>
                  {user.role === "ADMIN" && (
                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => handleStatusChange(t.id, "IN_PROGRESS")}
                        className="bg-blue-500 px-2 py-1 rounded text-white"
                      >
                        En progreso
                      </button>
                      <button
                        onClick={() => handleStatusChange(t.id, "RESOLVED")}
                        className="bg-green-600 px-2 py-1 rounded text-white"
                      >
                        Resuelto
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TicketDashboard;
