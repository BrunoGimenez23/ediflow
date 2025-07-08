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
    <nav className="bg-ediblue" role="navigation" aria-label="Menú principal">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo a la izquierda */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src={logo}
            alt="Logo de Ediflow"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Menú principal centrado */}
        <div className="hidden md:flex flex-grow justify-center">
          <ul className="flex space-x-8 text-white text-lg font-medium">
            <li>
              <button
                onClick={() => handleNavClick("features")}
                className="hover:text-ediblueLight transition"
              >
                Funciones
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("screenshots")}
                className="hover:text-ediblueLight transition"
              >
                Vista previa
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("pricing")}
                className="hover:text-ediblueLight transition"
              >
                Planes
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("contact")}
                className="hover:text-ediblueLight transition"
              >
                Contacto
              </button>
            </li>
          </ul>
        </div>

        {/* Acciones a la derecha */}
        <div className="hidden md:flex space-x-6 font-semibold text-white text-lg">
          <Link
            to="/auth/login"
            className="hover:text-ediblueLight transition"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/auth/register-admin"
            className="hover:text-ediblueLight transition"
          >
            Registrarse
          </Link>
        </div>

        {/* Botón hamburguesa móvil */}
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

        {/* Menú móvil desplegable */}
        <ul
          className={`flex-col text-white text-lg font-medium absolute top-20 left-0 w-full bg-ediblue
            transition-all duration-300 ease-in-out md:hidden
            ${isOpen ? "flex" : "hidden"}`}
        >
          <li className="border-b border-ediblueLight px-6 py-3">
            <button
              onClick={() => handleNavClick("features")}
              className="hover:text-ediblueLight transition w-full text-left"
            >
              Funciones
            </button>
          </li>
          <li className="border-b border-ediblueLight px-6 py-3">
            <button
              onClick={() => handleNavClick("screenshots")}
              className="hover:text-ediblueLight transition w-full text-left"
            >
              Vista previa
            </button>
          </li>
          <li className="border-b border-ediblueLight px-6 py-3">
            <button
              onClick={() => handleNavClick("pricing")}
              className="hover:text-ediblueLight transition w-full text-left"
            >
              Planes
            </button>
          </li>
          <li className="border-b border-ediblueLight px-6 py-3">
            <button
              onClick={() => handleNavClick("contact")}
              className="hover:text-ediblueLight transition w-full text-left"
            >
              Contacto
            </button>
          </li>
          <li className="border-t border-ediblueLight mt-2 px-6 py-3 font-semibold">
            <Link
              to="/auth/login"
              className="hover:text-ediblueLight transition block w-full text-left"
              onClick={() => setIsOpen(false)}
            >
              Iniciar sesión
            </Link>
          </li>
          <li className="border-t border-ediblueLight px-6 py-3 font-semibold">
            <Link
              to="/auth/register-admin"
              className="hover:text-ediblueLight transition block w-full text-left"
              onClick={() => setIsOpen(false)}
            >
              Registrarse
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
