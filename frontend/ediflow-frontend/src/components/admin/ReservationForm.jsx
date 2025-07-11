import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import usePost from "../../hooks/usePost";
import { useReservationsByAreaDate } from "../../hooks/useReservationsByAreaDate";

const ReservationForm = ({ onSuccess }) => {
  const { data: commonAreas, loading: loadingAreas, error: errorAreas } =
    useFetch("/reservations/common-areas/user");

  const [form, setForm] = useState({
    commonAreaId: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const {
    reservations: existingReservations,
    loading: loadingExisting,
    error: errorExisting,
  } = useReservationsByAreaDate(form.commonAreaId, form.date);

  const { post, loading: posting, error: postError } = usePost();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.commonAreaId || !form.date || !form.startTime || !form.endTime) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (form.endTime <= form.startTime) {
      alert("La hora de fin debe ser mayor que la hora de inicio.");
      return;
    }

    if (existingReservations && existingReservations.length > 0) {
      const conflict = existingReservations.some((res) =>
        isOverlap(form.startTime, form.endTime, res.startTime, res.endTime)
      );
      if (conflict) {
        alert("El horario seleccionado se superpone con una reserva existente.");
        return;
      }
    }

    const payload = {
      commonAreaId: Number(form.commonAreaId),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
    };

    const res = await post("/reservations/create", payload);
    if (res) {
      const commonArea = commonAreas?.find(
        (area) => area.id === Number(form.commonAreaId)
      );

      const fullReservation = {
        ...res,
        id: res.id || `temp-${Date.now()}`,
        commonAreaName: commonArea?.name || "Nombre no disponible",
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
      };

      if (onSuccess) onSuccess(fullReservation);
      setForm({ commonAreaId: "", date: "", startTime: "", endTime: "" });
      alert("Reserva creada con éxito!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        Reservar Área Común
      </h2>

      {/* Área común */}
      <div>
        <label htmlFor="commonAreaId" className="block mb-1 font-medium text-gray-700">
          Área Común
        </label>
        {loadingAreas ? (
          <p className="text-gray-500">Cargando áreas comunes...</p>
        ) : errorAreas ? (
          <p className="text-red-500">Error al cargar áreas: {errorAreas}</p>
        ) : (
          <select
            id="commonAreaId"
            name="commonAreaId"
            value={form.commonAreaId}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona un área</option>
            {commonAreas?.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Fecha */}
      <div>
        <label htmlFor="date" className="block mb-1 font-medium text-gray-700">Fecha</label>
        <input
          type="date"
          id="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Hora inicio y fin */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block mb-1 font-medium text-gray-700">Hora Inicio</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block mb-1 font-medium text-gray-700">Hora Fin</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Reservas existentes */}
      {loadingExisting && <p className="text-gray-500">Cargando reservas existentes...</p>}
      {errorExisting && <p className="text-red-500">Error al cargar reservas: {errorExisting}</p>}
      {existingReservations && existingReservations.length > 0 && (
        <div className="bg-gray-100 p-3 rounded border border-gray-300">
          <p className="font-semibold mb-2">Horarios ya reservados en esta fecha:</p>
          <ul className="list-disc list-inside text-gray-700">
            {existingReservations.map((res) => (
              <li key={res.id}>{res.startTime} - {res.endTime}</li>
            ))}
          </ul>
        </div>
      )}
      {existingReservations && existingReservations.length === 0 && form.commonAreaId && form.date && (
        <p className="text-green-600 font-medium">
          No hay reservas para esta fecha. ¡Podés reservar tranquilo!
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={posting}
        className={`w-full py-3 rounded-md text-white font-semibold transition ${
          posting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {posting ? "Reservando..." : "Reservar"}
      </button>

      {postError && <p className="text-red-600 mt-2">{postError}</p>}
    </form>
  );
};

export default ReservationForm;
