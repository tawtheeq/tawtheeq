import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      title: 'الرئيسية',
      path: '/dashboard',

    },
    {
      title: 'المستخدمون',
      path: 'users',
      icon: 'fas fa-users',
    },
    {
      title: 'التصنيفات',
      path: 'categories',
      icon: 'fas fa-users',
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
    }
  ];

  return (
    <>
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white/80 backdrop-blur-md border-l border-gray-200 shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:static md:shadow-none`}>
        {/* <h2 className="text-2xl font-bold text-center py-6 text-green-800">لوحة التحكم</h2> */}
        <div className="flex justify-center py-6 border-b border-gray-100">
          <img src="/assets/logo.png" alt="شعار المنصة" className='w-24' />
        </div>
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${location.pathname === '/dashboard/' + item.path || (item.path === '/dashboard' && location.pathname === '/dashboard')
                    ? 'bg-green-50 text-green-800 font-semibold shadow-sm ring-1 ring-green-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {/* render icon if provided, fallback to a small circle */}
                    <i className={`${item.icon ? item.icon : 'fas fa-circle'} w-5 text-center`} aria-hidden="true"></i>
                    <span className="text-base">{item.title}</span>
                  </div>
                  {item.submenu && <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>}
                </Link>
                {item.submenu && (
                  <ul className={`pl-8 mt-2 space-y-1 ${isOpen ? 'block' : 'hidden'}`}>
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={subItem.path}
                          className={`block p-2 rounded-lg text-sm transition-colors ${location.pathname === subItem.path
                            ? 'text-green-800 font-medium bg-green-50'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className=" w-full p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-600">متصل</span>
          </div>
        </div>
      </aside>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>
    </>
  );
}
