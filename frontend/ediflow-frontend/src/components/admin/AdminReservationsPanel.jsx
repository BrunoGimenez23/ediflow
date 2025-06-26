// src/components/admin/AdminReservationsPanel.jsx
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useReservationsByBuildingAndDate } from "../../hooks/useReservationsByBuildingAndDate";
import { useReservations } from "../../contexts/ReservationsContext";

const AdminReservationsPanel = () => {
  const { deleteReservation, loadingDelete } = useReservations();

  const [buildingId, setBuildingId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Cargar edificios
  const { data: buildings, loading: loadingBuildings } = useFetch("/buildings");

  // Cargar reservas por edificio y fecha
  const {
    reservations,
    loading: loadingReservations,
    error,
  } = useReservationsByBuildingAndDate(buildingId, selectedDate);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de cancelar esta reserva?");
    if (!confirmed) return;
    await deleteReservation(id);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Reservas por Edificio</h1>

      {/* Select edificio */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Edificio</label>
        <select
          value={buildingId}
          onChange={(e) => setBuildingId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Selecciona un edificio</option>
          {buildings?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Input fecha */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Fecha</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {loadingReservations ? (
        <p className="text-gray-500">Cargando reservas...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-600">No hay reservas para esta fecha.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((res) => (
            <li
              key={res.id}
              className="bg-gray-100 border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-blue-600">{res.commonAreaName}</p>
                <p className="text-gray-700">
                  Horario: {res.startTime} - {res.endTime}
                </p>
                <p className="text-gray-500 text-sm">Residente: {res.residentFullName || "Sin nombre"}</p>
              </div>
              <button
                onClick={() => handleDelete(res.id)}
                disabled={loadingDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
              >
                {loadingDelete ? "Eliminando..." : "Cancelar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReservationsPanel;
