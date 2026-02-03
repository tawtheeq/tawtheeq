import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: 'الرئيسية', path: '/dashboard', icon: 'fas fa-th-large' },
    { title: 'المهام', path: 'missions', icon: 'fas fa-calendar-check' },
    { title: 'الموظفين', path: 'users', icon: 'fas fa-users' },
    { title: 'التقارير', path: 'reports', icon: 'fas fa-chart-pie' },
    { title: 'الإعدادات', path: 'settings', icon: 'fas fa-sliders-h' },
    { title: 'عن المنصة', path: 'about', icon: 'fas fa-info-circle' }
  ];

  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-md">
      {/* Logo Section */}
      <div className="p-8 premium-gradient relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-lg mb-4 border border-white/20 shadow-lg transform group-hover:scale-110 transition-transform duration-500">
            <img src="/assets/mod_white.svg" alt="Logo" className="h-16 w-16 object-contain" />
          </div>
          <h2 className="text-xl font-black text-white text-center tracking-tight">منصة توثيق</h2>
          <div className="h-1 w-12 bg-white/30 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-10 px-6 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === '/dashboard/' + item.path || (item.path === '/dashboard' && location.pathname === '/dashboard');
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive
                ? 'bg-dark-green text-white shadow-lg shadow-green-900/20 translate-x-[-4px]'
                : 'text-gray-500 hover:bg-white hover:text-dark-green hover:shadow-sm'
                }`}
            >
              <i className={`${item.icon} text-lg transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-dark-green'}`}></i>
              <span className={`text-base font-bold ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.title}</span>
              {isActive && <div className="mr-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-6 mt-auto">
        <div className="bg-white/60 rounded-[2.5rem] p-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-dark-green flex items-center justify-center text-white font-black text-lg shadow-md">
              <span>م</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-black text-gray-800 truncate">مهند أحمد</div>
              <div className="text-[10px] font-bold text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full mt-0.5 uppercase tracking-wider">مدير النظام</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 text-red-600 font-bold text-sm rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <i className="fas fa-power-off text-xs group-hover:rotate-180 transition-transform duration-500"></i>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
}

