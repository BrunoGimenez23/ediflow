
import { useNavigate } from 'react-router-dom'

const RegisterSelector = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 shadow-md rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-6 text-ediblue">Registrarse en Ediflow</h2>
      <p className="mb-6 text-gray-600">Elegí el tipo de cuenta que querés crear:</p>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/auth/register-admin')}
          className="w-full bg-ediblue text-white py-2 rounded-md hover:bg-ediblueLight transition duration-200"
        >
          Registro de Administrador
        </button>

        <button
          onClick={() => navigate('/auth/register-provider')}
          className="w-full bg-edicyan text-white py-2 rounded-md hover:bg-edicyanLight transition duration-200"
        >
          Registro de Proveedor
        </button>
      </div>
    </div>
  )
}

export default RegisterSelector
