import React from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const links = [
    { path: "/marketplace/providers", label: "Proveedores" },
    { path: "/marketplace/orders", label: "Órdenes" },
    { path: "/marketplace/quotes", label: "Cotizaciones" },
  ];

  return (
    <div className="w-64 bg-gray-100 min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6">Marketplace Admin</h1>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-2 rounded ${
              location.pathname === link.path
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

const MarketplaceDashboard = () => {
  const { user, ready } = useAuth();

  if (!ready) return <div className="text-center p-10">Cargando usuario...</div>;

  const role = user?.role?.toUpperCase() || "";
  if (role !== "ADMIN") return <Navigate to="/" replace />;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MarketplaceDashboard;
