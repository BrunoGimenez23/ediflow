import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const plans = [
  {
    name: 'ESENCIAL',
    maxUnits: 50,
  },
  {
    name: 'PROFESIONAL',
    maxUnits: 150,
  },
  {
    name: 'PREMIUM_PLUS',
    maxUnits: Infinity,
  },
];

const AssignPlanForm = () => {
  const { user, token } = useAuth();
  const [email, setEmail] = useState("");
  const [planName, setPlanName] = useState("ESENCIAL");
  const [duration, setDuration] = useState("monthly");
  const [unitsPaid, setUnitsPaid] = useState(1);
  const [message, setMessage] = useState("");

  if (user?.email !== "bruno@ediflow.com") return null;

  // Obtener maxUnits del plan seleccionado
  const currentPlan = plans.find((p) => p.name === planName);
  const maxUnits = currentPlan ? currentPlan.maxUnits : 50;

  const handleUnitsChange = (value) => {
    let intVal = parseInt(value);
    if (isNaN(intVal) || intVal < 1) intVal = 1;
    if (intVal > maxUnits) intVal = maxUnits;
    setUnitsPaid(intVal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/subscription/assign-plan`,
        { email, planName, duration, unitsPaid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data || "Error al asignar plan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Asignar plan manual</h3>
      <input
        type="email"
        placeholder="Email del admin"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 mb-3 border rounded"
      />
      <select
        value={planName}
        onChange={(e) => {
          setPlanName(e.target.value);
          // Resetear unitsPaid a 1 al cambiar plan para evitar unidades inválidas
          setUnitsPaid(1);
        }}
        className="w-full p-2 mb-3 border rounded"
      >
        <option value="ESENCIAL">Esencial</option>
        <option value="PROFESIONAL">Profesional</option>
        <option value="PREMIUM_PLUS">Premium Plus</option>
      </select>
      <select
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      >
        <option value="monthly">Mensual</option>
        <option value="yearly">Anual</option>
      </select>

      {/* Input para unidades pagadas con validación */}
      <input
        type="number"
        min={1}
        max={maxUnits === Infinity ? undefined : maxUnits}
        placeholder={`Unidades pagadas (máx. ${maxUnits === Infinity ? 'Ilimitadas' : maxUnits})`}
        value={unitsPaid}
        onChange={(e) => handleUnitsChange(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Asignar plan
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default AssignPlanForm;
