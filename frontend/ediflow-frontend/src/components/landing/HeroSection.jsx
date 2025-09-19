import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Button from '../common/Button';
import heroVideo from '../../assets/videos/DemoEdiflow.mp4';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <header className="relative w-full h-screen overflow-hidden" role="main">
      
      {/* Video de fondo con blur leve + overlay */}
      <video
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover blur-[1.5px]"
        aria-label="Demo mostrando cómo generar un pago en Ediflow"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40"></div>

      {/* Contenido encima del video */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 flex flex-col md:flex-row items-center justify-between gap-12 h-full">

        {/* Texto y bullets */}
        <div className="md:flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-2xl">
            Gestioná tu edificio de manera simple y eficiente
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-lg md:max-w-md drop-shadow-lg">
            Con Ediflow, podés controlar pagos, reservas, avisos y comunicación con los residentes desde un solo panel moderno y fácil de usar.
          </p>

          <ul className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
            <li className="flex items-center gap-2 text-white bg-black/30 rounded-full px-3 py-1 shadow-sm hover:bg-green-500 hover:text-white transition-colors duration-300">
              <Check className="w-5 h-5 text-green-500" /> Pagos y expensas claros y organizados
            </li>
            <li className="flex items-center gap-2 text-white bg-black/30 rounded-full px-3 py-1 shadow-sm hover:bg-green-500 hover:text-white transition-colors duration-300">
              <Check className="w-5 h-5 text-green-500" /> Reservas de espacios comunes al instante
            </li>
            <li className="flex items-center gap-2 text-white bg-black/30 rounded-full px-3 py-1 shadow-sm hover:bg-green-500 hover:text-white transition-colors duration-300">
              <Check className="w-5 h-5 text-green-500" /> Avisos y comunicación rápida con los residentes
            </li>
          </ul>

          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/auth/register-admin')}
              className="shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1"
            >
              Probá Ediflow gratis por 14 días
            </Button>
            <p className="mt-2 text-sm text-white/70">Sin tarjeta de crédito. Activá tu prueba hoy mismo.</p>
          </div>
        </div>

      </div>

      {/* Indicador de scroll animado */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce text-white text-3xl select-none">
        ↓
      </div>
    </header>
  );
};

export default HeroSection;
