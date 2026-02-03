import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";


export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-gray-900 relative overflow-hidden" dir="rtl">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <aside className="w-80 fixed inset-y-0 right-0 z-50 p-4 transition-all duration-500">
        <div className="h-full glass-card overflow-hidden flex flex-col">
          <Sidebar />
        </div>
      </aside>

      <main className="flex-1 mr-80 min-h-screen relative z-10 flex flex-col p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>

        <footer className="mt-auto py-8 text-center">
          <p className="text-gray-400 text-sm font-medium">
            تم التطوير بواسطة <span className="text-dark-green font-bold">مهند دياب</span> &copy; ٢٠٢٦
          </p>
        </footer>
      </main>
    </div>
  );
}

