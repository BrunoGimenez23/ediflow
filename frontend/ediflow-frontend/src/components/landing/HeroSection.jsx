import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import heroVideo from '../../assets/videos/DemoEdiflow.mp4';
import { Check } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-edigray w-full relative overflow-hidden" role="main">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-12">

        {/* Texto */}
        <div className="text-center md:text-left md:flex-1 space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-editext leading-tight">
            Gestioná tu edificio de manera simple y eficiente
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-lg mx-auto md:mx-0">
            Con Ediflow, podés controlar pagos, reservas y avisos de residentes desde un solo panel moderno y fácil de usar.
          </p>

          {/* Mini bullets de beneficios */}
          <ul className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-5 h-5 text-green-500" /> Pagos y expensas claros y organizados
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-5 h-5 text-green-500" /> Reservas de espacios comunes al instante
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-5 h-5 text-green-500" /> Comunicación rápida y efectiva con los residentes
            </li>
          </ul>

          {/* CTA */}
          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/auth/register-admin')}
              className="shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
            >
              Probá Ediflow gratis por 14 días
            </Button>
            <p className="mt-2 text-sm text-gray-500">
              Sin tarjeta de crédito. Activá tu prueba hoy mismo.
            </p>
          </div>
        </div>

        {/* Video sin overlay gris */}
        <div className="md:flex-1 w-full max-w-md mx-auto md:mx-0 relative rounded-2xl overflow-hidden shadow-xl animate-fade-in hover:scale-105 transition-transform duration-500">
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover rounded-2xl"
            aria-label="Demo mostrando cómo generar un pago en Ediflow"
          />
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce text-white text-2xl select-none">
        ↓
      </div>
    </header>
  );
};

export default HeroSection;
