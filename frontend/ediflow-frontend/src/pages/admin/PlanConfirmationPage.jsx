
import { useParams } from "react-router-dom";

const planInfo = {
  esencial: {
    title: "Plan Esencial",
    monthlyPrice: "2.000 UYU/mes",
    features: [
      "Gestión de edificios, apartamentos y residentes",
      "Panel para residentes gratuito",
      "Ideal para comunidades pequeñas",
    ],
  },
  profesional: {
    title: "Plan Profesional",
    monthlyPrice: "3.000 UYU/mes",
    features: [
      "Todo lo del plan Esencial",
      "Emisión de expensas y estados de pago",
      "Reservas de espacios comunes",
      "Reportes y gráficos",
    ],
  },
  "premium plus": {
    title: "Plan Premium Plus",
    monthlyPrice: "10.000 UYU/mes",
    features: [
      "Todo lo del plan Profesional",
      "Soporte multiusuario para equipos",
      "Atención telefónica prioritaria",
    ],
  },
};

const PlanConfirmationPage = () => {
  const { planName } = useParams();
  const plan = planInfo[planName];

  if (!plan) {
    return (
      <div className="p-8 text-center text-gray-700">
        <h2 className="text-xl font-bold">Plan no encontrado</h2>
        <p>Volvé a la página de planes e intentá nuevamente.</p>
      </div>
    );
  }

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
          <p className="text-sm mb-1">Costo mensual: <strong>{plan.monthlyPrice}</strong></p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {plan.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm mb-6">
          <h4 className="font-semibold mb-1">💵 Instrucciones de pago</h4>
          <p>Realizá una transferencia a:</p>
          <p>Banco: BROU</p>
          <p>Cuenta: 12345678</p>
          <p>A nombre de: Ediflow</p>
          <p className="mt-2">📩 Enviá el comprobante a <strong>pagos@ediflow.com</strong> o por WhatsApp al <strong>+598 9 XXX XXX</strong></p>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          Activaremos tu plan una vez validado el pago. Te notificaremos por email.
        </div>

        <div className="flex justify-center">
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Volver al panel principal
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlanConfirmationPage;
