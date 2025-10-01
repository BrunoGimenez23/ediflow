import { Building2, CreditCard, ShieldCheck, Users2 } from 'lucide-react';
import React from 'react';

const features = [
  {
    icon: <Building2 className="w-12 h-12 text-ediblue" />,
    title: "Gestioná tus edificios y apartamentos sin complicaciones",
    desc: "Creá y organizá unidades, asigná residentes y mantené todo actualizado desde un único panel. Ahorrá horas de trabajo cada semana y reducí errores.",
  },
  {
    icon: <CreditCard className="w-12 h-12 text-ediblue" />,
    title: "Pagos claros, rápidos y siempre al día",
    desc: "Emití expensas y registrá pagos online con actualización automática. Reducí la morosidad y obtené reportes claros para tomar decisiones rápidamente.",
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-ediblue" />,
    title: "Portería digital y control total de accesos",
    desc: "Registrá visitas y paquetes, verificá pagos y reservas al instante, y asegurá que solo ingresen quienes correspondan. Menos conflictos, más seguridad.",
  },
  {
    icon: <Users2 className="w-12 h-12 text-ediblue" />,
    title: "Marketplace y pagos a proveedores sin estrés",
    desc: "Contratá proveedores y registrá pagos de forma centralizada. Pagos online, historial completo y control total para simplificar tu administración.",
  },
];

const FeaturesSection = ({ id }) => {
  return (
    <section id={id} className="bg-edigray w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-editext">
            Simplificá tu administración y ganá tiempo real
          </h2>
          <p className="text-editext mt-2 max-w-xl mx-auto">
            Con Ediflow, todo tu edificio se gestiona desde un único panel intuitivo: pagos, residentes, reservas, portería y proveedores. Menos estrés, menos errores y más eficiencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
          {features.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md w-full max-w-xs text-center hover:shadow-lg hover:scale-[1.03] transition duration-300"
            >
              <div className="flex justify-center mb-4">
                {icon}
              </div>
              <h3 className="text-xl font-semibold text-editext mb-2">{title}</h3>
              <p className="text-editext text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
