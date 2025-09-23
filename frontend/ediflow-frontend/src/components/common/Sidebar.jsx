import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/iconos/logo.png";
import { Link, useLocation } from "react-router-dom";
import { 
  Building, CalendarDays, DollarSign, HouseIcon, Users, Home, ClipboardList, ClipboardCheck, MessageSquare, X, 
  ShoppingCart, FileText, ClipboardList as ClipboardListIcon
} from "lucide-react";
import { useState } from "react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === "ADMIN";
  const isEmployee = user?.role === "EMPLOYEE";
  const isSupport = user?.role === "SUPPORT";
  const plan = user?.plan || "";

  const [openMenu, setOpenMenu] = useState(
    location.pathname.startsWith("/admin/marketplace") ? "marketplace" : null
  );

  const isActive = (path) => location.pathname.startsWith(path);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className={`
        fixed top-0 left-0 h-screen bg-ediblue text-white flex flex-col items-center p-4
        w-64 transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? "translate-x-0 z-[70]" : "-translate-x-full z-[50]"}
        md:translate-x-0 md:static md:flex md:z-auto
      `}>
        <div className="w-full flex justify-end md:hidden mb-4">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        <div className="mb-8 w-full flex justify-center">
          <img src={logo} alt="Ediflow Logo" className="w-44" />
        </div>

        <div className="flex-grow flex flex-col justify-start w-full mt-4 md:mt-0">
          <ul className="space-y-4 text-lg font-medium w-full">
            <li>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin") && !isActive("/admin/marketplace") ? "bg-edicyan text-black font-semibold" : ""}`}
              >
                <Home className="text-edigray" />
                Inicio
              </Link>
            </li>

            {(isAdmin || isEmployee) && (
              <>
                <li>
                  <Link
                    to="/admin/buildings"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/buildings") ? "bg-edicyan text-black font-semibold" : ""}`}
                  >
                    <Building className="text-edigray" />
                    Edificios
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/residents"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/residents") ? "bg-edicyan text-black font-semibold" : ""}`}
                  >
                    <Users className="text-edigray" />
                    Residentes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/apartment"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/apartment") ? "bg-edicyan text-black font-semibold" : ""}`}
                  >
                    <HouseIcon className="text-edigray" />
                    Apartamentos
                  </Link>
                </li>
              </>
            )}

            {isAdmin && ["PROFESIONAL","PREMIUM_PLUS","ENTERPRISE"].includes(plan) && (
              <li>
                <Link
                  to="/admin/payment/all"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/payment/all") ? "bg-edicyan text-black font-semibold" : ""}`}
                >
                  <DollarSign className="text-edigray" />
                  Pagos
                </Link>
              </li>
            )}

            {(isAdmin || isSupport) && ["PROFESIONAL","PREMIUM_PLUS","ENTERPRISE"].includes(plan) && (
              <li>
                <Link
                  to="/admin/reservas"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/reservas") ? "bg-edicyan text-black font-semibold" : ""}`}
                >
                  <CalendarDays className="text-edigray" />
                  Reservas
                </Link>
              </li>
            )}

            {isAdmin && plan === "PREMIUM_PLUS" && (
              <>
                <li>
                  <Link
                    to="/admin/users"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/users") ? "bg-edicyan text-black font-semibold" : ""}`}
                  >
                    <Users className="text-edigray" />
                    Gestión de Usuarios
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/historial"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/historial") ? "bg-edicyan text-black font-semibold" : ""}`}
                  >
                    <ClipboardList className="text-edigray" />
                    Historial Portero
                  </Link>
                </li>

                {/* Marketplace con submenú colapsable */}
                <li>
                  <button
                    onClick={() => toggleMenu("marketplace")}
                    className={`flex items-center gap-3 px-4 py-2 w-full rounded hover:text-edicyan hover:bg-edidark transition ${openMenu === "marketplace" ? "bg-edicyan text-black font-semibold" : ""}`}
                  >
                    <ShoppingCart className="text-edigray" />
                    Marketplace
                  </button>
                  {openMenu === "marketplace" && (
                    <ul className="ml-8 mt-2 space-y-2">
                      <li>
                        <Link
                          to="/admin/marketplace/providers"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-2 px-4 py-1 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/marketplace/providers") ? "bg-edicyan text-black font-semibold" : ""}`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Proveedores
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/marketplace/orders"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-2 px-4 py-1 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/marketplace/orders") ? "bg-edicyan text-black font-semibold" : ""}`}
                        >
                          <FileText className="w-4 h-4" />
                          Órdenes
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/marketplace/quotes"
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-2 px-4 py-1 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/marketplace/quotes") ? "bg-edicyan text-black font-semibold" : ""}`}
                        >
                          <ClipboardListIcon className="w-4 h-4" />
                          Cotizaciones
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    to="/admin/payment/report"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/payment/report") ? "bg-edicyan text-black font-semibold" : ""}`}
                  >
                    <ClipboardCheck className="text-edigray" />
                    Reporte de Pagos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/avisos"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded hover:text-edicyan hover:bg-edidark transition ${isActive("/admin/avisos") ? "bg-edicyan text-black font-semibold" : ""}`}
                  >
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
