import React, { useEffect, useState } from "react";
import { useReservations } from "../../contexts/ReservationsContext";
import ReservationForm from "../../components/admin/ReservationForm";
import { useNavigate } from "react-router-dom";

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
  const [localReservations, setLocalReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalReservations(reservations || []);
  }, [reservations]);

  const removePastReservations = async () => {
    const now = new Date();

    const pastReservations = localReservations.filter((res) => {
      const reservationDateTime = new Date(`${res.date}T${res.startTime}`);
      return reservationDateTime < now;
    });

    if (pastReservations.length > 0) {
      await Promise.all(pastReservations.map((res) => deleteReservation(res.id)));
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
    if (success) {
      setLocalReservations((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("No se pudo cancelar la reserva");
    }
  };

  const handleSuccess = (newReservation) => {
    setLocalReservations((prev) => [newReservation, ...prev]);
    setShowForm(false);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Cargando tus reservas...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Error: {error}
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
    <button
  onClick={() => navigate(-1)}
  className="text-sm bg-ediblue hover:bg-ediblue/90 text-white py-2 px-4 rounded-md shadow-sm transition"
>
  ← Volver
</button>
        <h1 className="text-3xl font-bold text-gray-800">Mis Reservas</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-semibold py-2 px-6 rounded-md shadow-md transition"
          title={showForm ? "Cancelar creación de reserva" : "Crear nueva reserva"}
          aria-expanded={showForm}
          aria-controls="reservation-form"
        >
          {showForm ? "Cancelar" : "Nueva Reserva"}
        </button>
      </div>

      {showForm && (
        <div
          id="reservation-form"
          className="mb-8 bg-gray-50 p-6 rounded-lg shadow-inner transition-opacity duration-300 ease-in-out"
        >
          <ReservationForm onSuccess={handleSuccess} />
        </div>
      )}

      {localReservations?.length === 0 ? (
        <p className="text-center text-gray-600 italic mt-12">
          No tenés reservas activas.
        </p>
      ) : (
        <ul className="space-y-4">
          {localReservations.map((res) => (
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
                title="Cancelar esta reserva"
              >
                {loadingDelete ? (
                  <>
                    Cancelando...
                    <span className="ml-2 animate-spin inline-block border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                  </>
                ) : (
                  "Cancelar"
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {errorDelete && (
        <p className="mt-4 text-red-500 font-semibold text-center">
          Error al cancelar: {errorDelete}
        </p>
      )}
    </div>
  );
};

export default MyReservations;
