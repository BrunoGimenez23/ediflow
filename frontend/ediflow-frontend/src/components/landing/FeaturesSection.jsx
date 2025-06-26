import { Building2, Cloud, CreditCard } from 'lucide-react';
import React from 'react';

const features = [
  {
    icon: <Building2 className="w-12 h-12 text-ediblue" />,
    title: "Administración de edificios",
    desc: "Gestioná edificios, departamentos y residentes desde un solo lugar.",
  },
  {
    icon: <CreditCard className="w-12 h-12 text-ediblue" />,
    title: "Control de pagos",
    desc: "Llevá el control de pagos y vencimientos de cada residente de forma organizada.",
  },
  {
    icon: <Cloud className="w-12 h-12 text-ediblue" />,
    title: "Fácil de usar",
    desc: "Diseñada para que cualquier administrador gestione sin complicaciones.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-edigray w-full py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-editext">Funcionalidades principales</h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Todo lo que necesitás para administrar edificios en una sola plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
          {features.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md w-full max-w-xs text-center hover:shadow-lg hover:scale-[1.02] transition duration-300"
            >
              <div className="flex justify-center mb-4">
                {icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
