import React from 'react'

const PricingPlans = () => {
  return (
    <section className="py-16 bg-edigray">
  <div className="max-w-7xl mx-auto px-4 text-center">
    {/* Título */}
    <h2 className="text-3xl font-bold text-ediblue mb-8">Elige tu plan y suscribite</h2>

    {/* Contenedor de las cards */}
    <div className="flex flex-col md:flex-row justify-center gap-8">
      
      {/* Card Plan Básico */}
      <div className="flex flex-col bg-white border rounded-lg shadow-md p-6 w-full md:w-1/3">
        <h3 className="text-xl font-semibold mb-4">Plan Básico</h3>
        <p className="text-4xl font-bold text-ediblue mb-4">$10<span className="text-base font-normal">/mes</span></p>
        <p className="mb-6 text-gray-700">Perfecto para empezar a administrar tu primer edificio sin complicaciones.</p>
        <ul className="flex-1 space-y-2 text-gray-700">
          <li>✔ Gestión de un edificio</li>
          <li>✔ Hasta 20 departamentos</li>
          <li>✔ Soporte vía email</li>
        </ul>
        <button className="bg-ediblue text-white rounded-md py-3 font-semibold hover:bg-ediblueLight transition">
          Suscribirme al Básico
        </button>
      </div>

      {/* Card Plan Pro */}
      <div className="flex flex-col bg-white border rounded-lg shadow-md p-6 w-full md:w-1/3">
        <h3 className="text-xl font-semibold mb-4">Plan Pro</h3>
        <p className="text-4xl font-bold text-ediblue mb-4">$30<span className="text-base font-normal">/mes</span></p>
        <p className="mb-6 text-gray-700">Para quienes necesitan administrar varios edificios y tener más control.</p>
        <ul className="flex-1 space-y-2 mb-6 text-gray-700">
          <li>✔ Gestión ilimitada de edificios</li>
          <li>✔ Hasta 100 departamentos</li>
          <li>✔ Soporte prioritario</li>
          <li>✔ Reportes básicos</li>
        </ul>
        <button className="bg-ediblue text-white rounded-md py-3 font-semibold hover:bg-ediblueLight transition">
          Suscribirme al Pro
        </button>
      </div>

      {/* Card Plan Enterprise */}
      <div className="flex flex-col bg-white border rounded-lg shadow-md p-6 w-full md:w-1/3">
        <h3 className="text-xl font-semibold mb-4">Plan Enterprise</h3>
        <p className="text-4xl font-bold text-ediblue mb-4">$50<span className="text-base font-normal">/mes</span></p>
        <p className="mb-6 text-gray-700">Solución completa con soporte dedicado y funciones avanzadas para tu empresa.</p>
        <ul className="flex-1 space-y-2 mb-6 text-gray-700">
          <li>✔ Gestión ilimitada</li>
          <li>✔ Departamentos ilimitados</li>
          <li>✔ Soporte dedicado 24/7</li>
          <li>✔ Reportes avanzados</li>
          <li>✔ Integraciones personalizadas</li>
        </ul>
        <button className="bg-ediblue text-white rounded-md py-3 font-semibold hover:bg-ediblueLight transition">
          Suscribirme al Enterprise
        </button>
      </div>
      
    </div>
  </div>
</section>
  )
}

export default PricingPlans