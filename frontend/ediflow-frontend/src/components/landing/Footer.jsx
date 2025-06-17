import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-ediblue text-white py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Logo / Nombre */}
        <div className="text-2xl font-bold mb-6 md:mb-0">
          Ediflow
        </div>

        {/* Links de navegación */}
        <nav className="flex space-x-6 mb-6 md:mb-0">
          <a href="#planes" className="hover:text-ediblueLight transition">Planes</a>
          <a href="#features" className="hover:text-ediblueLight transition">Características</a>
          <a href="#contacto" className="hover:text-ediblueLight transition">Contacto</a>
          <a href="#faq" className="hover:text-ediblueLight transition">FAQ</a>
        </nav>

        {/* Redes sociales (ejemplo con íconos simples) */}
        <div className="flex space-x-4">
          <a href="https://facebook.com" aria-label="Facebook" className="hover:text-ediblueLight transition">📘</a>
          <a href="https://twitter.com" aria-label="Twitter" className="hover:text-ediblueLight transition">🐦</a>
          <a href="https://instagram.com" aria-label="Instagram" className="hover:text-ediblueLight transition">📸</a>
        </div>
      </div>

      {/* Texto copyright */}
      <div className="mt-8 text-center text-edigray text-sm">
        &copy; {new Date().getFullYear()} Ediflow. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer