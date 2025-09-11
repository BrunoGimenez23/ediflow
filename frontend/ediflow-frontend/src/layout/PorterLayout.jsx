import { Outlet } from "react-router-dom";

const PorterLayout = () => {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4">
        <h1>Portero - Dashboard</h1>
      </header>
      <main className="p-4">
        <Outlet /> {/* Aquí se renderizan las rutas hijas */}
      </main>
    </div>
  );
};

export default PorterLayout;
