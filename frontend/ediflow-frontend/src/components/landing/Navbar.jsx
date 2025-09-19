import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/iconos/logo.png";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (id) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      scrollToSection(id);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
      <nav
        className="bg-ediblue/90 backdrop-blur-md shadow-md rounded-2xl mt-4 w-[90%] max-w-6xl transition-all"
        role="navigation"
        aria-label="Menú principal"
      >
        <div className="px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src={logo}
              alt="Logo de Ediflow"
              className="h-14 w-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>

          {/* Menú principal */}
          <div className="hidden md:flex flex-grow justify-center">
            <ul className="flex space-x-10 text-white text-lg font-medium">
              {["features", "screenshots", "pricing", "contact"].map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleNavClick(item)}
                    className="relative group transition"
                  >
                    {item === "features"
                      ? "Funciones"
                      : item === "screenshots"
                      ? "Vista previa"
                      : item === "pricing"
                      ? "Planes"
                      : "Contacto"}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-ediblueLight transition-all group-hover:w-full" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Acciones */}
          <div className="hidden md:flex items-center space-x-6 font-semibold text-white text-lg">
            <Link
              to="/auth/login"
              className="hover:text-ediblueLight transition"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/auth/register-admin"
              className="bg-ediblueLight text-ediblue px-4 py-2 rounded-xl shadow hover:bg-white hover:text-ediblue transition"
            >
              Registrarse
            </Link>
          </div>

          {/* Hamburguesa */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white md:hidden focus:outline-none ml-4"
            aria-label="Menú"
            aria-expanded={isOpen}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        <ul
          className={`flex-col text-white text-lg font-medium rounded-b-2xl overflow-hidden
            transition-all duration-300 ease-in-out md:hidden
            ${isOpen ? "flex" : "hidden"}`}
        >
          {[
            { id: "features", label: "Funciones" },
            { id: "screenshots", label: "Vista previa" },
            { id: "pricing", label: "Planes" },
            { id: "contact", label: "Contacto" },
          ].map((item) => (
            <li
              key={item.id}
              className="border-t border-ediblueLight px-6 py-3 bg-ediblue/95 backdrop-blur-md"
            >
              <button
                onClick={() => handleNavClick(item.id)}
                className="hover:text-ediblueLight transition w-full text-left"
              >
                {item.label}
              </button>
            </li>
          ))}
          <li className="border-t border-ediblueLight px-6 py-3 font-semibold bg-ediblue/95">
            <Link
              to="/auth/login"
              className="hover:text-ediblueLight transition block w-full text-left"
              onClick={() => setIsOpen(false)}
            >
              Iniciar sesión
            </Link>
          </li>
          <li className="border-t border-ediblueLight px-6 py-3 font-semibold bg-ediblue/95">
            <Link
              to="/auth/register-admin"
              className="bg-ediblueLight text-ediblue px-4 py-2 rounded-lg shadow hover:bg-white hover:text-ediblue transition block w-full text-center"
              onClick={() => setIsOpen(false)}
            >
              Registrarse
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
