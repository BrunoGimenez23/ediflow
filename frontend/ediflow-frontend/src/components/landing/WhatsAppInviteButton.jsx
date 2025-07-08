import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppInviteButton = () => {
  const phoneNumber = '098235535'; // Poné tu número sin + ni espacios
  const message = encodeURIComponent(
    'Hola, quiero solicitar un código de invitación para registrarme en Ediflow.'
  );

  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-colors duration-300"
      aria-label="Contactar por WhatsApp para código de invitación"
    >
      <FaWhatsapp className="w-6 h-6" />
      Pedí tu código de invitación
    </a>
  );
};

export default WhatsAppInviteButton;
