import React from 'react'
import { DiAndroid } from 'react-icons/di'

const CTASection = () => {
  return (
    <div className="bg-edigray py-16">
      <section className="bg-ediblue text-white py-16 px-6 text-center rounded-lg mx-auto max-w-4xl mt-12">
      <h2 className="text-3xl font-bold mb-4">¿Listo para mejorar la administración de tu edificio?</h2>
      <p className="mb-8 text-lg max-w-xl mx-auto">
        Comenzá tu prueba gratuita de 14 días sin tarjeta de crédito y descubrí por qué Ediflow es la mejor solución para vos.
      </p>
      <button className="bg-white text-ediblue font-semibold py-3 px-8 rounded-md hover:bg-gray-200 transition">
        Empezar prueba gratis
      </button>
    </section>
    </div>
    
  )
}

export default CTASection