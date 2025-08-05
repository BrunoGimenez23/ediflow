import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import heroVideo from '../../assets/videos/Ediflow-video.mp4';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-edigray w-full" role="main">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-12">

        {/* Texto */}
        <div className="text-center md:text-left md:flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-editext mb-6 leading-tight">
  Olvidate del Excel. Gestioná tu edificio en un solo lugar.
</h1>
<p className="text-base sm:text-lg text-gray-700 mb-6 max-w-lg mx-auto md:mx-0">
  Ediflow te permite administrar expensas, residentes y reservas desde una plataforma moderna, simple y eficiente. Ahorra tiempo y evitá errores.
</p>

<Button
  variant="primary"
  size="lg"
  onClick={() => navigate('/auth/register-admin')}
>
  Empezá tu prueba gratuita de 14 días
</Button>

        </div>

        {/* Video en lugar de imagen */}
        <div className="md:flex-1 w-full max-w-md mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-xl">
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
    </header>
  );
};

export default HeroSection;
