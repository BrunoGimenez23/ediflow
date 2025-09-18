import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Timer, AlertTriangle } from "lucide-react";

const Header = () => {
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
      <header className="bg-edigray flex flex-col md:flex-row justify-between items-start md:items-center px-4 sm:px-6 md:px-12 lg:px-24 py-4 md:py-6 shadow-sm border-b border-gray-200 gap-4 md:gap-0">
        {/* Saludo y estado del plan */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full md:w-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Hola,{" "}
            <span className="text-ediblue">{user?.fullName || user?.username || "Admin"}</span>!
          </h2>

          {user?.role === "ADMIN" && (
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm md:text-base">
              {user.trialDaysLeft > 0 && (
                <span className="text-ediblue flex items-center gap-1 whitespace-nowrap">
                  <Timer className="w-4 h-4" />
                  Prueba gratuita:{" "}
                  <span className="font-bold">
                    {user.trialDaysLeft} {user.trialDaysLeft === 1 ? "día" : "días"} restantes
                  </span>
                </span>
              )}

              {user.plan && (
                <span className="text-emerald-600 flex items-center gap-1 whitespace-nowrap">
                  <BadgeCheck className="w-4 h-4" />
                  Plan actual: <span className="font-bold capitalize">{user.plan}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto overflow-x-auto">
          {user?.email === "bruno@ediflow.com" && (
            <button
              onClick={handleAssignPlan}
              className="bg-edigreen hover:bg-edigreenLight text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              aria-label="Asignar plan manual"
              title="Asignar plan manual"
            >
              Asignar Plan
            </button>
          )}

          {showUpgradeButton && (
            <button
              onClick={handleUpgradeClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              aria-label="Actualizar plan"
              title="Actualizar plan"
            >
              Actualizar plan
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-ediblue hover:bg-ediblueLight text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Alerta de prueba finalizada */}
      {user?.role === "ADMIN" &&
        user.plan === "PROFESSIONAL" &&
        user.trialDaysLeft !== null &&
        user.trialDaysLeft <= 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mx-4 sm:mx-6 md:mx-12 lg:mx-24">
            <div className="flex items-start md:items-center gap-2 md:gap-4 flex-1">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 md:mt-0" />
              <div>
                <p className="font-semibold text-sm md:text-base">Tu período de prueba ha finalizado.</p>
                <p className="text-xs md:text-sm">
                  Actualiza tu plan para seguir usando Ediflow sin interrupciones.
                </p>
              </div>
            </div>
            <button
              onClick={handleUpgradeClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium transition whitespace-nowrap"
            >
              Actualizar plan
            </button>
          </div>
        )}
    </>
  );
};

export default Header;
