import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidad – Ediflow</h1>
      <p className="mb-4">Última actualización: 17 de septiembre de 2025</p>
      <p className="mb-4">
        En <strong>Ediflow</strong> recopilamos información básica como tu nombre, correo y teléfono
        para gestionar edificios y enviar avisos vía WhatsApp. La información se usa únicamente
        para operar la plataforma y se protege con medidas de seguridad técnicas y administrativas.
      </p>
      <p className="mb-4">
        Para cualquier consulta sobre tus datos, escribí a <strong>soporte@ediflow.com</strong>.
      </p>
      <p className="text-sm text-gray-500">
        Esta política de privacidad es válida mientras uses la aplicación y puede actualizarse
        ocasionalmente.
      </p>
    </div>
  );
};

export default PrivacyPolicy;