import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Timer, AlertTriangle } from "lucide-react";
// import UpgradePlansContainer ya no es necesario aquí

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
    // Navegamos a la ruta dedicada de UpgradePlansContainer
    navigate("/admin/upgrade-plan");
  };

  return (
    <>
      <header className="h-24 bg-edigray flex justify-between items-center px-6 md:px-12 lg:px-24 shadow-sm border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Hola,{" "}
            <span className="text-ediblue">
              {user?.fullName || user?.username || "Admin"}
            </span>
            !
          </h2>

          {user?.role === "ADMIN" && (
            <div className="flex flex-col gap-1 mt-1 text-sm">
              {user.trialDaysLeft > 0 && (
                <span className="text-ediblue flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  Prueba gratuita:{" "}
                  <span className="font-bold">
                    {user.trialDaysLeft}{" "}
                    {user.trialDaysLeft === 1 ? "día" : "días"} restantes
                  </span>
                </span>
              )}

              {user.plan && (
                <span className="text-emerald-600 flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" />
                  Plan actual:{" "}
                  <span className="font-bold capitalize">{user.plan}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user?.email === "bruno@ediflow.com" && (
            <button
              onClick={handleAssignPlan}
              className="bg-edigreen hover:bg-edigreenLight text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
              aria-label="Asignar plan manual"
              title="Asignar plan manual"
            >
              Asignar Plan
            </button>
          )}

          {user?.role === "ADMIN" && (
            <button
              onClick={handleUpgradeClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
              aria-label="Actualizar plan"
              title="Actualizar plan"
            >
              Actualizar plan
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-ediblue hover:bg-ediblueLight text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      </header>

      {user?.role === "ADMIN" && user.trialDaysLeft <= 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mx-6 mt-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Tu período de prueba ha finalizado.</p>
              <p className="text-sm">
                Actualiza tu plan para seguir usando Ediflow sin interrupciones.
              </p>
            </div>
          </div>
          <button
            onClick={handleUpgradeClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Actualizar plan
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
