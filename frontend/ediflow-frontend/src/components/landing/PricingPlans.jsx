import React, { useState } from 'react'

const plans = [
  {
    name: "Básico",
    icon: "🔹",
    description: [
      "1 edificio",
      "Hasta 20 residentes",
      "Pagos y reservas",
      "Soporte por email",
    ],
    monthly: 390,
    yearly: 3900,
    oneTime: 10900,
  },
  {
    name: "Pro",
    icon: "🔷",
    description: [
      "Hasta 5 edificios",
      "Hasta 100 residentes",
      "Reportes y estadísticas",
      "Soporte prioritario",
    ],
    monthly: 790,
    yearly: 7900,
    oneTime: 21900,
    popular: true,
  },
  {
    name: "Enterprise",
    icon: "🔵",
    description: [
      "Edificios ilimitados",
      "Residentes ilimitados",
      "Multiusuario",
      "Integración API (futuro)",
      "Soporte premium",
    ],
    monthly: 1590,
    yearly: 15900,
    oneTime: 39900,
  },
];

const PricingPlans = () => {
  const [billing, setBilling] = useState("monthly");

  return (
    <section className="py-12 px-4 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Planes de Ediflow
        </h2>
        <p className="text-gray-600 mb-8">
          Elegí el plan que mejor se adapte a tus necesidades.
        </p>
        <div className="flex justify-center items-center mb-8 gap-4">
          <span className="text-gray-700 font-medium">Facturación:</span>
          <button
            className={`px-4 py-1 rounded-full border ${billing === "monthly" ? "bg-ediblue text-white" : "bg-white text-ediblue"}`}
            onClick={() => setBilling("monthly")}
          >
            Mensual
          </button>
          <button
            className={`px-4 py-1 rounded-full border ${billing === "yearly" ? "bg-ediblue text-white" : "bg-white text-ediblue"}`}
            onClick={() => setBilling("yearly")}
          >
            Anual <span className="text-sm">(2 meses gratis)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 shadow-sm transition hover:shadow-lg ${
                plan.popular ? "border-ediblue" : "border-gray-200"
              }`}
            >
              <div className="text-3xl mb-2">{plan.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {plan.name}
              </h3>
              {plan.popular && (
                <p className="text-xs text-ediblue font-medium mb-1">
                  Más popular
                </p>
              )}
              <p className="text-3xl font-bold text-gray-800 mb-4">
                ${billing === "monthly" ? plan.monthly : plan.yearly} <span className="text-base font-normal text-gray-500">/ {billing === "monthly" ? "mes" : "año"}</span>
              </p>
              <ul className="text-gray-600 text-left space-y-2 mb-4">
                {plan.description.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
              <div className="text-sm text-gray-500">
                o pago único: <span className="font-semibold">${plan.oneTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans