
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-edigray flex justify-between items-center px-40 text-lg font-medium shadow">
      <h2>Hola, Admin!</h2>
      {/* <h2>Hola, {user?.fullName || user?.username || "Admin"}!</h2> */}
      <h2>Salir</h2>
    </header>
  )
}

export default Header