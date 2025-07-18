import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const plans = [
  {
    name: 'Esencial',
    icon: '💼',
    pricePerUnit: 40,
    minimumMonthly: 2000,
    maxUnits: 50,
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
    maxUnits: 150,
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
    maxUnits: Infinity,
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
  const [unitsByPlan, setUnitsByPlan] = useState(
    plans.reduce((acc, plan) => {
      acc[plan.name] = 1;
      return acc;
    }, {})
  );
  const navigate = useNavigate();
  const location = useLocation();

  
  const calculatePrice = (plan, units) => {
    const safeUnits = Math.max(1, Math.min(Number(units), plan.maxUnits || Infinity));
    let price;

    if (plan.maxUnits === Infinity) {
      
      price = plan.minimumMonthly * (billing === 'monthly' ? 1 : 12);
      if (billing === 'yearly') price *= 0.85; // 15% descuento anual
    } else {
      
      price = plan.pricePerUnit * safeUnits * (billing === 'monthly' ? 1 : 12);
      if (billing === 'yearly') price *= 0.85;

      
      const minPrice =
        plan.name === 'Esencial'
          ? 1000 * (billing === 'monthly' ? 1 : 12)
          : plan.minimumMonthly * (billing === 'monthly' ? 1 : 12);

      if (price < minPrice) price = minPrice;
    }

    return Math.round(price);
  };

  
  const formatPrice = (plan, unitsRaw) => {
    const units = Number(unitsRaw) || 1;
    const price = calculatePrice(plan, units);
    if (billing === 'monthly') {
      if (plan.maxUnits === Infinity) {
        return `${plan.minimumMonthly} UYU/mes`;
      } else {
        return `${plan.pricePerUnit} UYU/unidad (mín. ${
          plan.name === 'Esencial' ? 1000 : plan.minimumMonthly
        } UYU/mes) — Total: ${price} UYU/mes`;
      }
    } else {
      return `${price} UYU/año (15% de descuento aplicado)`;
    }
  };

  const normalizePlanName = (name) => name.toLowerCase().replace(/\s+/g, '-');

  const handleButtonClick = (planName) => {
    if (location.pathname === '/') {
      navigate('/auth/register-admin');
    } else {
      const normalized = normalizePlanName(planName);
      const units = unitsByPlan[planName] || 1; 
      navigate(`/planes/confirmacion/${normalized}?billing=${billing}&units=${units}`);
    }
  };

  // Maneja cambio en input unidades
  const handleUnitsChange = (planName, value) => {
    const intVal = parseInt(value);
    if (!isNaN(intVal) && intVal > 0) {
      setUnitsByPlan((prev) => ({ ...prev, [planName]: intVal }));
    } else if (value === '') {
      // Permitir borrar para editar
      setUnitsByPlan((prev) => ({ ...prev, [planName]: '' }));
    }
  };

  const buttonText = location.pathname === '/' ? 'Probar 14 días gratis' : 'Actualizar plan';

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
                <p className="text-sm mb-2 font-medium text-gray-700">{formatPrice(plan, unitsByPlan[plan.name])}</p>
                <p className="text-sm mb-4 font-medium text-gray-600">
                  Unidades permitidas: {plan.maxUnits === Infinity ? 'Ilimitadas' : `Hasta ${plan.maxUnits}`}
                </p>
                <ul className="mb-6 space-y-2 text-left text-gray-700">
                  {plan.description.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {plan.maxUnits !== Infinity && (
                  <div className="mb-4">
                    <label htmlFor={`units-${plan.name}`} className="block font-semibold mb-1 text-left">
                      Cantidad de unidades a gestionar:
                    </label>
                    <input
                      type="number"
                      id={`units-${plan.name}`}
                      min={1}
                      max={plan.maxUnits}
                      value={unitsByPlan[plan.name]}
                      onChange={(e) => handleUnitsChange(plan.name, e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Máximo permitido: {plan.maxUnits} unidades.
                    </p>
                  </div>
                )}
              </div>

              <button
                className={`mt-6 py-3 px-6 rounded-lg font-semibold transition ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={() => handleButtonClick(plan.name)}
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
