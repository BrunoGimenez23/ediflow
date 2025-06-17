import StatCard from './StatCard'
import { Building, Users, DollarSign } from 'lucide-react'
import PaymentsChart from './PaymentsChart'
import { Link } from 'react-router-dom'
import { useBuildingsContext } from '../../contexts/BuildingContext'

const DashboardOverview = () => {
  const { buildings, loading } = useBuildingsContext();

  const stats = [
    {
      type: 'edificios',
      number: buildings.length,
      icon: <Building />,
      color: 'text-ediblue',
      link: '/admin/buildings'
    },
    {
      type: 'residentes',
      number: 60, // esto también lo podés sacar de contexto cuando lo tengas
      icon: <Users />,
      color: 'text-edicyan',
      link: '/admin/residents'
    },
    {
      type: 'pagos',
      number: 10, // lo mismo, más adelante
      icon: <DollarSign />,
      color: 'text-edigreen',
      link: '/admin/payments'
    }
  ];

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-wrap gap-6">
        {stats.map((stat) => (
          <Link to={stat.link} key={stat.type}>
            <StatCard {...stat} />
          </Link>
        ))}
      </div>

      <PaymentsChart />
    </div>
  )
}

export default DashboardOverview
