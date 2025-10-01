import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const plans = [
  {
    name: "Esencial",
    icon: "💼",
    price: 1000,
    description: [
      "Gestioná edificios, apartamentos y residentes fácilmente",
      "Panel gratuito para residentes",
      "Ideal para comunidades pequeñas y ahorro de tiempo inmediato",
    ],
  },
  {
    name: "Profesional",
    icon: "🚀",
    price: 3000,
    description: [
      "Todo lo del plan Esencial",
      "Pagos y expensas claros con actualizaciones automáticas",
      "Reservas de espacios comunes sin conflictos",
      "Reportes y gráficos mensuales para decisiones rápidas",
      "Soporte rápido por email",
      "Contratá proveedores y registrá pagos online fácilmente",
    ],
    popular: true,
  },
  {
    name: "Premium Plus",
    icon: "🏆",
    price: 10000,
    description: [
      "Todo lo del plan Profesional",
      "Soporte multiusuario para equipos de administración",
      "Portería digital y gestión de morosos con reportes exportables",
      "Atención telefónica prioritaria",
      "Funciones exclusivas y personalización avanzada",
      "Optimización completa de pagos, reservas y comunicación",
    ],
  },
];

const PricingPlans = ({ id, isUpgrade, onUpgradeClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const initialBilling = query.get("billing") === "yearly" ? "yearly" : "monthly";
  const [billing, setBilling] = useState(initialBilling);

  // Determinar si estamos en Home
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("billing", billing);
    window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
  }, [billing, location.pathname, location.search]);

  // Pasamos billing y generamos URL-friendly planName
  const handleButtonClick = (planName, selectedBilling) => {
    const urlName = planName.toLowerCase().replace(/\s+/g, "-"); // Premium Plus → premium-plus

    // Si estamos en Home y es prueba gratis, redirigir al registro
    if (!isUpgrade && isHomePage) {
      navigate("/auth/register-admin");
      return;
    }

    if (isUpgrade && onUpgradeClick) {
      onUpgradeClick(planName, selectedBilling);
    } else {
      navigate(
        `/admin/plan-confirmation/${urlName}?billing=${selectedBilling}&units=1`
      );
    }
  };

  const calculatePrice = (monthlyPrice) => {
    if (billing === "monthly") return monthlyPrice;
    const annual = monthlyPrice * 12;
    return Math.round(annual * 0.85);
  };

  const calculateSavings = (monthlyPrice) => {
    if (billing === "monthly") return 0;
    const annual = monthlyPrice * 12;
    const discounted = Math.round(annual * 0.85);
    return annual - discounted;
  };

  return (
    <section id={id} className="py-20 px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          💼 Planes de Suscripción – Ediflow
        </h2>
        <p className="text-gray-600 mb-4">
          {isUpgrade
            ? "Seleccioná el plan que querés activar para tu comunidad."
            : "Probá Ediflow gratis por 14 días. Después elegí el plan que mejor se adapte a tu comunidad."}
        </p>

        {/* Toggle mensual/anual */}
        <div className="flex justify-center mb-12 gap-4">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              billing === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              billing === "yearly"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Anual (15% off)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const price = calculatePrice(plan.price);
            const savings = calculateSavings(plan.price);
            const priceText =
              billing === "monthly"
                ? `${price.toLocaleString()} UYU/mes`
                : `${price.toLocaleString()} UYU/año ${
                    savings > 0 ? `(ahorrás ${savings.toLocaleString()} UYU)` : ""
                  }`;

            return (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 shadow-sm flex flex-col justify-between bg-white text-gray-800 transition hover:shadow-lg ${
                  plan.popular
                    ? "border-blue-600 bg-blue-50 shadow-lg"
                    : "border-gray-200"
                }`}
              >
                <div>
                  <div className="text-4xl mb-3">{plan.icon}</div>
                  <h3
                    className={`text-xl font-semibold mb-1 ${
                      plan.popular ? "text-blue-700" : ""
                    }`}
                  >
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <p className="text-sm font-semibold uppercase mb-3 tracking-wide text-blue-600">
                      Más popular
                    </p>
                  )}
                  <p className="text-lg font-bold text-gray-800 mb-4">{priceText}</p>

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
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => handleButtonClick(plan.name, billing)}
                >
                  {isUpgrade ? "Actualizar a este plan" : "Probar 14 días gratis"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
