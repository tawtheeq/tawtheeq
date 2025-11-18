import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/main.scss';

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
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* <h2 className="logo">لوحة التحكم</h2> */}
        <img src="/assets/logo.png" alt="شعار المنصة" className='logo' />
        <nav>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={location.pathname === '/dashboard/' + item.path ? 'active' : ''}
                >
                  {/* render icon if provided, fallback to a small circle */}
                  <i className={`${item.icon ? item.icon : 'fas fa-circle'} menu-icon`} aria-hidden="true"></i>
                  <span className="menu-title">{item.title}</span>
                  {item.submenu && <i className={`arrow fas fa-chevron-down ${isOpen ? 'open' : ''}`}></i>}
                </Link>
                {item.submenu && (
                  <ul className={`submenu ${isOpen ? 'open' : ''}`}>
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={subItem.path}
                          className={location.pathname === subItem.path ? 'active' : ''}
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
        <div className="sidebar-footer">
          <div className="user-status">
            <span className="status-indicator"></span>
            <span className="status-text">متصل</span>
          </div>
        </div>
      </aside>
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      ></div>
    </>
  );
}
