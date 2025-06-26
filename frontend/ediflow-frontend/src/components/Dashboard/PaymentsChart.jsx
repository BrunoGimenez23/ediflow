import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import useFetch from "../../hooks/useFetch";

const PaymentsChart = () => {
  const { data: payments, loading, error } = useFetch("/payment/all");

  const chartData = useMemo(() => {
    if (!payments) return [];

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const grouped = payments.reduce((acc, payment) => {
      if (!payment.issueDate) return acc;
      const parts = payment.issueDate.split("-");
      if (parts.length !== 3) return acc;
      const [year, month, day] = parts.map(Number);
      if (year !== currentYear || month !== currentMonth) return acc;
      acc[day] = (acc[day] || 0) + Number(payment.amount);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([day, monto]) => ({ day, monto }))
      .sort((a, b) => a.day - b.day);
  }, [payments]);

  if (loading)
    return (
      <p className="text-center py-8 text-gray-600">Cargando datos...</p>
    );
  if (error)
    return <p className="text-center py-8 text-red-600">{error}</p>;
  if (!chartData.length)
    return (
      <p className="text-center py-8 text-gray-600">
        No hay pagos registrados este mes.
      </p>
    );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm">
          <p className="font-semibold text-gray-700">
            Día: <span className="font-normal">{label}</span>
          </p>
          <p className="font-semibold text-gray-700">
            Monto:{" "}
            <span className="font-normal text-edigreen">
              ${payload[0].value.toLocaleString("es-UY", { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section
      aria-label="Gráfico de pagos del mes actual"
      className="bg-white rounded-3xl shadow-lg p-6 w-full h-80 mt-6 max-w-full md:max-w-[900px] mx-auto"
    >
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 select-none">
        Pagos del mes
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colormonto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fill: "#4b5563", fontWeight: "600" }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
  tick={{ fill: "#4b5563", fontWeight: "600" }}
  axisLine={{ stroke: "#d1d5db" }}
  tickLine={false}
  width={90}   // <-- acá subí de 60 a 90 o 100
  tickFormatter={(value) => `$${value.toLocaleString("es-UY")}`}
/>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="monto"
            stroke="#2563eb"
            fillOpacity={1}
            fill="url(#colormonto)"
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
};

export default PaymentsChart;
