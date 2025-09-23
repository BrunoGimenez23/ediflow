import React from "react";
import { Star } from "lucide-react";

const ProviderCard = ({ provider, onRequestQuote }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between h-full">
      {/* Info del proveedor */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{provider.name}</h3>
        <p className="text-sm text-gray-500 mb-1">{provider.category}</p>
        <p className="text-sm text-gray-400 mb-2">{provider.location}</p>
        <div className="flex items-center text-yellow-500">
          <Star className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium text-gray-700">{provider.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Botones */}
      <div className="mt-auto flex flex-wrap gap-2">
        <button
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-colors"
          onClick={() => onRequestQuote(provider.id)}
        >
          Solicitar Cotización
        </button>
        <button
          className="flex-1 bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition-colors"
          onClick={() => alert(`Ver perfil de ${provider.name}`)}
        >
          Ver Perfil
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;
