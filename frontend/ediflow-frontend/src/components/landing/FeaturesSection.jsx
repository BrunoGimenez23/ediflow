import { Building2, Cloud, CreditCard, DollarSign, DollarSignIcon } from 'lucide-react'
import React from 'react'
import { GiPayMoney } from 'react-icons/gi'

const FeaturesSection = () => {
  return (
    <div className='bg-edigray w-full pb-20'>
  <div className='max-w-7xl mx-auto px-6'>
    <div className="text-center mb-8">
      <h2 className='py-8 text-4xl font-bold text-editext'>Funcionalidades principales</h2>
    </div>
    <div className='flex flex-col md:flex-row justify-evenly items-center gap-8'>
      {[{
        icon: <Building2 className="w-20 h-12 text-ediblue mb-4" aria-hidden="true" />,
        title: "Administración de edificios",
        desc: "Gestiona edificios, departamentos y residentes desde un solo lugar."
      },{
        icon: <CreditCard className="w-20 h-12 text-ediblue mb-4" aria-hidden="true" />,
        title: "Control de pagos",
        desc: "Lleva el control de pagos y vencimientos de cada residente."
      },{
        icon: <Cloud className="w-20 h-12 text-ediblue mb-4" aria-hidden="true" />,
        title: "Fácil de usar",
        desc: "Diseñada para que cualquier administrador gestione su edificio sin complicaciones."
      }].map(({icon, title, desc}, i) => (
        <div key={i} className='flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md w-64 min-h-[16rem]'>
          {icon}
          <h3 className='text-xl mb-2'>{title}</h3>
          <p className="text-editext">{desc}</p>
        </div>
      ))}
    </div>
  </div>
</div>
  )
}

export default FeaturesSection