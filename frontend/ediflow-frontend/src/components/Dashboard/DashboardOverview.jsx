// src/components/dashboard/DashboardOverview.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from 'react-router-dom';
import { Building2, Users2, DollarSign, MapPin, ClipboardList } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useBuildingsContext } from '../../contexts/BuildingContext';
import { usePaymentContext } from "../../contexts/PaymentContext";
import axios from 'axios';
import StatCard from './StatCard';
import PaymentsChart from './PaymentsChart';
import TicketsOverview from './TicketsOverview'; // <-- import agregado

// --- CONSTANTES ---
const planFeatures = {
  ESENCIAL: { canSeePayments: false, canManageResidents: true, canViewBuildings: true, canViewCommonAreas: false, canViewLogHistory: false },
  PROFESIONAL: { canSeePayments: true, canManageResidents: true, canViewBuildings: true, canViewCommonAreas: true, canViewLogHistory: true },
  PREMIUM_PLUS: { canSeePayments: true, canManageResidents: true, canViewBuildings: true, canViewCommonAreas: true, canViewLogHistory: true },
};

const ROLES = { ADMIN: "ADMIN", EMPLOYEE: "EMPLOYEE", SUPPORT: "SUPPORT" };

// --- Colores consistentes por tipo de dato ---
const COLORS = {
  Edificios: "from-blue-600/40 to-blue-500/70",
  Residentes: "from-cyan-500/40 to-teal-500/70",
  Pagos: "from-green-500/40 to-lime-500/70",
  "Áreas Comunes": "from-orange-400/40 to-amber-500/70",
  Portería: "from-purple-500/40 to-purple-600/70",
};

// --- HELPERS ---
const hasFeature = (user, feature) => {
  if (!user?.plan) return false;
  const planKey = user.plan.toUpperCase().replace(/\s+/g, '_');
  return planFeatures[planKey]?.[feature] ?? false;
};

const calculateTotals = (payments) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  return payments.reduce((acc, p) => {
    if (!p.issueDate) return acc;
    const [y, m] = p.issueDate.split("-").map(Number);
    if (y !== currentYear || m !== currentMonth) return acc;

    let status = typeof p.status === "string" ? p.status.toUpperCase() : p.status?.name?.toUpperCase();
    const dueDate = p.dueDate ? new Date(p.dueDate) : null;
    if (!["PAID", "CANCELLED"].includes(status)) {
      status = dueDate && dueDate < now ? "OVERDUE" : "PENDING";
    }

    const amount = Number(p.amount || 0);
    acc.total += amount;
    if (status === "PAID") acc.paid += amount;
    else if (status === "PENDING") acc.pending += amount;
    else if (status === "CANCELLED") acc.cancelled += amount;
    else if (status === "OVERDUE") acc.overdue += amount;
    return acc;
  }, { total: 0, paid: 0, pending: 0, cancelled: 0, overdue: 0 });
};

// --- COMPONENTES AUXILIARES ---
const SkeletonCard = () => (
  <div className="animate-pulse bg-gradient-to-r from-gray-200/40 via-gray-100/40 to-gray-200/40 rounded-xl shadow-md p-5 h-40 flex flex-col items-center justify-center">
    <div className="w-12 h-12 bg-gray-300/50 rounded-full mb-3"></div>
    <div className="h-6 w-20 bg-gray-300/50 mb-2 rounded"></div>
    <div className="h-4 w-16 bg-gray-300/50 rounded"></div>
  </div>
);

const SkeletonChart = () => (
  <div className="animate-pulse bg-gradient-to-r from-gray-200/40 via-gray-100/40 to-gray-200/40 rounded-xl shadow-md h-64"></div>
);

