import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";


export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:bg-gray-900 font-sans text-gray-900" dir="rtl">
      <aside className="w-64 fixed inset-y-0 right-0 z-50 transition-transform duration-300 ease-in-out transform translate-x-0 bg-white/80 backdrop-blur-md border-l border-gray-200 shadow-xl">
        <Sidebar />
      </aside>

      <main className="flex-1 mr-64 min-h-screen flex flex-col transition-all duration-300">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <Header />
        </header>
        <div className="p-6 overflow-y-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
