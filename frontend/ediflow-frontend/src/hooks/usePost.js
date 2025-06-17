import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

const usePost = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const post = async (endpoint, body) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Error ${res.status}: ${res.statusText} - ${text}`)
      }

      const data = await res.json()
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { post, loading, error }
}

export default usePost