import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppPaymentButton = () => {
  const phoneNumber = '098235535';
  const message = encodeURIComponent(
    'Hola, hice el pago del Plan Profesional. Adjunto comprobante. ¿Podrían validarlo? Gracias.'
  );

  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-colors duration-300"
      aria-label="Enviar comprobante por WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6" />
      Enviar comprobante por WhatsApp
    </a>
  );
};


export default WhatsAppPaymentButton;
