import React, { useEffect, useState } from "react";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";

initMercadoPago("APP_USR-faa06cea-c9af-48e2-ab0f-b8139b2f6759"); // Public Key Sandbox

const PaymentButton = ({ paymentId, userEmail }) => {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    const createPreference = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/checkout/${paymentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const initPoint = await res.text();
      setPreferenceId(initPoint); // Sandbox initPoint
    };
    createPreference();
  }, [paymentId]);

  if (!preferenceId) return <p>Cargando botón de pago...</p>;

  return (
    <div style={{ width: "300px" }}>
      <Wallet initialization={{ preferenceId }} />
    </div>
  );
};

export default PaymentButton;
