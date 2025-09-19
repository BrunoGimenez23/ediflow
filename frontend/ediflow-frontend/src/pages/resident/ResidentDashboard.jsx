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

  // Skeleton loader mientras cargan datos
  if (!user || loading)
    return (
      <div className="max-w-6xl mx-auto p-6 sm:p-8 mt-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );

  if (error) return <p className="text-center text-red-500 mt-12">Error al cargar datos: {error}</p>;

  const apartmentInfo = resident?.apartmentDTO || {};

  // Indicadores, ahora sin valores por defecto falsos
  const pendingPayments = resident?.pendingPayments ?? 0;
  const upcomingReservations = resident?.upcomingReservations ?? 0;
  const newPackages = resident?.newPackages ?? 0;
  const newTickets = resident?.newTickets ?? 0;

  const accessItems = [
    {
      title: "Paquetes/Visitas",
      desc: "Revisá tus paquetes o visitas registradas",
      icon: Package,
      color: "blue",
      link: "/mis-registros",
      badge: newPackages
    },
    {
      title: "Reservas",
      desc: "Revisá o gestioná tus reservas",
      icon: CalendarDays,
      color: "green",
      link: "/mis-reservas",
      badge: upcomingReservations
    },
    {
      title: "Pagos",
      desc: "Revisá tus pagos realizados o pendientes",
      icon: CreditCard,
      color: "yellow",
      link: "/mis-pagos",
      badge: pendingPayments
    },
    {
      title: "Avisos y Reclamos",
      desc: "Creá o consultá tus avisos y reclamos",
      icon: ClipboardList,
      color: "purple",
      link: "/mis-tickets",
      badge: newTickets
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-xl mt-12 font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 sm:gap-0 animate-fadeInDown">
        <div className="flex items-center gap-4">
          {/* Avatar con iniciales */}
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
            {user.fullName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              ¡Hola, <span className="text-blue-600">{user.fullName || user.username}</span>!
            </h1>
            <p className="text-gray-500 mt-1">Bienvenido a tu panel de residente</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-5 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </button>
      </header>

      {/* Apartamento info */}
      <section className="mb-12 p-6 bg-gray-50 rounded-2xl shadow-inner animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b border-gray-300 pb-2">Tu Apartamento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
          {["Número", "Piso", "Edificio"].map((label, idx) => {
            const value =
              label === "Número"
                ? apartmentInfo.number || "No asignado"
                : label === "Piso"
                ? apartmentInfo.floor || "-"
                : apartmentInfo.buildingDTO?.name || "-";
            return (
              <div
                key={idx}
                className="bg-gradient-to-r from-white via-gray-50 to-gray-100 p-5 rounded-2xl shadow-md text-center hover:shadow-xl hover:scale-105 transition-transform transition-shadow duration-300"
              >
                <p className="text-sm font-medium text-gray-500 uppercase mb-2">{label}</p>
                <p className="text-xl font-semibold text-gray-800">{value}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Accesos rápidos */}
      <section className="mb-12 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b border-gray-300 pb-2">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(item.link)}
                className={`relative cursor-pointer bg-gradient-to-r from-${item.color}-50 to-${item.color}-100 hover:from-${item.color}-100 hover:to-${item.color}-200 transition-transform transform hover:-translate-y-1 p-6 rounded-2xl shadow-md hover:shadow-xl flex items-center gap-4 duration-300`}
              >
                {/* Icono con tooltip */}
                <div className="group relative flex items-center justify-center p-3 rounded-full bg-white shadow-inner">
                  <Icon className={`text-${item.color}-600 w-8 h-8`} />
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded z-10">
                    {item.title} {item.badge > 0 ? `(${item.badge} nuevo${item.badge > 1 ? "s" : ""})` : ""}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ResidentDashboard;
