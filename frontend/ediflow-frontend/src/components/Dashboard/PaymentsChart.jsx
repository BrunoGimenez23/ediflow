import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const data = [
  { day: '01', monto: 1200 },
  { day: '05', monto: 2100 },
  { day: '10', monto: 800 },
  { day: '15', monto: 1600 },
  { day: '20', monto: 2400 },
  { day: '25', monto: 1800 },
  { day: '30', monto: 3000 },
]

const PaymentsChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full h-80 mt-6">
      <h2 className="text-lg font-semibold mb-4">Pagos del mes</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colormonto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="monto"
            stroke="#06b6d4"
            fillOpacity={1}
            fill="url(#colormonto)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PaymentsChart