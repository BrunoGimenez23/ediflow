import React, { useState } from "react";
import { Bell, XCircle, ClipboardList, PlusCircle } from "lucide-react"; // iconos
import { useAuth } from "../../contexts/AuthContext";
import PorterRegister from "../../components/porteria/PorterRegister";
import LogHistory from "../../components/porteria/LogHistory";

const PorterDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("registro");

  const buildingId = user?.buildingId;

  const tabs = [
    { key: "registro", label: "Registrar", icon: <PlusCircle className="w-4 h-4" /> },
    { key: "historial", label: "Historial", icon: <ClipboardList className="w-4 h-4" /> },
    { key: "notificaciones", label: "Notificaciones", icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2 flex flex-wrap items-center gap-2">
        Dashboard Portero 
        <span className="text-blue-600">{user?.fullName}</span>
        {buildingId && (
          <span className="ml-2 px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
            Edificio #{buildingId}
          </span>
        )}
      </h1>
      <p className="text-gray-500 mb-6">Bienvenido al panel de control de portería</p>

      {/* Tabs */}
      <div role="tablist" className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 relative">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-semibold rounded-t-md transition-colors duration-200 flex items-center gap-2 ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de cada tab */}
      <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px] transition-all duration-300">
        {activeTab === "registro" && (
          <div className="transition-opacity duration-300 opacity-100">
            <PorterRegister />
          </div>
        )}

        {activeTab === "historial" && (
          <div className={`transition-opacity duration-300 ${activeTab === "historial" ? "opacity-100" : "opacity-0"}`}>
            {buildingId ? (
              <LogHistory buildingId={buildingId} userRole="PORTER" />
            ) : (
              <p className="text-red-500 text-center mt-10 flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" /> No tenés un edificio asignado.
              </p>
            )}
          </div>
        )}

        {activeTab === "notificaciones" && (
          <div className={`transition-opacity duration-300 ${activeTab === "notificaciones" ? "opacity-100" : "opacity-0"} text-gray-500 text-center mt-20`}>
            No hay notificaciones por ahora.
          </div>
        )}
      </div>
    </div>
  );
};

export default PorterDashboard;
