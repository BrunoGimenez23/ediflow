import React from 'react'
import logo from '../assets/logo.png'
import { Building, Users, DollarSign, HouseIcon } from 'lucide-react'

const Sidebar = () => {
  return (
    <>

      <div className="w-64 h-screen bg-ediblue text-white flex flex-col items-center p-4">
        <div className="mb-8">
          <img src={logo} alt="Ediflow Logo" className="w-44 mx-auto" />
        </div>

        <div className="flex-grow flex flex-col justify-center w-full mt-[-200px]">
          <ul className="space-y-4 text-lg font-medium w-full">
            <li className="flex items-center gap-3 px-4 py-2 hover:text-edicyan cursor-pointer">
              <Building className="text-edigray" />
              Edificios
            </li>
            <li className="flex items-center gap-3 px-4 py-2 hover:text-edicyan cursor-pointer">
              <Users className="text-edigray" />
              Residentes
            </li>
            <li className="flex items-center gap-3 px-4 py-2 hover:text-edicyan cursor-pointer">
              <HouseIcon className="text-edigray" />
              Apartamentos
            </li>
            <li className="flex items-center gap-3 px-4 py-2 hover:text-edicyan cursor-pointer">
              <DollarSign className="text-edigray" />
              Pagos
            </li>
          </ul>
        </div>
      </div>

    </>

  )
}

export default Sidebar