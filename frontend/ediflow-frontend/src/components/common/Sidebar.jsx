import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/iconos/logo.png";
import { Link } from "react-router-dom";
import { Building, CalendarDays, DollarSign, HouseIcon, Users, Home } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isEmployee = user?.role === "EMPLOYEE";
  const isSupport = user?.role === "SUPPORT";

  return (
    <nav className="w-64 h-screen bg-ediblue text-white flex flex-col items-center p-4">
      <div className="mb-8">
        <img src={logo} alt="Ediflow Logo" className="w-44 mx-auto" />
      </div>

      <div className="flex-grow flex flex-col justify-center w-full mt-[-200px]">
        <ul className="space-y-4 text-lg font-medium w-full">
          {/* Todos ven Inicio */}
          <li>
            <Link to="/admin" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
              <Home className="text-edigray" />
              Inicio
            </Link>
          </li>

          {/* ADMIN y EMPLOYEE ven Edificios, Residentes y Apartamentos */}
          {(isAdmin || isEmployee) && (
            <>
              <li>
                <Link to="/admin/buildings" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
                  <Building className="text-edigray" />
                  Edificios
                </Link>
              </li>
              <li>
                <Link to="/admin/residents" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
                  <Users className="text-edigray" />
                  Residentes
                </Link>
              </li>
              <li>
                <Link to="/admin/apartment" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
                  <HouseIcon className="text-edigray" />
                  Apartamentos
                </Link>
              </li>
            </>
          )}

          {/* Solo ADMIN ve Pagos */}
          {isAdmin && (
            <li>
              <Link to="/admin/payment/all" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
                <DollarSign className="text-edigray" />
                Pagos
              </Link>
            </li>
          )}

          {/* ADMIN y SUPPORT ven Reservas */}
          {(isAdmin || isSupport) && (
            <li>
              <Link to="/admin/reservas" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
                <CalendarDays className="text-edigray" />
                Reservas
              </Link>
            </li>
          )}

          {/* Solo ADMIN con plan ENTERPRISE ve Gestión de Usuarios */}
          {isAdmin && user?.plan === "ENTERPRISE" && (
            <li>
              <Link to="/admin/users" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
                <Users className="text-edigray" />
                Gestión de Usuarios
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