// --- MINI KPI COMPONENT ---
const MiniKPI = ({ label, number, color }) => (
  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${color} mr-1`}>
    {label}: {number}
  </span>
);

// --- HOOK PERSONALIZADO PARA FETCH ---
const useDashboardData = (token, buildingId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [residentCount, setResidentCount] = useState(0);
  const [commonAreasCount, setCommonAreasCount] = useState(0);
  const [logHistoryCount, setLogHistoryCount] = useState(0);
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [totals, setTotals] = useState({ total: 0, paid: 0, pending: 0, cancelled: 0, overdue: 0 });

  const [globalResidentCount, setGlobalResidentCount] = useState(0);
  const [globalCommonAreasCount, setGlobalCommonAreasCount] = useState(0);
  const [globalLogHistoryCount, setGlobalLogHistoryCount] = useState(0);
  const [globalPaymentsCount, setGlobalPaymentsCount] = useState(0);
  const [globalTotals, setGlobalTotals] = useState({ total: 0, paid: 0, pending: 0, cancelled: 0, overdue: 0 });

  useEffect(() => {
    if (!token) {
      setError("No hay token disponible.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoints = [
          axios.get(`${import.meta.env.VITE_API_URL}/residents/all`, { headers: { Authorization: `Bearer ${token}` }, params: buildingId ? { buildingId } : {} }),
          axios.get(`${import.meta.env.VITE_API_URL}/common-areas/${buildingId ? `by-building/${buildingId}` : "all"}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/log-entries/${buildingId ? `building/${buildingId}` : "all"}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/payment/all`, { headers: { Authorization: `Bearer ${token}` }, params: { page: 0, size: 1000, ...(buildingId ? { buildingId } : {}) } }),
        ];

        const [resResidents, resCommonAreas, resLogHistory, resPayments] = await Promise.all(endpoints);

        // Totales edificio
        setResidentCount(resResidents.data?.content?.length ?? 0);
        setCommonAreasCount(Array.isArray(resCommonAreas.data) ? resCommonAreas.data.length : 0);
        setLogHistoryCount(resLogHistory.data?.length ?? 0);
        const paymentsArray = resPayments.data?.content || [];
        setPaymentsCount(paymentsArray.length);
        setTotals(calculateTotals(paymentsArray));

        // Totales globales
        const [allRes, allAreas, allLogs, allPayments] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/residents/all`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/common-areas/all`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/log-entries/all`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/payment/all`, { headers: { Authorization: `Bearer ${token}` }, params: { page: 0, size: 1000 } }),
        ]);
        setGlobalResidentCount(allRes.data?.content?.length ?? 0);
        setGlobalCommonAreasCount(Array.isArray(allAreas.data) ? allAreas.data.length : 0);
        setGlobalLogHistoryCount(allLogs.data?.length ?? 0);
        const allPaymentsArray = allPayments.data?.content || [];
        setGlobalPaymentsCount(allPaymentsArray.length);
        setGlobalTotals(calculateTotals(allPaymentsArray));

      } catch (err) {
        if (err.response) setError(`Error ${err.response.status}: ${err.response.data.message || JSON.stringify(err.response.data)}`);
        else setError("Error al cargar datos del dashboard");
      } finally { setLoading(false); }
    };

    fetchData();
  }, [token, buildingId]);

  return {
    loading, error,
    residentCount, commonAreasCount, logHistoryCount, paymentsCount, totals,
    globalResidentCount, globalCommonAreasCount, globalLogHistoryCount, globalPaymentsCount, globalTotals
  };
};

// --- COMPONENTE PRINCIPAL ---
const DashboardOverview = () => {
  const { user, token } = useAuth();
  const { buildings = [], selectedBuilding, setSelectedBuilding } = useBuildingsContext();

  // --- ESTADO LOCAL PARA CONTROLAR EL SELECT ---
  const [localSelectedBuilding, setLocalSelectedBuilding] = useState(selectedBuilding || null);

  const buildingId = localSelectedBuilding?.id || null;

  const {
    loading, error,
    residentCount, commonAreasCount, logHistoryCount, paymentsCount, totals,
    globalResidentCount, globalCommonAreasCount, globalLogHistoryCount, globalPaymentsCount, globalTotals
  } = useDashboardData(token, buildingId);

  const baseStats = useMemo(() => ([
    { type: 'Edificios', number: buildings.length, icon: <Building2 className="w-10 h-10 transition-transform duration-500" />, color: COLORS.Edificios, link: '/admin/buildings', feature: 'canViewBuildings' },
    { type: 'Residentes', number: residentCount, icon: <Users2 className="w-10 h-10 transition-transform duration-500" />, color: COLORS.Residentes, link: '/admin/residents', feature: 'canManageResidents' },
    { type: 'Pagos', number: paymentsCount, icon: <DollarSign className="w-10 h-10 transition-transform duration-500" />, color: COLORS.Pagos, link: '/admin/payment/all', feature: 'canSeePayments' },
    { type: 'Áreas Comunes', number: commonAreasCount, icon: <MapPin className="w-10 h-10 transition-transform duration-500" />, color: COLORS["Áreas Comunes"], link: '/admin/common-areas/all', feature: 'canViewCommonAreas' },
    { type: 'Portería', number: logHistoryCount, icon: <ClipboardList className="w-10 h-10 transition-transform duration-500" />, color: COLORS.Portería, link: '/admin/historial', feature: 'canViewLogHistory' },
  ]), [buildings.length, residentCount, commonAreasCount, logHistoryCount, paymentsCount]);

  const filteredStats = useMemo(() => {
    if (!user) return [];
    return baseStats.filter(stat => {
      const role = user.role?.toUpperCase();
      if (role === ROLES.ADMIN) return hasFeature(user, stat.feature);
      if (role === ROLES.EMPLOYEE) return stat.type !== "Pagos";
      if (role === ROLES.SUPPORT) return ["Residentes", "Áreas Comunes"].includes(stat.type);
      return false;
    });
  }, [user, baseStats]);

  const showPaymentsChart = user?.role?.toUpperCase() === ROLES.ADMIN && hasFeature(user, "canSeePayments");

  if (loading) return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: filteredStats.length }).map((_, i) => (<SkeletonCard key={i} />))}
      </div>
      {showPaymentsChart && <SkeletonChart />}
    </div>
  );

  if (error) return <p className="text-center py-8 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-10">

      {/* Selector de edificio */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="w-auto md:w-auto">
          <select
            className="w-full md:w-auto p-2 border rounded-lg shadow-sm bg-white text-gray-700"
            value={localSelectedBuilding?.id || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setLocalSelectedBuilding(null); // Todos los edificios
                setSelectedBuilding(null);
              } else {
                const b = buildings.find(b => b.id === Number(value)) || null;
                setLocalSelectedBuilding(b);
                setSelectedBuilding(b);
              }
            }}
          >
            <option value="">Todos los edificios</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>{building.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards filtradas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStats.map((stat) => (
          <Link
            to={stat.link}
            key={stat.type}
            className={`block rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 p-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gradient-to-br ${stat.color} bg-opacity-80 backdrop-blur-sm relative`}
            aria-label={`Ver detalles de ${stat.type}`}
          >
            <div className="hidden sm:flex flex-col items-center justify-center text-center relative">
              <div className="relative">
                <div className="bg-white/30 rounded-full p-3 mb-3 flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform duration-500 z-10">
                  {stat.icon}
                </div>
                {stat.type === "Pagos" && totals.pending > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow" title={`${totals.pending} pagos pendientes`}>
                    {totals.pending}
                  </span>
                )}
                {stat.type === "Pagos" && totals.overdue > 0 && (
                  <span className="absolute -top-5 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow" title={`${totals.overdue} pagos vencidos`}>
                    {totals.overdue}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900 drop-shadow-sm">{stat.number}</p>
              <p className="text-gray-700 mt-1">{stat.type}</p>
            </div>
            <div className="flex sm:hidden items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/30 rounded-full p-2 backdrop-blur-sm">{stat.icon}</div>
                <div>
                  <p className="text-lg font-semibold">{stat.type}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.number}</p>
                </div>
              </div>
              <div className="text-gray-400">{">"}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Gráfico de pagos */}
      {showPaymentsChart && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-indigo-600">Resumen de pagos</h2>
          <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transition-all duration-700 animate-fade-in">
            <PaymentsChart />
          </div>
        </div>
      )}

      {/* Tickets y reclamos */}
      {user?.role?.toUpperCase() === ROLES.ADMIN && (
        <div className="flex flex-col gap-4 mt-8">
          <h2 className="text-2xl font-semibold text-indigo-600">Tickets y reclamos</h2>
          <TicketsOverview buildingId={buildingId} />
        </div>
      )}

    </div>
  );
};

export default DashboardOverview;
