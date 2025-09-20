import React, { useEffect, useState, useMemo } from "react";
import { useTicketAPI } from "../../hooks/useTicketAPI";
import { useAuth } from "../../contexts/AuthContext";
import { useBuildingsContext } from "../../contexts/BuildingContext";
import { ClipboardList, Plus, Home, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const TicketDashboard = () => {
  const { user } = useAuth();
  const { createTicket, getTicketsByBuilding, updateTicketStatus, deleteTicket } = useTicketAPI();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [type, setType] = useState("NOTICE");
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [loadingButton, setLoadingButton] = useState(false);

  const {
    buildings,
    selectedBuilding,
    setSelectedBuilding,
    loading: loadingBuildings,
  } = useBuildingsContext();

  useEffect(() => {
    if (user?.role === "ADMIN" && buildings.length > 0 && !selectedBuilding) {
      setSelectedBuilding(buildings[0]);
    }
  }, [buildings, user, selectedBuilding, setSelectedBuilding]);

  const fetchTickets = async () => {
    if (!user) return;
    if (user.role === "ADMIN" && !selectedBuilding) return;

    const buildingIdToFetch =
      user.role === "ADMIN" ? selectedBuilding.id : user.buildingId || selectedBuilding?.id;

    if (!buildingIdToFetch) return;

    setLoadingTickets(true);
    try {
      const data = await getTicketsByBuilding(buildingIdToFetch);

      let filtered;
      if (user.role === "RESIDENT") {
        filtered = data.filter(t => t.type === "NOTICE" || t.createdById === user.id);
      } else if (user.role === "ADMIN") {
        filtered = data.filter(t => t.type === "NOTICE" || t.type === "COMPLAINT");
      } else {
        filtered = data;
      }

      setTickets(filtered);
    } catch (err) {
      console.error("Error al cargar tickets", err);
      toast.error("Error al cargar tickets");
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedBuilding?.id, user]);

  const handleCreate = async () => {
    if (!title || !description) {
      toast.error("Debe completar título y descripción");
      return;
    }

    const ticket = {
      title,
      description,
      type: user.role === "RESIDENT" ? "COMPLAINT" : type,
      priority,
      buildingId: user.role === "ADMIN" ? selectedBuilding?.id : user.buildingId,
      createdById: user.id,
    };

    try {
      setLoadingButton(true);
      const newTicket = await createTicket(ticket);
      setTickets(prev => [newTicket, ...prev]);
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setType("NOTICE");
      setShowForm(false);
      toast.success("Ticket creado con éxito");
    } catch (err) {
      console.error("Error al crear ticket", err);
      toast.error("Error al crear ticket");
    } finally {
      setLoadingButton(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (user.role !== "ADMIN") return;
    try {
      setLoadingButton(true);
      const updated = await updateTicketStatus(id, newStatus);
      setTickets(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      toast.success(`Estado actualizado a ${newStatus}`);
    } catch (err) {
      console.error("Error al actualizar estado", err);
      toast.error("Error al actualizar estado");
    } finally {
      setLoadingButton(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingButton(true);
      await deleteTicket(id);
      fetchTickets();
      toast.success("Ticket eliminado");
    } catch (err) {
      console.error("Error al eliminar ticket", err);
      toast.error("Error al eliminar ticket");
    } finally {
      setLoadingButton(false);
    }
  };

  const priorityLabel = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta" };
  const statusLabel = { PENDING: "Pendiente", IN_PROGRESS: "En progreso", RESOLVED: "Resuelto" };
  const priorityColor = (p) =>
    p === "HIGH" ? "bg-red-200 text-red-700" : p === "MEDIUM" ? "bg-yellow-200 text-yellow-700" : "bg-green-200 text-green-700";
  const statusColor = (s) =>
    s === "PENDING" ? "bg-gray-200 text-gray-700" : s === "IN_PROGRESS" ? "bg-blue-200 text-blue-700" : "bg-green-200 text-green-700";
  const typeTagColor = (t) =>
    t === "NOTICE" ? "bg-purple-200 text-purple-800" : "bg-red-200 text-red-800";

  const filteredTickets = filter === "ALL" ? tickets : tickets.filter((t) => t.type === filter);

  // Ordenamiento simple por prioridad, estado, fecha
  const sortedTickets = useMemo(() => {
    return [...filteredTickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [filteredTickets]);

  if (!user) return <p className="text-center p-6">Cargando usuario...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-purple-700">
          <ClipboardList className="w-6 h-6" />
          Avisos y Reclamos
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={loadingButton}
            className={`flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50`}
          >
            <Plus className="w-4 h-4" />
            {loadingButton ? "Cargando..." : "Crear"}
          </button>
          {user.role === "RESIDENT" && (
            <button
              onClick={() => navigate("/resident")}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Selector de edificio */}
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

      {/* Formulario */}
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
            disabled={loadingButton}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 w-full disabled:opacity-50"
          >
            {loadingButton ? "Cargando..." : `Crear ${user.role === "RESIDENT" ? "Reclamo" : type === "NOTICE" ? "Aviso" : "Reclamo"}`}
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-5 h-5 text-gray-600" />
        {["ALL", "NOTICE", "COMPLAINT"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg ${filter === f ? "bg-purple-600 text-white" : "bg-gray-200"}`}
          >
            {f === "ALL" ? "Todos" : f === "NOTICE" ? "Avisos" : "Reclamos"}
          </button>
        ))}
      </div>

      {/* Tickets */}
      <div>
        {(loadingTickets || loadingBuildings) ? (
          <p>Cargando tickets...</p>
        ) : sortedTickets.length === 0 ? (
          <p>No hay tickets aún.</p>
        ) : (
          <>
            {/* Desktop → tabla */}
            <div className="hidden md:block overflow-x-auto rounded-lg border">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 cursor-pointer">Título</th>
                    <th className="p-3">Descripción</th>
                    <th className="p-3 cursor-pointer">Tipo</th>
                    <th className="p-3 cursor-pointer">Prioridad</th>
                    <th className="p-3 cursor-pointer">Estado</th>
                    <th className="p-3 cursor-pointer">Fecha</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTickets.map((t) => (
                    <tr key={t.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{t.title}</td>
                      <td className="p-3">{t.description}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${typeTagColor(t.type)}`}>
                          {t.type === "NOTICE" ? "Aviso" : "Reclamo"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${priorityColor(t.priority)}`}>
                          {priorityLabel[t.priority]}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${statusColor(t.status)}`}>
                          {statusLabel[t.status]}
                        </span>
                      </td>
                      <td className="p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 flex flex-wrap gap-2">
                        {user.role === "ADMIN" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(t.id, "IN_PROGRESS")}
                              disabled={loadingButton}
                              className="bg-blue-500 px-2 py-1 rounded text-white text-sm hover:bg-blue-600 disabled:opacity-50"
                            >
                              En progreso
                            </button>
                            <button
                              onClick={() => handleStatusChange(t.id, "RESOLVED")}
                              disabled={loadingButton}
                              className="bg-green-600 px-2 py-1 rounded text-white text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              Resuelto
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
                              disabled={loadingButton}
                              className="bg-red-500 px-2 py-1 rounded text-white text-sm hover:bg-red-600 disabled:opacity-50"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                        {user.role === "RESIDENT" && t.type === "COMPLAINT" && t.createdById === user.id && (
                          <button
                            onClick={() => handleDelete(t.id)}
                            disabled={loadingButton}
                            className="bg-red-500 px-2 py-1 rounded text-white text-sm hover:bg-red-600 disabled:opacity-50"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile → tarjetas */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {sortedTickets.map((t) => (
                <div key={t.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <h3 className="text-lg font-bold text-purple-700">{t.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{t.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${typeTagColor(t.type)}`}>
                      {t.type === "NOTICE" ? "Aviso" : "Reclamo"}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColor(t.priority)}`}>
                      {priorityLabel[t.priority]}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(t.status)}`}>
                      {statusLabel[t.status]}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-700">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.role === "ADMIN" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(t.id, "IN_PROGRESS")}
                          disabled={loadingButton}
                          className="bg-blue-500 px-2 py-1 rounded text-white text-sm hover:bg-blue-600 disabled:opacity-50"
                        >
                          En progreso
                        </button>
                        <button
                          onClick={() => handleStatusChange(t.id, "RESOLVED")}
                          disabled={loadingButton}
                          className="bg-green-600 px-2 py-1 rounded text-white text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          Resuelto
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={loadingButton}
                          className="bg-red-500 px-2 py-1 rounded text-white text-sm hover:bg-red-600 disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                    {user.role === "RESIDENT" && t.type === "COMPLAINT" && t.createdById === user.id && (
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={loadingButton}
                        className="bg-red-500 px-2 py-1 rounded text-white text-sm hover:bg-red-600 disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketDashboard;
