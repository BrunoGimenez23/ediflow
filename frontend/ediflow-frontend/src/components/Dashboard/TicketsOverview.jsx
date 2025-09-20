// src/components/dashboard/TicketsOverview.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { AlertCircle, MessageCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const COLORS = {
  Avisos: "from-blue-500/40 to-blue-600/70",
  Reclamos: "from-orange-400/40 to-orange-500/70",
  Resueltos: "from-green-400/40 to-green-500/70",
};

const TicketsOverview = ({ buildingId }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [metrics, setMetrics] = useState({ avisos: 0, reclamos: 0, resueltos: 0 });

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = buildingId
          ? `${import.meta.env.VITE_API_URL}/tickets/by-building/${buildingId}`
          : `${import.meta.env.VITE_API_URL}/tickets/all`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTickets(res.data);

        const avisos = res.data.filter(t => t.type === "NOTICE").length;
        const reclamos = res.data.filter(t => t.type === "COMPLAINT").length;
        const resueltos = res.data.filter(t => t.status === "RESOLVED").length;

        setMetrics({ avisos, reclamos, resueltos });
      } catch (err) {
        console.error(err);
        setError("Error al cargar tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token, buildingId]);

  if (loading) return <p>Cargando tickets...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const stats = [
    { type: "Avisos", number: metrics.avisos, icon: <AlertCircle className="w-10 h-10" />, color: COLORS.Avisos },
    { type: "Reclamos", number: metrics.reclamos, icon: <MessageCircle className="w-10 h-10" />, color: COLORS.Reclamos },
    { type: "Resueltos", number: metrics.resueltos, icon: <CheckCircle className="w-10 h-10" />, color: COLORS.Resueltos },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map(stat => (
        <div
          key={stat.type}
          className={`block rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 p-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gradient-to-br ${stat.color} bg-opacity-80 backdrop-blur-sm relative`}
        >
          <div className="flex flex-col items-center justify-center text-center relative">
            <div className="relative">
              <div className="bg-white/30 rounded-full p-3 mb-3 flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform duration-500 z-10">
                {stat.icon}
              </div>

              {/* Badges para avisos y reclamos pendientes */}
              {stat.type === "Avisos" && stat.number > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow" title={`${stat.number} avisos`}>
                  {stat.number}
                </span>
              )}
              {stat.type === "Reclamos" && stat.number > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow" title={`${stat.number} reclamos`}>
                  {stat.number}
                </span>
              )}
            </div>

            <p className="text-3xl font-bold text-gray-900 drop-shadow-sm">{stat.number}</p>
            <p className="text-gray-100 mt-1 font-semibold">{stat.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketsOverview;
