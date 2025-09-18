import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TrialExpiredBanner from "../components/common/TrialExpiredBanner";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    navigate('/admin/planes');
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />

        {/* Renderizar banner solo si el usuario existe; el banner mismo valida si se muestra */}
        {user && <TrialExpiredBanner user={user} onClickUpgrade={handleUpgradeClick} />}

        <main className="flex-1 overflow-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
