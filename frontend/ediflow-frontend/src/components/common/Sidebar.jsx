import React from 'react'
import logo from '../../assets/iconos/logo.png';
import { Building, Users, DollarSign, HouseIcon } from 'lucide-react'
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="w-64 h-screen bg-ediblue text-white flex flex-col items-center p-4">
      <div className="mb-8">
        <img src={logo} alt="Ediflow Logo" className="w-44 mx-auto" />
      </div>

      <div className="flex-grow flex flex-col justify-center w-full mt-[-200px]">
        <ul className="space-y-4 text-lg font-medium w-full">
          <li>
            <Link to="/admin/buildings" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
              <Building className="text-edigray" />
              Edificios
            </Link>
          </li>
          <li>
            <Link to="/admin/residents" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
              <Users className="text-edigray" />
              Residentes
            </Link>
          </li>
          <li>
            <Link to="/admin/apartments" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
              <HouseIcon className="text-edigray" />
              Apartamentos
            </Link>
          </li>
          <li>
            <Link to="/admin/payments" className="flex items-center gap-3 px-4 py-2 hover:text-edicyan">
              <DollarSign className="text-edigray" />
              Pagos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Sidebar