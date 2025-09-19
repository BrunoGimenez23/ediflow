import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Timer,
  AlertTriangle,
  LogOut,
  ArrowUpCircle,
  ClipboardList,
  Menu,
} from "lucide-react";

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleAssignPlan = () => {
    navigate("/admin/assign-plan"); // Solo para bruno@ediflow.com
  };

  const handleUpgradeClick = () => {
    navigate("/admin/upgrade-plan");
  };

  const showUpgradeButton = user?.role === "ADMIN" && user.trialDaysLeft !== null;

  return (
    <>
      <header className="bg-edigray flex flex-col md:flex-row justify-between items-start md:items-center px-4 sm:px-6 md:px-12 lg:px-24 py-3 md:py-6 shadow-md border-b border-gray-200 gap-4 md:gap-0 relative z-[60]">
        {/* Fila superior con hamburguesa + saludo (mobile ordenado) */}
        <div className="flex w-full items-center justify-between md:justify-start md:w-auto gap-3">
          {/* Botón hamburguesa solo en mobile */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-3 rounded-xl bg-white shadow hover:bg-gray-100 transition flex items-center justify-center"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6 text-gray-800" />
          </button>

          {/* Saludo */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Hola,{" "}
            <span className="text-ediblue">
              {user?.fullName || user?.username || "Admin"}
            </span>{" "}
            👋
          </h2>
        </div>

        {/* Estado del plan */}
        {user?.role === "ADMIN" && (
          <div className="flex flex-col sm:flex-row sm:flex-wrap md:flex-row md:items-center gap-2 text-sm md:text-base w-full md:w-auto">
            {user.trialDaysLeft > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm w-full sm:w-auto">
                <Timer className="w-4 h-4 text-ediblue" />
                <span className="text-ediblue">
                  Prueba gratuita:{" "}
                  <span className="font-bold">
                    {user.trialDaysLeft}{" "}
                    {user.trialDaysLeft === 1 ? "día" : "días"} restantes
                  </span>
                </span>
              </div>
            )}

            {user.plan && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm w-full sm:w-auto">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">
                  Plan actual:{" "}
                  <span className="font-bold capitalize">{user.plan}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Botones → en mobile van scrollables en una fila */}
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 mt-2 md:mt-0">
          {user?.email === "bruno@ediflow.com" && (
            <button
              onClick={handleAssignPlan}
              className="bg-edigreen hover:bg-edigreenLight text-white font-semibold py-2 px-4 rounded-xl shadow-sm flex items-center gap-2 transition-colors whitespace-nowrap"
              aria-label="Asignar plan manual"
              title="Asignar plan manual"
            >
              <ClipboardList className="w-4 h-4" /> Asignar Plan
            </button>
          )}

          {showUpgradeButton && (
            <button
              onClick={handleUpgradeClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl shadow-sm flex items-center gap-2 transition-colors whitespace-nowrap"
              aria-label="Actualizar plan"
              title="Actualizar plan"
            >
              <ArrowUpCircle className="w-4 h-4" /> Actualizar plan
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-ediblue hover:bg-ediblueLight text-white font-semibold py-2 px-4 rounded-xl shadow-sm flex items-center gap-2 transition-colors whitespace-nowrap"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      {/* Alerta de prueba finalizada */}
      {user?.role === "ADMIN" &&
        user.plan === "PROFESSIONAL" &&
        user.trialDaysLeft !== null &&
        user.trialDaysLeft <= 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mx-4 sm:mx-6 md:mx-12 lg:mx-24 shadow-sm">
            <div className="flex items-start md:items-center gap-3 flex-1">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 md:mt-0" />
              <div>
                <p className="font-semibold text-sm md:text-base">
                  Tu período de prueba ha finalizado.
                </p>
                <p className="text-xs md:text-sm">
                  Actualiza tu plan para seguir usando Ediflow sin interrupciones.
                </p>
              </div>
            </div>
            <button
              onClick={handleUpgradeClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition whitespace-nowrap"
            >
              <ArrowUpCircle className="w-4 h-4" /> Actualizar plan
            </button>
          </div>
        )}
    </>
  );
};

export default Header;
