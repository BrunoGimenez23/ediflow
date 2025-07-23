import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const planInfo = {
  esencial: {
    title: "Plan Esencial",
    pricePerUnit: 40,
    // minimumMonthly eliminado para que no haya mínimo en este plan
    maxUnits: 50,
    features: [
      "Gestión de edificios, apartamentos y residentes",
      "Panel para residentes gratuito",
      "Ideal para comunidades pequeñas",
    ],
  },
  profesional: {
    title: "Plan Profesional",
    pricePerUnit: 60,
    minimumMonthly: 3000,
    maxUnits: 150,
    features: [
      "Todo lo del plan Esencial",
      "Emisión de expensas y estados de pago",
      "Reservas de espacios comunes",
      "Reportes y gráficos",
    ],
  },
  "premium plus": {
    title: "Plan Premium Plus",
    pricePerUnit: 100,
    minimumMonthly: 10000,
    maxUnits: Infinity,
    features: [
      "Todo lo del plan Profesional",
      "Soporte multiusuario para equipos",
      "Atención telefónica prioritaria",
    ],
  },
};

const calculatePrice = (plan, units, billing) => {
  const safeUnits = Math.max(1, Math.min(Number(units), plan.maxUnits || Infinity));
  let price;
  if (plan.maxUnits === Infinity) {
    price = plan.minimumMonthly * (billing === 'monthly' ? 1 : 12);
    if (billing === 'yearly') price *= 0.85;
  } else {
    price = plan.pricePerUnit * safeUnits * (billing === 'monthly' ? 1 : 12);
    if (billing === 'yearly') price *= 0.85;

    // Si minimumMonthly no está definido, no se aplica mínimo
    const minPrice = plan.minimumMonthly ? plan.minimumMonthly * (billing === 'monthly' ? 1 : 12) : 0;
    if (price < minPrice) price = minPrice;
  }
  return Math.round(price);
};

const PlanConfirmationPage = () => {
  const { planName } = useParams();
  const location = useLocation();

  const normalizedPlanName = planName.toLowerCase().replace(/-/g, ' ').trim();
  const plan = planInfo[normalizedPlanName];

  const query = new URLSearchParams(location.search);
  const billing = query.get('billing') === 'yearly' ? 'yearly' : 'monthly';

  let units = parseInt(query.get('units'));
  if (isNaN(units) || units < 1) units = 1;

  if (!plan) {
    return (
      <div className="p-8 text-center text-gray-700">
        <h2 className="text-xl font-bold">Plan no encontrado</h2>
        <p>Volvé a la página de planes e intentá nuevamente.</p>
        <Link to="/planes" className="text-blue-600 underline mt-4 inline-block">
          Volver a planes
        </Link>
      </div>
    );
  }

  // Asegurar que units no supere el max permitido
  units = Math.min(units, plan.maxUnits || units);

  // Recalcular el precio correctamente según unidades y facturación
  const price = calculatePrice(plan, units, billing);
  const priceText = billing === 'monthly' ? `${price} UYU/mes` : `${price} UYU/año`;

  const phoneNumber = '59898235535';
  const message = encodeURIComponent(
    `Hola, hice el pago del ${plan.title} (${billing === 'monthly' ? 'mensual' : 'anual'}), gestionando ${units} unidad${units > 1 ? 'es' : ''}. Adjunto comprobante. ¿Podrían validarlo? Gracias.`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full text-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">✅ Solicitud enviada</h2>
        <p className="mb-4">
          Gracias por solicitar el <strong>{plan.title}</strong>. Tu pedido fue registrado y está en
          estado <strong className="text-yellow-600">pendiente de pago</strong>.
        </p>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">📋 Detalles del plan</h3>
          <p className="text-sm mb-1">
            Costo: <strong>{priceText}</strong>
          </p>
          <p className="text-sm mb-1">
            Unidades a gestionar: <strong>{units}</strong>
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {plan.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm mb-6">
          <h4 className="font-semibold mb-1">💵 Instrucciones de pago</h4>
          <p>Realizá una transferencia a:</p>
          <p>Banco: BROU</p>
          <p>Cuenta: CA 001472266-00002</p>
          <p>A nombre de: Bruno Gimenez</p>
          <p className="mt-2">
            📩 Enviá el comprobante a <strong>Brunogimenez23@hotmail.com</strong> o por WhatsApp al{' '}
            <strong>+598 98 235535</strong>
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
            aria-label="Enviar comprobante por WhatsApp"
          >
            <FaWhatsapp className="w-5 h-5" />
            Enviar comprobante por WhatsApp
          </a>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          Activaremos tu plan una vez validado el pago. Te notificaremos por email o WhatsApp.
        </div>

        <div className="flex justify-center">
          <Link
            to="/planes"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Volver a planes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlanConfirmationPage;
