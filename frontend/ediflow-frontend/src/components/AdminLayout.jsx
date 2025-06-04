import Header from "./Header"
import DashboardOverview from "./Dashboard/DashboardOverview"
import Sidebar from "./Sidebar"

const AdminDashboard = () => {
  return (
    <>

    <div className="flex flex-row h-screen">
      <Sidebar />
      
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-white overflow-y-auto">
          <DashboardOverview />
        </div>
      </div>
    </div>

    </> 
  )
}

export default AdminDashboard