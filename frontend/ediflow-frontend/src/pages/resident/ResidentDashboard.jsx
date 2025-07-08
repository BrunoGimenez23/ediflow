import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useResidentContext } from "../../contexts/ResidentContext";
import { useNavigate } from "react-router-dom";
import { CreditCard, CalendarDays, LogOut } from "lucide-react";

const ResidentDashboard = () => {
  const { user, logout } = useAuth();
  const { resident, loading, error } = useResidentContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login"); // Ajusta la ruta si tu login está en otra URL
  };

  if (!user) return <p className="text-center text-gray-600 mt-12">Cargando datos del usuario...</p>;
  if (loading) return <p className="text-center text-gray-600 mt-12">Cargando datos del residente...</p>;
  if (error) return <p className="text-center text-red-500 mt-12">Error al cargar datos: {error}</p>;

  const apartmentInfo = resident?.apartmentDTO || {};

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          ¡Hola, <span className="text-blue-600">{user.fullName || user.username}</span>!
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md shadow-md transition"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </button>
      </header>

      {/* Apartamento info */}
      <section className="mb-12 p-6 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b border-gray-300 pb-2">Tu Apartamento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-gray-700">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase mb-1">Número</p>
            <p className="text-xl font-semibold">{apartmentInfo.number || "No asignado"}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase mb-1">Piso</p>
            <p className="text-xl font-semibold">{apartmentInfo.floor || "-"}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase mb-1">Edificio</p>
            <p className="text-xl font-semibold">{apartmentInfo.buildingDTO?.name || "-"}</p>
          </div>
        </div>
      </section>

      {/* Accesos rápidos a pagos y reservas */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b border-gray-300 pb-2">Accesos rápidos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => navigate("/mis-pagos")}
            className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors p-6 rounded-xl shadow-md flex items-center gap-4"
          >
            <CreditCard className="text-ediblue w-8 h-8" />
            <div>
              <p className="text-xl font-semibold text-gray-800">Ver Pagos</p>
              <p className="text-sm text-gray-500">Consultá tus pagos mensuales</p>
            </div>
          </div>

          <div
            onClick={() => navigate("/mis-reservas")}
            className="cursor-pointer bg-green-50 hover:bg-green-100 transition-colors p-6 rounded-xl shadow-md flex items-center gap-4"
          >
            <CalendarDays className="text-edigreen w-8 h-8" />
            <div>
              <p className="text-xl font-semibold text-gray-800">Ver Reservas</p>
              <p className="text-sm text-gray-500">Revisá o gestioná tus reservas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResidentDashboard;
