import StatCard from './StatCard'
import { Building, Users, DollarSign, MapPin } from 'lucide-react'
import PaymentsChart from './PaymentsChart'
import { Link } from 'react-router-dom'
import { useBuildingsContext } from '../../contexts/BuildingContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { usePaymentContext } from '../../contexts/PaymentContext'
import { useAuth } from '../../contexts/AuthContext'

const planFeatures = {
  ESENCIAL: {
    canSeePayments: false,
    canManageResidents: true,
    canViewBuildings: true,
    canViewCommonAreas: false,
  },
  PROFESIONAL: {
    canSeePayments: true,
    canManageResidents: true,
    canViewBuildings: true,
    canViewCommonAreas: true,
  },
  PREMIUM_PLUS: {
    canSeePayments: true,
    canManageResidents: true,
    canViewBuildings: true,
    canViewCommonAreas: true,
  },
}

const can = (userPlan, feature) => {
  if (!userPlan || userPlan.trim() === "") {
    userPlan = "PROFESIONAL";
  }
  const normalizedPlan = userPlan.toUpperCase().replace(/\s+/g, '_');
  const plan = planFeatures[normalizedPlan];
  return plan ? plan[feature] === true : false;
}


const DashboardOverview = () => {
  const { user, token } = useAuth()
  const { buildings = [] } = useBuildingsContext()
  const { paymentsPage } = usePaymentContext()

  const [residentCount, setResidentCount] = useState(0)
  const [commonAreasCount, setCommonAreasCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) {
      setError("No hay token de autenticación.")
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [resResidents, resCommonAreas] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/residents/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/common-areas/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        setResidentCount(resResidents.data?.content?.length ?? 0)
        setCommonAreasCount(Array.isArray(resCommonAreas.data) ? resCommonAreas.data.length : 0)
      } catch (err) {
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data.message || JSON.stringify(err.response.data)}`)
        } else {
          setError("Error al cargar datos del dashboard")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const stats = [
    {
      type: 'Edificios',
      number: buildings.length,
      icon: <Building />,
      color: 'text-ediblue',
      link: '/admin/buildings',
      feature: 'canViewBuildings',
    },
    {
      type: 'Residentes',
      number: residentCount,
      icon: <Users />,
      color: 'text-edicyan',
      link: '/admin/residents',
      feature: 'canManageResidents',
    },
    {
      type: 'Pagos',
      number: paymentsPage?.totalElements ?? 0,
      icon: <DollarSign />,
      color: 'text-edigreen',
      link: '/admin/payment/all',
      feature: 'canSeePayments',
    },
    {
      type: 'Áreas Comunes',
      number: commonAreasCount,
      icon: <MapPin />,
      color: 'text-ediorange',
      link: '/admin/common-areas/all',
      feature: 'canViewCommonAreas',
    },
  ]

  
  const filteredStats = stats.filter(stat => {
    if (!user) return false

    const role = user.role?.toUpperCase()

    if (role === "ADMIN") {
      // Para admin, chequea también permisos según plan
      if (!can(user.plan, stat.feature)) return false
      return true
    }

    // Para employee y support, ignora plan, filtra sólo por rol
    if (role === "EMPLOYEE") {
      return stat.type !== "Pagos" // ejemplo: empleados no ven pagos
    }
    if (role === "SUPPORT") {
      return ["Residentes", "Áreas Comunes"].includes(stat.type)
    }

    return false
  })

  const showPaymentsChart = user?.role?.toUpperCase() === "ADMIN" && can(user.plan, "canSeePayments")

  if (loading) return <p className="text-center py-8">Cargando datos del dashboard...</p>
  if (error) return <p className="text-center py-8 text-red-600">{error}</p>

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredStats.map((stat) => (
          <Link
            to={stat.link}
            key={stat.type}
            className="block rounded-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-ediblue"
            aria-label={`Ver detalles de ${stat.type}`}
          >
            <StatCard {...stat} />
          </Link>
        ))}
      </div>

      {showPaymentsChart && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Resumen de pagos</h2>
          <div className="bg-white rounded shadow p-6">
            <PaymentsChart />
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardOverview
