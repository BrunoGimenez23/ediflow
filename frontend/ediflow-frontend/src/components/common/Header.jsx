import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Timer } from "lucide-react"; // Requiere lucide-react

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleAssignPlan = () => {
    navigate("/admin/assign-plan");
  };

  return (
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
  );
};

export default Header;
