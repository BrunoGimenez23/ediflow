import React from "react";
import { useNavigate } from "react-router-dom";
import PricingPlans from "../landing/PricingPlans";

const UpgradePlansContainer = () => {
  const navigate = useNavigate();

  const handleUpgradeClick = (planName) => {
    // Navegamos a PlanConfirmationPage usando query param
    navigate(`/admin/plan-confirmation/${planName}`);
  };

  return (
    <PricingPlans
      id="pricing-plans"
      isUpgrade={true}
      onUpgradeClick={handleUpgradeClick}
    />
  );
};

export default UpgradePlansContainer;
