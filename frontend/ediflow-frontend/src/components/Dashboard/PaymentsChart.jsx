import React, { useMemo, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { CheckCircle, Clock, XCircle, DollarSign, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";
import useFetch from "../../hooks/useFetch";

const PaymentsChart = () => {
  const { data: payments, loading, error } = useFetch("/payment/all");
  const [hoveredBar, setHoveredBar] = useState(null);

  const chartData = useMemo(() => {
    if (!payments) return [];
    const paymentsArray = payments.content || [];
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const grouped = {};

    paymentsArray.forEach((p) => {
      if (!p.issueDate) return;
      const [year, month, day] = p.issueDate.split("-").map(Number);
      if (year !== currentYear || month !== currentMonth) return;

      let status = typeof p.status === "string" ? p.status.toUpperCase() : p.status?.name?.toUpperCase();
      const dueDate = p.dueDate ? new Date(p.dueDate) : null;
      if (status !== "PAID" && status !== "CANCELLED") {
        status = dueDate && dueDate < now ? "OVERDUE" : "PENDING";
      }

      if (!grouped[day]) grouped[day] = { day, PAID: 0, PENDING: 0, CANCELLED: 0, OVERDUE: 0, TOTAL: 0 };

      grouped[day][status] += Number(p.amount);
      grouped[day].TOTAL += Number(p.amount);
    });

    return Object.values(grouped).sort((a, b) => a.day - b.day);
  }, [payments]);

  const totals = useMemo(() => {
    if (!payments) return { total: 0, paid: 0, pending: 0, cancelled: 0, overdue: 0 };
    let total = 0, paid = 0, pending = 0, cancelled = 0, overdue = 0;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    payments.content?.forEach((p) => {
      if (!p.issueDate) return;
      const [y, m] = p.issueDate.split("-").map(Number);
      if (y !== currentYear || m !== currentMonth) return;

      total += Number(p.amount);

      let status = typeof p.status === "string" ? p.status.toUpperCase() : p.status?.name?.toUpperCase();
      const dueDate = p.dueDate ? new Date(p.dueDate) : null;
      if (status !== "PAID" && status !== "CANCELLED") {
        status = dueDate && dueDate < now ? "OVERDUE" : "PENDING";
      }

      if (status === "PAID") paid += Number(p.amount);
      else if (status === "PENDING") pending += Number(p.amount);
      else if (status === "CANCELLED") cancelled += Number(p.amount);
      else if (status === "OVERDUE") overdue += Number(p.amount);
    });

    return { total, paid, pending, cancelled, overdue };
  }, [payments]);

  if (loading) return <p className="text-center py-8 text-gray-600">Cargando datos...</p>;
  if (error) return <p className="text-center py-8 text-red-600">{error}</p>;
  if (!chartData.length) return <p className="text-center py-8 text-gray-600">No hay pagos registrados este mes.</p>;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const paid = payload.find((p) => p.dataKey === "PAID")?.value || 0;
      const pending = payload.find((p) => p.dataKey === "PENDING")?.value || 0;
      const cancelled = payload.find((p) => p.dataKey === "CANCELLED")?.value || 0;
      const overdue = payload.find((p) => p.dataKey === "OVERDUE")?.value || 0;
      const total = payload.find((p) => p.dataKey === "TOTAL")?.value || 0;

      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm">
          <p className="font-semibold text-gray-700">Día: <span className="font-normal">{label}</span></p>
          <p className="font-semibold text-edigreen">Pagados: <span className="font-normal">${paid.toLocaleString("es-UY")}</span></p>
          <p className="font-semibold text-ediorange">Pendientes: <span className="font-normal">${pending.toLocaleString("es-UY")}</span></p>
          <p className="font-semibold text-red-600">Cancelados: <span className="font-normal">${cancelled.toLocaleString("es-UY")}</span></p>
          <p className="font-semibold text-red-800">Vencidos: <span className="font-normal">${overdue.toLocaleString("es-UY")}</span></p>
          <p className="font-semibold text-ediblue mt-1 border-t border-gray-200 pt-1">Total: <span className="font-normal">${total.toLocaleString("es-UY")}</span></p>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ icon: Icon, label, value, description, highlight }) => (
    <div className={`flex-1 min-w-[120px] bg-white p-3 rounded-xl shadow transition-transform transform ${highlight ? "scale-105 shadow-2xl" : "hover:scale-105 hover:shadow-xl"} cursor-pointer relative group`}>
      <div className="flex flex-col items-center justify-center">
        <Icon className="mb-1 w-5 h-5" />
        <p className="font-semibold">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 border border-gray-300 rounded p-2 text-xs text-gray-700 w-max max-w-[180px] text-center pointer-events-none z-10">
        {description}
      </div>
    </div>
  );

  const pieData = [
    { name: "Pagados", value: totals.paid },
    { name: "Pendientes", value: totals.pending },
  ];
  const pieColors = ["#10B981", "#F97316"];

  // Encuentra día con más pagos pendientes
  const maxPendingDay = chartData.reduce((acc, day) => {
    if (!acc || day.PENDING > acc.PENDING) return day;
    return acc;
  }, null);

  return (
    <section className="bg-white rounded-3xl shadow-xl p-4 md:p-6 w-full mt-6 max-w-full md:max-w-[900px] mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 select-none">Pagos del mes</h2>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <StatCard icon={DollarSign} label="Total" value={`$${totals.total.toLocaleString("es-UY")}`} description="Suma total de todos los pagos registrados este mes" highlight={hoveredBar === "TOTAL"} />
        <StatCard icon={CheckCircle} label="Pagados" value={`$${totals.paid.toLocaleString("es-UY")}`} description={`Pagos completados este mes (${((totals.paid / totals.total) * 100 || 0).toFixed(1)}%)`} highlight={hoveredBar === "PAID"} />
        <StatCard icon={Clock} label="Pendientes" value={`$${totals.pending.toLocaleString("es-UY")}`} description={`Pagos pendientes este mes (${((totals.pending / totals.total) * 100 || 0).toFixed(1)}%)`} highlight={hoveredBar === "PENDING"} />
        <StatCard icon={XCircle} label="Cancelados" value={`$${totals.cancelled.toLocaleString("es-UY")}`} description={`Pagos cancelados este mes (${((totals.cancelled / totals.total) * 100 || 0).toFixed(1)}%)`} highlight={hoveredBar === "CANCELLED"} />
        <StatCard icon={AlertCircle} label="Vencidos" value={`$${totals.overdue.toLocaleString("es-UY")}`} description={`Pagos vencidos este mes (${((totals.overdue / totals.total) * 100 || 0).toFixed(1)}%)`} highlight={hoveredBar === "OVERDUE"} />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" tick={{ fill: "#4b5563", fontWeight: "600" }} axisLine={{ stroke: "#d1d5db" }} tickLine={false} padding={{ left: 10, right: 10 }} />
          <YAxis tick={{ fill: "#4b5563", fontWeight: "600" }} axisLine={{ stroke: "#d1d5db" }} tickLine={false} width={90} tickFormatter={(value) => `$${value.toLocaleString("es-UY")}`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="PAID" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} cursor="pointer" onMouseEnter={() => setHoveredBar("PAID")} onMouseLeave={() => setHoveredBar(null)} />
          <Bar dataKey="PENDING" stackId="a" fill="#F97316" radius={[4, 4, 0, 0]} cursor="pointer" onMouseEnter={() => setHoveredBar("PENDING")} onMouseLeave={() => setHoveredBar(null)} />
          <Bar dataKey="CANCELLED" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} cursor="pointer" onMouseEnter={() => setHoveredBar("CANCELLED")} onMouseLeave={() => setHoveredBar(null)} />
          <Bar dataKey="OVERDUE" stackId="a" fill="#B91C1C" radius={[4, 4, 0, 0]} cursor="pointer" onMouseEnter={() => setHoveredBar("OVERDUE")} onMouseLeave={() => setHoveredBar(null)} />
          <Line type="monotone" dataKey="TOTAL" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} onMouseEnter={() => setHoveredBar("TOTAL")} onMouseLeave={() => setHoveredBar(null)} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Mini indicador del día con más pendientes */}
      {maxPendingDay && maxPendingDay.PENDING > 0 && (
        <p className="mt-2 text-sm text-red-600 font-semibold">
          Día con más pagos pendientes: <span className="font-bold">{maxPendingDay.day} (${maxPendingDay.PENDING.toLocaleString("es-UY")})</span>
        </p>
      )}

      {/* Gráfico de pastel interactivo */}
      <h3 className="text-lg md:text-xl font-semibold mt-8 mb-4 text-gray-800 select-none">Pagos Pendientes vs Pagados</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
};

export default PaymentsChart;
