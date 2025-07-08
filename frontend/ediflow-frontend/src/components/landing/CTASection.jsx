import React from 'react';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const CTASection = ({ id }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-edigray py-20">
      <section
        id={id}
        className="bg-ediblue text-white py-16 px-8 text-center rounded-3xl mx-auto max-w-4xl shadow-lg mt-16"
      >
        <h2 className="text-4xl font-extrabold mb-6">
          ¿Listo para mejorar la administración de tu edificio?
        </h2>
        <p className="mb-4 text-lg max-w-3xl mx-auto leading-relaxed">
          Probalo gratis por <span className="font-semibold">14 días</span> sin tarjeta de crédito.
        </p>
        <p className="mb-10 text-lg max-w-3xl mx-auto leading-relaxed text-edigray/90">
          Empezá hoy con <span className="font-semibold">Ediflow</span> y simplificá tu gestión en minutos.
        </p>
        <button
          type="button"
          className="
            inline-flex items-center gap-3 
            bg-edicyan text-white font-semibold 
            py-4 px-10 rounded-xl 
            shadow-md 
            hover:shadow-xl hover:scale-105 
            active:scale-95 active:shadow-sm 
            transition-transform transition-shadow duration-300
            focus:outline-none focus:ring-4 focus:ring-edicyan focus:ring-opacity-60
          "
          onClick={() => navigate('/auth/register-admin')}
        >
          <HiOutlineLightningBolt
            size={24}
            className="animate-pulse-slow"
          />
          Empezar prueba gratis
        </button>
      </section>
    </div>
  );
};

export default CTASection;
