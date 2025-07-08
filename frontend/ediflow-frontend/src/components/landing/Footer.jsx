import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import WhatsAppInviteButton from './WhatsAppInviteButton';

const Footer = () => {
  return (
    <footer className="bg-ediblue text-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Logo / Nombre */}
        <div className="text-2xl font-bold mb-6 md:mb-0 select-none cursor-default">
          Ediflow
        </div>

        {/* Links de navegación */}
        <nav className="flex space-x-6 mb-6 md:mb-0 text-lg">
          {['Planes', 'Características', 'Contacto', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-ediblueLight transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ediblueLight rounded"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Redes sociales con íconos */}
        <div className="flex space-x-6">
          {[{
            href: "https://facebook.com",
            label: "Facebook",
            icon: <FaFacebookF size={20} />
          }, {
            href: "https://twitter.com",
            label: "Twitter",
            icon: <FaTwitter size={20} />
          }, {
            href: "https://instagram.com",
            label: "Instagram",
            icon: <FaInstagram size={20} />
          }].map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="hover:text-ediblueLight transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ediblueLight rounded transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      <hr className="border-edigray/40 my-8" />
    
      {/* Texto copyright */}
      <div className="text-center text-ediblueLight text-sm select-none">
        &copy; {new Date().getFullYear()} Ediflow. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
