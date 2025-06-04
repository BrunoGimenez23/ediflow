import React from 'react'
import StatCard from './StatCard'
import { Building, Users, DollarSign } from 'lucide-react'
import PaymentsChart from './PaymentsChart'

const DashboardOverview = () => {
  const stats = [
    { type: 'edificios', number: 2, icon: <Building />, color: 'text-ediblue' },
    { type: 'residentes', number: 2, icon: <Users />, color: 'text-edicyan' },
    { type: 'pagos', number: 10, icon: <DollarSign />, color: 'text-edigreen' }
  ]

  return (
    
<div className="p-6 flex flex-col gap-6">
  <div className="flex flex-wrap gap-6">
    {stats.map((stat, i) => (
      <StatCard key={i} {...stat} />
    ))}
  </div>
  
  <PaymentsChart />
</div>
  )
}


export default DashboardOverview