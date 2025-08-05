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
          Gestioná tu edificio sin planillas, confusión ni estrés
        </h2>
        <p className="mb-4 text-lg max-w-3xl mx-auto leading-relaxed">
          Empezá ahora tu <span className="font-semibold">prueba gratuita de 14 días</span> sin tarjeta ni compromiso.
        </p>
        <p className="mb-10 text-lg max-w-3xl mx-auto leading-relaxed text-edigray/90">
          Registrate en minutos y descubrí por qué cada vez más administradores eligen Ediflow.
        </p>
        <p className="text-sm text-edigray/80 mb-2">
  Oferta válida por tiempo limitado
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
          Probar gratis ahora
        </button>
      </section>
    </div>
  );
};

export default CTASection;
