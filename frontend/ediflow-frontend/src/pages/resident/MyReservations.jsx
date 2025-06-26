import React, { useEffect, useState } from "react";
import { useReservations } from "../../contexts/ReservationsContext";
import ReservationForm from "../../components/admin/ReservationForm"; // Ajustá el path si es necesario

const MyReservations = () => {
  const {
    reservations,
    loading,
    error,
    deleteReservation,
    loadingDelete,
    errorDelete,
    refreshReservations,
  } = useReservations();

  const [showForm, setShowForm] = useState(false);

  // Función para eliminar reservas pasadas (fecha + hora inicio)
  const removePastReservations = async () => {
    const now = new Date();

    const pastReservations = reservations.filter((res) => {
      const reservationDateTime = new Date(`${res.date}T${res.startTime}`);
      return reservationDateTime < now; // Comparación estricta: fecha y hora inicio ya pasó
    });

    for (const res of pastReservations) {
      await deleteReservation(res.id);
    }

    if (pastReservations.length > 0) {
      await refreshReservations();
    }
  };

  useEffect(() => {
    if (reservations && reservations.length > 0) {
      removePastReservations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservations]);

  const handleCancel = async (id) => {
    const confirmed = window.confirm("¿Querés cancelar esta reserva?");
    if (!confirmed) return;

    const success = await deleteReservation(id);
    if (!success) alert("No se pudo cancelar la reserva");
  };

  const handleSuccess = () => {
    setShowForm(false);
    refreshReservations();
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Cargando tus reservas...</p>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Error: {error}</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis Reservas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-md shadow-md transition"
        >
          {showForm ? "Cancelar" : "Nueva Reserva"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <ReservationForm onSuccess={handleSuccess} />
        </div>
      )}

      {reservations?.length === 0 ? (
        <p className="text-gray-600">No tenés reservas activas.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((res) => (
            <li
              key={res.id}
              className="bg-gray-50 rounded-lg shadow-sm p-5 border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-gray-700 font-semibold mb-1">
                  Área común:{" "}
                  <span className="text-blue-600">
                    {res.commonAreaName || "Nombre no disponible"}
                  </span>
                </p>
                <p className="text-gray-600 mb-1">
                  Fecha:{" "}
                  <time dateTime={res.date}>
                    {new Date(res.date).toLocaleDateString()}
                  </time>
                </p>
                <p className="text-gray-600">
                  Horario: {res.startTime} - {res.endTime}
                </p>
              </div>
              <button
                onClick={() => handleCancel(res.id)}
                disabled={loadingDelete}
                className={`ml-6 rounded-md px-4 py-2 font-semibold text-white shadow-md transition-colors ${
                  loadingDelete
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loadingDelete ? "Cancelando..." : "Cancelar"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {errorDelete && (
        <p className="mt-4 text-red-500 font-semibold">
          Error al cancelar: {errorDelete}
        </p>
      )}
    </div>
  );
};

export default MyReservations;
