import { Building2, Cloud, CreditCard } from 'lucide-react';
import React from 'react';

const features = [
  {
    icon: <Building2 className="w-12 h-12 text-ediblue" />,
    title: "Todo tu edificio, en un solo lugar",
    desc: "Olvidate de los archivos sueltos y planillas. Gestioná residentes, unidades y datos clave desde una sola plataforma.",
  },
  {
    icon: <CreditCard className="w-12 h-12 text-ediblue" />,
    title: "Cobros organizados y sin olvidos",
    desc: "Emití expensas, registrá pagos y seguí vencimientos fácilmente. Tus cuentas siempre al día, sin confusiones.",
  },
  {
    icon: <Cloud className="w-12 h-12 text-ediblue" />,
    title: "Fácil desde el primer día",
    desc: "No necesitás capacitación ni soporte técnico. Empezá a usar Ediflow en minutos y descubrí lo simple que puede ser.",
  },
];

const FeaturesSection = ({ id }) => {
  return (
    <section id={id} className="bg-edigray w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-editext">
            La herramienta que simplifica tu trabajo de administración
          </h2>
          <p className="text-editext mt-2 max-w-xl mx-auto">
            Ediflow te ayuda a ahorrar tiempo, reducir errores y tener todo bajo control. Menos caos, más gestión inteligente.
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
