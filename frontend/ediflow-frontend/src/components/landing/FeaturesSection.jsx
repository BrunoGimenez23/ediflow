import { Building2, Cloud, CreditCard } from 'lucide-react';
import React from 'react';

const features = [
  {
    icon: <Building2 className="w-12 h-12 text-ediblue" />,
    title: "Administración de edificios",
    desc: "Centralizá toda la información de tus edificios, departamentos y residentes desde un solo lugar.",
  },
  {
    icon: <CreditCard className="w-12 h-12 text-ediblue" />,
    title: "Control de pagos",
    desc: "Registrá y monitoreá pagos, vencimientos y estados de cuenta de manera clara y ordenada.",
  },
  {
    icon: <Cloud className="w-12 h-12 text-ediblue" />,
    title: "Fácil de usar",
    desc: "Diseño intuitivo pensado para que empieces a usarlo desde el primer día, sin capacitación.",
  },
];

const FeaturesSection = ({ id }) => {
  return (
    <section id={id} className="bg-edigray w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-editext">
            Todo lo que necesitás para administrar tus edificios sin complicaciones
          </h2>
          <p className="text-editext mt-2 max-w-xl mx-auto">
            Simplificá la gestión de residentes, pagos y reservas con una plataforma ágil, visual y hecha para administradores como vos.
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
              <h3 className="text-xl font-semibold text-editext mb-2">{title}</h3>
              <p className="text-editext">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
