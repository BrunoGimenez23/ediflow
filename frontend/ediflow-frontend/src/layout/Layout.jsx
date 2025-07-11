import {  Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TrialExpiredBanner from "../components/common/TrialExpiredBanner";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const trialExpired = user?.role === "ADMIN" && (user.trialDaysLeft === 0 || user.trialDaysLeft === null);

  const handleUpgradeClick = () => {
      navigate('/admin/planes'); 
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />

        {trialExpired && <TrialExpiredBanner onClickUpgrade={handleUpgradeClick} />}

        <main className="flex-1 overflow-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
