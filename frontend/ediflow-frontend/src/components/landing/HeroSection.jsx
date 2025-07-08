import React from 'react';
import { useNavigate } from 'react-router-dom';
import paneladmin from '../../assets/images/paneladmin.png';
import Button from '../common/Button';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-edigray w-full" role="main">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-12">

        {/* Texto */}
        <div className="text-center md:text-left md:flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-editext mb-6 leading-tight">
            Simplificá la administración de tu edificio con Ediflow
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-lg mx-auto md:mx-0">
            Administra residentes, pagos y reservas de manera eficiente y sin complicaciones. Optimiza tu tiempo con una plataforma intuitiva y moderna.
          </p>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/auth/register-admin')}
          >
            Comenzá tu prueba gratis ahora
          </Button>
        </div>

        {/* Imagen */}
        <div className="md:flex-1 w-full max-w-md mx-auto md:mx-0">
          <img
            src={paneladmin}
            alt="Panel administrativo de Ediflow mostrando gestión de edificios, residentes y pagos"
            className="w-full rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
