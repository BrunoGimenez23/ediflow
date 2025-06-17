import { useState } from 'react'
import usePost from '../../hooks/usePost'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const { post, loading, error } = usePost()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await post('/auth/login-admin', {
      email,
      password,
    })

    if (res?.token) {
      // Guardar token en localStorage
      localStorage.setItem('token', res.token)
      // Redirigir al dashboard
      navigate('/admin') // o la ruta que tengas para el admin
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-ediblue">Iniciar sesión</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ediblue text-white py-2 rounded-md hover:bg-ediblueLight transition duration-200"
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
    </div>
  )
}

export default LoginForm