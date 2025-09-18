import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import PricingPlans from "../landing/PricingPlans";

const TrialExpiredBanner = ({ user }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Mostrar solo si la prueba venció
  if (!user || user.trialDaysLeft === null || user.trialDaysLeft > 0) {
    return null;
  }

  const handleClickUpgrade = () => setShowUpgrade(!showUpgrade);

  const handleSelectPlan = (plan, units, billing) => {
    console.log("Plan seleccionado:", plan.name, "Unidades:", units, "Facturación:", billing);
    alert(`Seleccionaste ${plan.name} (${units > 1 ? "es" : ""}) - ${billing}`);
  };

  return (
    <div className="mx-6 mt-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Tu período de prueba ha finalizado.</p>
            <p className="text-sm">Actualiza tu plan para seguir usando Ediflow sin interrupciones.</p>
          </div>
        </div>
        <button
          onClick={handleClickUpgrade}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium transition"
        >
          Actualizar plan
        </button>
      </div>

      {showUpgrade && (
        <div className="mt-4">
          <PricingPlans id="upgrade-plans" mode="upgrade" onSelectPlan={handleSelectPlan} />
        </div>
      )}
    </div>
  );
};

export default TrialExpiredBanner;
