import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const plans = [
  {
    name: 'Esencial',
    icon: '💼',
    pricePerUnit: 40,
    minimumMonthly: 2000,
    units: 'Hasta 50',
    description: [
      'Gestión completa de edificios, apartamentos y residentes',
      'Panel gratuito para residentes con acceso a su información',
      'Ideal para comunidades pequeñas y gestión básica',
    ],
  },
  {
    name: 'Profesional',
    icon: '💼',
    pricePerUnit: 60,
    minimumMonthly: 3000,
    units: 'Hasta 150',
    description: [
      'Todas las funcionalidades del plan Esencial',
      'Gestión avanzada de pagos y emisión de expensas (pendiente, pagado, vencido)',
      'Reservas y administración de espacios comunes',
      'Gráficos y reportes mensuales de pagos',
      'Soporte rápido por email',
    ],
    popular: true,
  },
  {
    name: 'Premium Plus',
    icon: '💼',
    pricePerUnit: 100,
    minimumMonthly: 10000,
    units: 'Ilimitadas',
    description: [
      'Todas las funcionalidades del plan Profesional',
      'Soporte multiusuario para equipos de trabajo',
      'Atención telefónica prioritaria',
      'Funciones exclusivas y personalización avanzada',
    ],
  },
];

const PricingPlans = ({ id }) => {
  const [billing, setBilling] = useState('monthly');
  const navigate = useNavigate();
  const location = useLocation();

  const calculatePrice = (plan) => {
    let price;
    if (plan.units === 'Ilimitadas') {
      price = plan.minimumMonthly * (billing === 'monthly' ? 1 : 12);
      if (billing === 'yearly') price = price * 0.85; // 15% descuento anual
    } else {
      price = plan.pricePerUnit * (billing === 'monthly' ? 1 : 12);
      if (billing === 'yearly') {
        price = price * 0.85; // 15% descuento anual
      }
      if (price < plan.minimumMonthly * (billing === 'monthly' ? 1 : 12)) {
        price = plan.minimumMonthly * (billing === 'monthly' ? 1 : 12);
      }
    }
    return Math.round(price);
  };

  const formatPrice = (plan) => {
    if (plan.units === 'Ilimitadas') {
      return billing === 'monthly'
        ? `${plan.minimumMonthly} UYU/mes`
        : `${calculatePrice(plan)} UYU/año`;
    }
    return billing === 'monthly'
      ? `${plan.pricePerUnit} UYU/unidad (mín. ${plan.minimumMonthly} UYU/mes)`
      : `${calculatePrice(plan)} UYU/año`;
  };

  const handleButtonClick = () => {
    if (location.pathname === '/') {
      navigate('/auth/register-admin');
    } else if (location.pathname === '/planes') {
      // Aquí podés poner otra lógica si querés, o dejar sin acción
    } else {
      navigate('/planes');
    }
  };

  // Texto dinámico según ruta
  const buttonText =
    location.pathname === '/' ? 'Probar 14 días gratis' : 'Actualizar plan';

  return (
    <section id={id} className="py-12 px-4 md:px-12 bg-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          💼 Planes de Suscripción – Ediflow
        </h2>
        <p className="text-gray-600 mb-8">
          Administre edificios en Uruguay con facilidad. ¡Pruebe 14 días gratis y elija su plan!
        </p>

        <div className="flex justify-center items-center mb-8 gap-4">
          <span className="text-gray-800 font-medium">Facturación:</span>
          <button
            className={`px-4 py-1 rounded-full border border-blue-500 shadow-sm transition hover:bg-blue-500 hover:text-white ${
              billing === 'monthly' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            }`}
            onClick={() => setBilling('monthly')}
          >
            Mensual
          </button>
          <button
            className={`px-4 py-1 rounded-full border border-blue-500 shadow-sm transition hover:bg-blue-500 hover:text-white ${
              billing === 'yearly' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            }`}
            onClick={() => setBilling('yearly')}
          >
            Anual <span className="text-sm font-normal">(15% de descuento)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 shadow-sm transition hover:shadow-lg flex flex-col justify-between bg-white text-gray-800 border-gray-200 ${
                plan.popular ? 'border-blue-600 bg-blue-50 shadow-lg' : ''
              }`}
            >
              <div>
                <div className="text-4xl mb-3">{plan.icon}</div>
                <h3 className={`text-xl font-semibold mb-1 ${plan.popular ? 'text-blue-700' : ''}`}>
                  {plan.name}
                </h3>
                {plan.popular && (
                  <p className="text-sm font-semibold uppercase mb-2 tracking-wide text-blue-600">
                    Más popular
                  </p>
                )}
                <p className="text-sm mb-2 font-medium text-gray-700">{formatPrice(plan)}</p>
                <p className="text-sm mb-4 font-medium text-gray-600">Unidades: {plan.units}</p>
                <ul className="mb-6 space-y-2 text-left text-gray-700">
                  {plan.description.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`mt-6 py-3 px-6 rounded-lg font-semibold transition ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={handleButtonClick}
              >
                {buttonText}
              </button>
            </div>
          ))}
        </div>

        <p className="text-gray-600 mt-8 max-w-3xl mx-auto text-left">
          <strong>Configuración inicial (opcional):</strong> Carga de datos, edificios, residentes y capacitación por 4,000–12,000 UYU según portafolio.
        </p>
        <p className="text-gray-600 mt-2 max-w-3xl mx-auto text-left">
          <strong>Facturación e impuestos:</strong> Los precios no incluyen IVA. En caso de corresponder en el futuro, se adicionará al momento de facturar.
        </p>
      </div>
    </section>
  );
};

export default PricingPlans;
