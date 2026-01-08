import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      title: 'الرئيسية',
      path: '/dashboard',
      icon: 'fas fa-home',
    },
    {
      title: 'المهام',
      path: 'missions',
      icon: 'fas fa-tasks',
    },
    {
      title: 'التقارير',
      path: 'reports',
      icon: 'fas fa-chart-bar'
    },
    {
      title: 'الإعدادات',
      path: 'settings',
      icon: 'fas fa-cog'
    },
    {
      title: 'عن البرنامج',
      path: 'about',
      icon: 'fas fa-info-circle'
    }
  ];

  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      navigate('/login');
    }
  };

  return (
    <>
      <aside className={`relative fixed inset-y-0 right-0 z-50 w-64 bg-white/80 backdrop-blur-md border-l border-gray-200 shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:static md:shadow-none flex flex-col`}>

        {/* App Name Header */}
        <div className="p-6 border-b border-gray-100 bg-[#29504d]">

          <div className="flex justify-center mb-3">
            <img src="/assets/mod_white.svg" alt="شعار المنصة" className="h-32 object-contain" />
          </div>
          <h2 className="text-lg font-bold text-white text-center">إدارة العمليات الإعلامية</h2>
          <p className="text-xs text-green-100 text-center mt-1">نظام إدارة المهام</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 mt-6 px-4 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${location.pathname === '/dashboard/' + item.path || (item.path === '/dashboard' && location.pathname === '/dashboard')
                    ? 'bg-green-50 text-dark-green font-semibold shadow-sm ring-1 ring-green-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`${item.icon ? item.icon : 'fas fa-circle'} w-5 text-center`} aria-hidden="true"></i>
                    <span className="text-base">{item.title}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-700 font-bold border border-green-200">
              م
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-800">مهند أحمد</div>
              <div className="text-xs text-gray-500">مدير النظام</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-50 text-red-600 text-sm rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i>
            تسجيل الخروج
          </button>
        </div>

      </aside>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>
    </>
  );
}
