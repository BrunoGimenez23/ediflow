import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <header className="h-20 bg-edigray flex justify-between items-center px-12 md:px-20 lg:px-40 shadow-md">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Hola,{" "}
          <span className="text-ediblue">
            {user?.fullName || user?.username || "Admin"}
          </span>
          !
        </h2>

        {user?.role === "ADMIN" && typeof user?.trialDaysLeft === "number" && (
          <p className="mt-1 text-sm text-ediblue font-medium">
            Prueba gratuita:{" "}
            <span className="font-bold">
              {user.trialDaysLeft} {user.trialDaysLeft === 1 ? "día" : "días"}{" "}
              restantes
            </span>
          </p>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-ediblue hover:bg-ediblueLight text-white font-semibold py-2 px-5 rounded-md shadow-md transition-colors"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
      >
        Salir
      </button>
    </header>
  );
};

export default Header;
