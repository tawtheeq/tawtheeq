import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import '../styles/pages/dashboard.scss';

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <Sidebar />
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <Header />
        </header>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
