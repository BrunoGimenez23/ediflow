import React, { useState } from "react";
import { Bell } from "lucide-react"; // icono de notificaciones
import { useAuth } from "../../contexts/AuthContext";
import PorterRegister from "../../components/porteria/PorterRegister";
import LogHistory from "../../components/porteria/LogHistory";

const PorterDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("registro");

  const buildingId = user?.buildingId;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Portero - <span className="text-blue-600">{user?.fullName}</span>
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("registro")}
          className={`px-4 py-2 font-semibold rounded-t-md ${
            activeTab === "registro"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Registrar
        </button>
        <button
          onClick={() => setActiveTab("historial")}
          className={`px-4 py-2 font-semibold rounded-t-md ${
            activeTab === "historial"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Historial
        </button>
        <button
          onClick={() => setActiveTab("notificaciones")}
          className={`px-4 py-2 font-semibold rounded-t-md flex items-center gap-1 ${
            activeTab === "notificaciones"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Bell className="w-4 h-4" /> Notificaciones
        </button>
      </div>

      {/* Contenido de cada tab */}
      <div className="bg-white rounded shadow p-6 min-h-[400px]">
        {activeTab === "registro" && <PorterRegister />}
        {activeTab === "historial" &&
          (buildingId ? (
            <LogHistory buildingId={buildingId} userRole="PORTER" />
          ) : (
            <p className="text-red-500 text-center mt-10">
              No tenés un edificio asignado.
            </p>
          ))}
        {activeTab === "notificaciones" && (
          <div className="text-gray-500 text-center mt-20">
            No hay notificaciones por ahora.
          </div>
        )}
      </div>
    </div>
  );
};

export default PorterDashboard;
