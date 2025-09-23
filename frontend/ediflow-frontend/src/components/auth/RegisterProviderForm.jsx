import { useState } from 'react'
import usePost from '../../hooks/usePost'
import { useNavigate } from 'react-router-dom'

const RegisterProviderForm = () => {
  const { post, loading, error } = usePost()
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await post('/auth/register-provider', {
      username,
      fullName,
      email,
      password,
      companyName,
      contactName,
      phone,
      address,
      category,
      location,
    })

    if (res) {
      setSuccess(true)
      setTimeout(() => navigate('/auth/login'), 2000)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white p-10 shadow-xl rounded-2xl">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-ediblue">Registro de Proveedor</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de usuario */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Nombre de usuario</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ediblue transition"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Nombre completo</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre completo"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ediblue transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ediblue transition"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Contraseña</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ediblue transition"
            />
          </div>
        </div>

        {/* Información de la empresa */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Nombre de la empresa</label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Nombre de la empresa"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ediblue transition"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Nombre del contacto</label>
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Nombre del contacto"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ediblue transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Teléfono</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Teléfono"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ediblue transition"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Dirección</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dirección"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ediblue transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Categoría</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Categoría"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ediblue transition"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Ubicación</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ubicación"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ediblue transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ediblue text-white py-3 rounded-xl hover:bg-ediblueLight transition duration-200 font-semibold text-lg"
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
      {success && <p className="mt-4 text-green-600 text-sm text-center">¡Registro exitoso! Redirigiendo al login...</p>}
    </div>
  )
}

export default RegisterProviderForm
