import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import TrialExpiredBanner from "../components/common/TrialExpiredBanner";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Control del sidebar mobile

  const handleUpgradeClick = () => {
    navigate("/admin/planes");
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-1">
        <Header onToggleSidebar={() => setIsOpen((prev) => !prev)} />

        {user && (
          <TrialExpiredBanner user={user} onClickUpgrade={handleUpgradeClick} />
        )}

        <main className="flex-1 overflow-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
