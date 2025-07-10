
import { useState } from "react";
import axios from "axios";

const useMercadoPago = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPreference = async ({ planName, quantity, unitPrice, successUrl, failureUrl }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/payment/create-preference", {
        planName,
        quantity,
        unitPrice,
        successUrl,
        failureUrl,
      });

      const { paymentUrl } = response.data;
      return paymentUrl;
    } catch (err) {
      console.error("Error al crear preferencia de pago:", err);
      setError("Ocurrió un error al generar el enlace de pago");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPreference, loading, error };
};

export default useMercadoPago;
