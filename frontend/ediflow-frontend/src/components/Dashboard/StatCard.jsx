import React from 'react'


const StatCard = ({ icon, number, type, color = 'text-ediblue' }) => {
    return (
      <div className='bg-white w-64 h-64 rounded-lg shadow-md flex flex-col items-center justify-center gap-4'>
        <div className={`text-4xl ${color} w-16 h-16 flex items-center justify-center rounded-full bg-gray-100`}>
          {icon}
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{number}</h2>
        <h3 className="text-lg text-gray-500">Total {type}</h3>
      </div>
    )
  }

export default StatCard