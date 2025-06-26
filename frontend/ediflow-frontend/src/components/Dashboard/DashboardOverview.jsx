import StatCard from './StatCard'
import { Building, Users, DollarSign, MapPin } from 'lucide-react'
import PaymentsChart from './PaymentsChart'
import { Link } from 'react-router-dom'
import { useBuildingsContext } from '../../contexts/BuildingContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { usePaymentContext } from '../../contexts/PaymentContext'

const DashboardOverview = () => {
  const { buildings } = useBuildingsContext()
  const [residentCount, setResidentCount] = useState(0)
  const { payments } = usePaymentContext()
  const [commonAreasCount, setCommonAreasCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const [resResidents, resCommonAreas] = await Promise.all([
          axios.get('http://localhost:8080/residents/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8080/common-areas/all', { headers: { Authorization: `Bearer ${token}` } }),
        ])
        setResidentCount(resResidents.data.length)
        setCommonAreasCount(resCommonAreas.data.length)
        setError(null)
      } catch (err) {
        setError('Error al cargar datos del dashboard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    {
      type: 'Edificios',
      number: buildings.length,
      icon: <Building />,
      color: 'text-ediblue',
      link: '/admin/buildings',
    },
    {
      type: 'Residentes',
      number: residentCount,
      icon: <Users />,
      color: 'text-edicyan',
      link: '/admin/residents',
    },
    {
      type: 'Pagos',
      number: payments.length,
      icon: <DollarSign />,
      color: 'text-edigreen',
      link: '/admin/payment/all',
    },
    {
      type: 'Áreas Comunes',
      number: commonAreasCount,
      icon: <MapPin />,
      color: 'text-ediorange',
      link: '/admin/common-areas/all',
    },
  ]

  if (loading) return <p className="text-center py-8">Cargando datos del dashboard...</p>
  if (error) return <p className="text-center py-8 text-red-600">{error}</p>

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            to={stat.link}
            key={stat.type}
            className="block rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ediblue"
            aria-label={`Ver detalles de ${stat.type}`}
          >
            <StatCard {...stat} />
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-6">Resumen de pagos</h2>
      <div className="bg-white rounded shadow p-6">
        <PaymentsChart />
      </div>
    </div>
  )
}

export default DashboardOverview
