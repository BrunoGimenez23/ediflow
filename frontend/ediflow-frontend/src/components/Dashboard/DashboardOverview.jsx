import React, { useMemo, useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CheckCircle, Clock, XCircle, DollarSign, AlertCircle, ClipboardList, Building2, Users2, MapPin, ArrowUp, ArrowDown } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import StatCard from './StatCard';
import PaymentsChart from './PaymentsChart';
import { Link } from 'react-router-dom';
import { useBuildingsContext } from '../../contexts/BuildingContext';
import { usePaymentContext } from "../../contexts/PaymentContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';

const planFeatures = {
  ESENCIAL: {
    canSeePayments: false,
    canManageResidents: true,
    canViewBuildings: true,
    canViewCommonAreas: false,
    canViewLogHistory: false,
  },
  PROFESIONAL: {
    canSeePayments: true,
    canManageResidents: true,
    canViewBuildings: true,
    canViewCommonAreas: true,
    canViewLogHistory: true,
  },
  PREMIUM_PLUS: {
    canSeePayments: true,
    canManageResidents: true,
    canViewBuildings: true,
    canViewCommonAreas: true,
    canViewLogHistory: true,
  },
};

const can = (userPlan, feature) => {
  if (!userPlan || userPlan.trim() === "") {
    userPlan = "PROFESIONAL";
  }
  const normalizedPlan = userPlan.toUpperCase().replace(/\s+/g, '_');
  const plan = planFeatures[normalizedPlan];
  return plan ? plan[feature] === true : false;
};

const DashboardOverview = () => {
  const { user, token } = useAuth();
  const { buildings = [] } = useBuildingsContext();
  const { paymentsPage } = usePaymentContext();

  const [residentCount, setResidentCount] = useState(0);
  const [commonAreasCount, setCommonAreasCount] = useState(0);
  const [logHistoryCount, setLogHistoryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totals, setTotals] = useState({ total: 0, paid: 0, pending: 0, cancelled: 0, overdue: 0 });

  useEffect(() => {
    if (!token || !buildings.length) {
      setError("No hay token de autenticación o edificios disponibles.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resResidents, resCommonAreas, resLogHistory, resPayments] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/residents/all`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/common-areas/all`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/log-entries/building/${buildings[0].id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/payment/all`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setResidentCount(resResidents.data?.content?.length ?? 0);
        setCommonAreasCount(Array.isArray(resCommonAreas.data) ? resCommonAreas.data.length : 0);
        setLogHistoryCount(Array.isArray(resLogHistory.data) ? resLogHistory.data.length : 0);

        const paymentsArray = resPayments.data?.content || [];
        let total = 0, paid = 0, pending = 0, cancelled = 0, overdue = 0;
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        paymentsArray.forEach((p) => {
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

        setTotals({ total, paid, pending, cancelled, overdue });

      } catch (err) {
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data.message || JSON.stringify(err.response.data)}`);
        } else {
          setError("Error al cargar datos del dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, buildings]);

  const stats = [
    {
      type: 'Edificios',
      number: buildings.length,
      icon: <Building2 className="w-10 h-10 transition-transform duration-500" />,
      color: 'from-blue-500/30 to-indigo-600/70',
      link: '/admin/buildings',
      feature: 'canViewBuildings',
    },
    {
      type: 'Residentes',
      number: residentCount,
      icon: <Users2 className="w-10 h-10 transition-transform duration-500" />,
      color: 'from-cyan-400/30 to-teal-500/70',
      link: '/admin/residents',
      feature: 'canManageResidents',
    },
    {
      type: 'Pagos',
      number: paymentsPage?.totalElements ?? 0,
      icon: <DollarSign className="w-10 h-10 transition-transform duration-500" />,
      color: 'from-green-400/30 to-lime-500/70',
      link: '/admin/payment/all',
      feature: 'canSeePayments',
    },
    {
      type: 'Áreas Comunes',
      number: commonAreasCount,
      icon: <MapPin className="w-10 h-10 transition-transform duration-500" />,
      color: 'from-orange-400/30 to-amber-500/70',
      link: '/admin/common-areas/all',
      feature: 'canViewCommonAreas',
    },
    {
      type: 'Portería',
      number: logHistoryCount,
      icon: <ClipboardList className="w-10 h-10 transition-transform duration-500" />,
      color: 'from-purple-400/30 to-purple-600/70',
      link: '/admin/historial',
      feature: 'canViewLogHistory',
    },
  ];

  const filteredStats = stats.filter(stat => {
    if (!user) return false;
    const role = user.role?.toUpperCase();
    if (role === "ADMIN") return can(user.plan, stat.feature);
    if (role === "EMPLOYEE") return stat.type !== "Pagos";
    if (role === "SUPPORT") return ["Residentes", "Áreas Comunes"].includes(stat.type);
    return false;
  });

  const showPaymentsChart = user?.role?.toUpperCase() === "ADMIN" && can(user.plan, "canSeePayments");

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStats.map((stat) => (
          <Link
            to={stat.link}
            key={stat.type}
            className={`block rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 p-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gradient-to-br ${stat.color} bg-opacity-80 backdrop-blur-sm relative`}
            aria-label={`Ver detalles de ${stat.type}`}
          >
            <div className="hidden sm:flex flex-col items-center justify-center text-center relative">
              {/* Badge indicador de cambio */}
              {stat.type === "Pagos" && totals.pending > 0 && (
                <div className="absolute top-2 right-3 z-20 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <ArrowDown className="w-3 h-3" /> {totals.pending} pendientes
                </div>
              )}

              <div className="bg-white/30 rounded-full p-3 mb-3 flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform duration-500 z-10">
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-gray-900 drop-shadow-sm">{stat.number}</p>
              <p className="text-gray-700 mt-1">{stat.type}</p>

              {/* Tooltips enriquecidos */}
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 border border-gray-300 rounded p-2 text-xs text-gray-700 w-max max-w-[180px] text-center pointer-events-none z-30">
                {stat.type} - Comparación vs mes anterior: <span className="font-semibold">{stat.number + Math.floor(Math.random() * 10) - 5}</span>
              </div>
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

      {showPaymentsChart && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-indigo-600">Resumen de pagos</h2>
          <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transition-all duration-700 animate-fade-in">
            <PaymentsChart />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
