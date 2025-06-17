
import { useState } from 'react'
import usePost from '../../hooks/usePost'
import { useNavigate } from 'react-router-dom'

const RegisterForm = () => {
    const {post, loading, error} = usePost()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [adminCode, setAdminCode] = useState('')
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
  e.preventDefault()
  const res = await post('/auth/register-admin', {
    username,
    email,
    password,
    inviteCode: adminCode,
  })

  if (res) {
    setSuccess(true)
    setTimeout(() => navigate('/auth/login-admin'), 2000)
  }
}

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-ediblue">Registro de Administrador</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Nombre de usuario"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Correo electrónico"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Contraseña"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
        />
        <input
        value={adminCode}
        onChange={(e) => setAdminCode(e.target.value)}
        type="text"
        placeholder="Código de administrador"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ediblue"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ediblue text-white py-2 rounded-md hover:bg-ediblueLight transition duration-200"
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
      {success && <p className="mt-4 text-green-600 text-sm text-center">¡Registro exitoso! Redirigiendo al login...</p>}
    </div>
  )
}

export default RegisterForm