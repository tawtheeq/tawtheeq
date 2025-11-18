import { useNavigate } from 'react-router-dom';
import '../styles/main.scss';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__logo">
        <img src="/assets/justLogo.png" alt="توثيق" />
        <h1> إدارة العمليات الإعلامية</h1>
      </div>
      
      <div className="header__actions">
        <div className="user-info">
          <div className="avatar">م</div>
          <div>
            <div className="user-name">محمد أحمد</div>
            <div className="user-role">مدير النظام</div>
          </div>
        </div>
        
        {/* <div className="notifications">
          <span className="badge">3</span>
          <i className="fas fa-bell"></i>
        </div> */}
        
        {/* <button className="logout-button" onClick={handleLogout}>
          تسجيل خروج
        </button> */}

      </div>
    </header>
  );
}
