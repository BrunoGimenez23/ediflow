import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/iconos/logo.png";
import { Link } from "react-router-dom";
import { 
  Building, CalendarDays, DollarSign, HouseIcon, Users, Home, ClipboardList, ClipboardCheck, MessageSquare 
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // para mobile

  const isAdmin = user?.role === "ADMIN";
  const isEmployee = user?.role === "EMPLOYEE";
  const isSupport = user?.role === "SUPPORT";
  const plan = user?.plan || "";

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Botón para mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-ediblue text-white rounded-md shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <nav className={`
        fixed top-0 left-0 h-screen bg-ediblue text-white flex flex-col items-center p-4
        w-64 transition-transform duration-300 ease-in-out overflow-y-auto z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex md:z-auto
      `}>
        <div className="mb-8 w-full flex justify-center">
          <img src={logo} alt="Ediflow Logo" className="w-44" />
        </div>

        <div className="flex-grow flex flex-col justify-start w-full mt-4 md:mt-0">
          <ul className="space-y-4 text-lg font-medium w-full">
            {/* Todos ven Inicio */}
            <li>
              <Link to="/admin" className="flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition">
                <Home className="text-edigray" />
                Inicio
              </Link>
            </li>

            {/* ADMIN y EMPLOYEE */}
            {(isAdmin || isEmployee) && (
              <>
                <li>
                  <Link to="/admin/buildings" className="flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition">
                    <Building className="text-edigray" />
                    Edificios
                  </Link>
                </li>
                <li>
                  <Link to="/admin/residents" className="flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition">
                    <Users className="text-edigray" />
                    Residentes
                  </Link>
                </li>
                <li>
                  <Link to="/admin/apartment" className="flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition">
                    <HouseIcon className="text-edigray" />
                    Apartamentos
                  </Link>
                </li>
              </>
            )}

            {/* Solo ADMIN ve Pagos */}
            {isAdmin && ["PROFESIONAL","PREMIUM_PLUS","ENTERPRISE"].includes(plan) && (
              <li>
                <Link to="/admin/payment/all" className="flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition">
                  <DollarSign className="text-edigray" />
                  Pagos
                </Link>
              </li>
            )}

            {/* ADMIN y SUPPORT ve Reservas */}
            {(isAdmin || isSupport) && ["PROFESIONAL","PREMIUM_PLUS","ENTERPRISE"].includes(plan) && (
              <li>
                <Link to="/admin/reservas" className="flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition">
                  <CalendarDays className="text-edigray" />
                  Reservas
                </Link>
              </li>
            )}

            {/* Solo ADMIN PREMIUM_PLUS */}
            {isAdmin && plan === "PREMIUM_PLUS" && (
              <>
                <li>
                  <Link to="/admin/users" className="flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition">
                    <Users className="text-edigray" />
                    Gestión de Usuarios
                  </Link>
                </li>
                <li>
                  <Link to="/admin/historial" className="flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition">
                    <ClipboardList className="text-edigray" />
                    Historial Portero
                  </Link>
                </li>
                <li>
                  <Link to="/admin/payment/report" className="flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition">
                    <ClipboardCheck className="text-edigray" />
                    Reporte de Pagos
                  </Link>
                </li>
                <li>
                  <Link to="/admin/avisos" className="flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition">
                    <MessageSquare className="text-edigray" />
                    Avisos y Reclamos
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
