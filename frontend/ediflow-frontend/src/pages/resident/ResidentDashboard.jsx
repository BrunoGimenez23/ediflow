import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useResidentContext } from "../../contexts/ResidentContext";
import { useNavigate } from "react-router-dom";
import { CreditCard, CalendarDays, LogOut, Package, ClipboardList } from "lucide-react";

const ResidentDashboard = () => {
  const { user, logout } = useAuth();
  const { resident, loading, error } = useResidentContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  if (!user) return <p className="text-center text-gray-600 mt-12">Cargando datos del usuario...</p>;
  if (loading) return <p className="text-center text-gray-600 mt-12">Cargando datos del residente...</p>;
  if (error) return <p className="text-center text-red-500 mt-12">Error al cargar datos: {error}</p>;

  const apartmentInfo = resident?.apartmentDTO || {};

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-12">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          ¡Hola, <span className="text-blue-600">{user.fullName || user.username}</span>!
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </button>
      </header>

      {/* Apartamento info */}
      <section className="mb-12 p-6 bg-gray-50 rounded-xl shadow-inner">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b border-gray-300 pb-2">Tu Apartamento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm font-medium text-gray-500 uppercase mb-1">Número</p>
            <p className="text-xl font-semibold">{apartmentInfo.number || "No asignado"}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm font-medium text-gray-500 uppercase mb-1">Piso</p>
            <p className="text-xl font-semibold">{apartmentInfo.floor || "-"}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-sm font-medium text-gray-500 uppercase mb-1">Edificio</p>
            <p className="text-xl font-semibold">{apartmentInfo.buildingDTO?.name || "-"}</p>
          </div>
        </div>
      </section>

      {/* Accesos rápidos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b border-gray-300 pb-2">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Paquetes y visitas */}
          <div
            onClick={() => navigate("/mis-registros")}
            className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors p-6 rounded-2xl shadow-md flex items-center gap-4"
          >
            <Package className="text-blue-600 w-10 h-10" />
            <div>
              <p className="text-xl font-semibold text-gray-800">Paquetes/Visitas</p>
              <p className="text-sm text-gray-500">Revisá tus paquetes o visitas registradas</p>
            </div>
          </div>

          {/* Mis reservas */}
          <div
            onClick={() => navigate("/mis-reservas")}
            className="cursor-pointer bg-green-50 hover:bg-green-100 transition-colors p-6 rounded-2xl shadow-md flex items-center gap-4"
          >
            <CalendarDays className="text-green-600 w-10 h-10" />
            <div>
              <p className="text-xl font-semibold text-gray-800">Reservas</p>
              <p className="text-sm text-gray-500">Revisá o gestioná tus reservas</p>
            </div>
          </div>

          {/* Pagos */}
          <div
            onClick={() => navigate("/mis-pagos")}
            className="cursor-pointer bg-yellow-50 hover:bg-yellow-100 transition-colors p-6 rounded-2xl shadow-md flex items-center gap-4"
          >
            <CreditCard className="text-yellow-600 w-10 h-10" />
            <div>
              <p className="text-xl font-semibold text-gray-800">Pagos</p>
              <p className="text-sm text-gray-500">Revisá tus pagos realizados o pendientes</p>
            </div>
          </div>

          <div
  onClick={() => navigate("/mis-tickets")}
  className="cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors p-6 rounded-2xl shadow-md flex items-center gap-4"
>
  <ClipboardList className="text-purple-600 w-10 h-10" />
  <div>
    <p className="text-xl font-semibold text-gray-800">Avisos y Reclamos</p>
    <p className="text-sm text-gray-500">Creá o consultá tus avisos y reclamos</p>
  </div>
</div>
        </div>
      </section>
    </div>
  );
};

export default ResidentDashboard;
