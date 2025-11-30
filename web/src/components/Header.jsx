import { useNavigate } from 'react-router-dom';


export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <img src="/assets/justLogo.png" alt="توثيق" className="w-10 h-10 object-contain" />
        <h1 className="text-xl font-bold text-gray-800">تابع</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200 shadow-sm">م</div>
          <div className="hidden md:block text-right">
            <div className="text-sm font-bold text-gray-800">محمد أحمد</div>
            <div className="text-xs text-gray-500">مدير النظام</div>
          </div>
        </div>

        {/* <div className="relative p-2 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          <i className="fas fa-bell text-xl"></i>
        </div> */}

        {/* <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={handleLogout}>
          تسجيل خروج
        </button> */}

      </div>
    </header>
  );
}
