// src/components/WhatsappButton.jsx
import React from 'react';

const WhatsappButton = () => {
  return (
    <a
      href="https://wa.me/598098235535?text=Hola,%20quiero%20saber%20más%20sobre%20Ediflow"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      {/* Ícono WhatsApp SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48A11.8 11.8 0 0012.03 0C5.37 0 .05 5.32.05 12.03c0 2.12.56 4.17 1.62 5.99L0 24l6.2-1.63a11.92 11.92 0 005.83 1.49h.01c6.66 0 12.06-5.34 12.06-11.94a11.94 11.94 0 00-3.58-8.94zM12 21.82a9.66 9.66 0 01-4.94-1.43l-.36-.22-3.68.97.98-3.58-.23-.37A9.7 9.7 0 012.3 12c0-5.33 4.35-9.67 9.69-9.67 2.59 0 5.02 1.01 6.84 2.83a9.59 9.59 0 012.84 6.84c0 5.34-4.34 9.66-9.67 9.66zm5.3-6.48c-.29-.15-1.7-.83-1.97-.92-.26-.1-.45-.15-.64.15-.19.29-.73.92-.9 1.11-.16.19-.33.21-.61.07a7.37 7.37 0 01-2.17-1.34 8.17 8.17 0 01-1.52-1.87c-.16-.28-.02-.43.13-.58.14-.14.32-.36.48-.54.16-.18.21-.31.31-.52.1-.2.05-.37-.02-.52-.07-.15-.63-1.52-.87-2.08-.23-.54-.47-.47-.64-.48-.17 0-.37 0-.57 0a1.08 1.08 0 00-.82.38c-.28.29-1.08 1.06-1.08 2.58s1.1 3 1.26 3.22c.15.22 2.18 3.32 5.29 4.66.74.32 1.32.51 1.77.65.74.22 1.41.19 1.94.12.59-.08 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.37-.07-.12-.26-.2-.55-.35z" />
      </svg>
    </a>
  );
};

export default WhatsappButton;
